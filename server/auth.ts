import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  if (!stored || !stored.includes(".")) {
    // For handling non-hashed passwords during development/testing
    return supplied === stored;
  }
  
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "luxe-nails-secret-key",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Local Strategy for username/password login
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const user = await storage.getUserByUsername(username);
      if (!user || !(await comparePasswords(password, user.password))) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    }),
  );
  
  // Google OAuth Strategy
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
  const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || "http://localhost:5173/api/auth/google/callback";
  const ADMIN_EMAIL = "sparshgupta643@gmail.com"; // Define admin email for comparison
  
  if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: GOOGLE_CLIENT_ID,
          clientSecret: GOOGLE_CLIENT_SECRET,
          callbackURL: "/api/auth/google/callback",
          scope: ["profile", "email"],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            // Check if user already exists with this Google ID
            let user = await storage.getUserByGoogleId(profile.id);
            
            if (!user) {
              // Create a new user if not found
              const googleEmail = profile.emails && profile.emails[0] ? profile.emails[0].value : "";
              const displayName = profile.displayName || "GoogleUser";
              
              // Check if email already exists
              if (googleEmail) {
                const existingUser = await storage.getUserByEmail(googleEmail);
                if (existingUser) {
                  // Link Google ID to existing account
                  user = await storage.updateUserGoogleId(existingUser.id, profile.id);
                }
              }
              
              // If still no user, create new one
              if (!user) {
                // Generate a random username if needed
                const username = displayName.replace(/\s/g, "") + Math.floor(Math.random() * 1000);
                
                // Check if this is the admin email
                const isAdmin = googleEmail === ADMIN_EMAIL;
                
                user = await storage.createUser({
                  username,
                  email: googleEmail,
                  password: await hashPassword(randomBytes(16).toString("hex")), // Random password since login is via Google
                  googleId: profile.id,
                  isAdmin: isAdmin, // Grant admin privileges if email matches
                });
              }
            } else if (user.email === ADMIN_EMAIL && !user.isAdmin) {
              // If user exists with admin email but doesn't have admin rights, update them
              user = await storage.updateUserAdminStatus(user.id, true);
            }
            
            return done(null, user);
          } catch (error) {
            console.error("Google authentication error:", error);
            return done(error as Error);
          }
        }
      )
    );
  } else {
    console.warn("Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables to enable it.");
  }

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    const user = await storage.getUser(id);
    done(null, user);
  });

  // Registration endpoint for customers only
  app.post("/api/register", async (req, res, next) => {
    try {
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Hash the password before storing
      const hashedPassword = await hashPassword(req.body.password);
      
      // Create a new user
      const user = await storage.createUser({
        ...req.body,
        password: hashedPassword,
        isAdmin: false // Force regular users to not have admin privileges
      });

      // Log the user in
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
  
  // Google OAuth routes
  app.get(
    "/api/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  app.get(
    "/api/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/auth" }),
    (req, res) => {
      // Successful authentication, redirect home.
      res.redirect("/");
    }
  );
}
