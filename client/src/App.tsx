import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import BookingPage from "@/pages/booking-page";
import AdminPage from "@/pages/admin-page";
import AuthPage from "@/pages/auth-page";
import NailArtPage from "@/pages/nail-art-page";
import PortfolioPage from "@/pages/portfolio-page";
import ShopPage from "@/pages/shop-page";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/booking" component={BookingPage} />
      <Route path="/nail-art" component={NailArtPage} />
      <Route path="/portfolio" component={PortfolioPage} />
      <Route path="/shop" component={ShopPage} />
      <ProtectedRoute path="/admin" component={AdminPage} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
