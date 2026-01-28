import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SubscriptionPage from "./pages/SubscriptionPage";
import WalletPage from "./pages/WalletPage";
import AccountPage from "./pages/AccountPage";
import PausePage from "./pages/PausePage";
import TrackingPage from "./pages/TrackingPage";
import CustomizePage from "./pages/CustomizePage";
import AddressPage from "./pages/AddressPage";
import NotificationsPage from "./pages/NotificationsPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/pause" element={<PausePage />} />
          <Route path="/tracking" element={<TrackingPage />} />
          <Route path="/customize" element={<CustomizePage />} />
          <Route path="/address" element={<AddressPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
