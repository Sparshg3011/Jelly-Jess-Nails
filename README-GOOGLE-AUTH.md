# Setting Up Google Authentication for WaitlistWizard

This document describes how to set up Google OAuth authentication for the WaitlistWizard application.

## Prerequisites

- A Google Cloud Platform account
- A Google Cloud project
- Access to the Google Cloud Console

## Step 1: Create OAuth Credentials in Google Cloud Console

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Navigate to "APIs & Services" > "Credentials"
4. Click on "Create Credentials" and select "OAuth client ID"
5. Configure the OAuth consent screen:
   - Select "External" user type (or "Internal" if this is just for your organization)
   - Fill in the required app information
   - Add the scopes for "profile" and "email"
   - Add your email as a test user
6. Create OAuth client ID:
   - Application type: Web application
   - Name: WaitlistWizard
   - Authorized JavaScript origins: Add your application URL (e.g., `http://localhost:3000`)
   - Authorized redirect URIs: Add your callback URL (e.g., `http://localhost:3000/api/auth/google/callback`)
7. Click "Create" and note down the Client ID and Client Secret

## Step 2: Configure Environment Variables

Add the following environment variables to your `.env` file:

```
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

For production, update the callback URL to your production domain.

## Step 3: Database Schema

Ensure your database schema includes a `googleId` field for users. The application is already set up to handle this.

## Step 4: Testing the Integration

1. Start your application
2. Navigate to the login page
3. Click on "Continue with Google"
4. You should be redirected to Google's login page
5. After login, you should be redirected back to your application and logged in

## Troubleshooting

- **Redirect URI mismatch**: Ensure the redirect URI in your Google Cloud Console matches exactly with the one your application is using.
- **Error 400: redirect_uri_mismatch**: Double-check the callback URL in both your code and Google Cloud Console.
- **Invalid Client ID**: Make sure the Client ID is correctly copied to your environment variables.

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Passport.js Google OAuth 2.0 Strategy](http://www.passportjs.org/packages/passport-google-oauth20/) 