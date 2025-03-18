
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Success from "./pages/Success";
import BookingLink from "./pages/BookingLink";
import TeamConfirmation from "./pages/TeamConfirmation";
import OnboardingComplete from "./pages/OnboardingComplete";
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
          <Route path="/success" element={<Success />} />
          <Route path="/booking-link" element={<BookingLink />} />
          <Route path="/join-team" element={<TeamConfirmation />} />
          <Route path="/onboarding-complete" element={<OnboardingComplete />} />
          <Route path="/dashboard" element={<NotFound />} /> {/* Placeholder for dashboard */}
          
          {/* Team-specific routes */}
          <Route path="/:teamSlug" element={<Index />} />
          <Route path="/:teamSlug/success" element={<Success />} />
          <Route path="/:teamSlug/booking-link" element={<BookingLink />} />
          <Route path="/:teamSlug/join-team" element={<TeamConfirmation />} />
          <Route path="/:teamSlug/onboarding-complete" element={<OnboardingComplete />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
