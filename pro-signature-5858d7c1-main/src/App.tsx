
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Signatures from "./pages/Signatures";
import Tutorial from "./pages/Tutorial";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import InsightsSection from "./components/InsightsSection";
import TestimonialsSection from "./components/TestimonialsSection";
import ContactSection from "./components/ContactSection";
import NotFound from "./pages/NotFound";
import AuthDialog from "./components/AuthDialog";
import MouseFollower from "./components/MouseFollower";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
};

const AppContent = () => {
  const location = useLocation();
  const [authDialog, setAuthDialog] = useState<{ isOpen: boolean; mode: 'signin' | 'signup' }>({
    isOpen: false,
    mode: 'signin'
  });

  const handleAuthAction = (action: 'signin' | 'signup') => {
    setAuthDialog({ isOpen: true, mode: action });
  };

  const closeAuthDialog = () => {
    setAuthDialog(prev => ({ ...prev, isOpen: false }));
  };

  const switchAuthMode = (mode: 'signin' | 'signup') => {
    setAuthDialog({ isOpen: true, mode });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-x-hidden">
      <ScrollToTop />
      <MouseFollower />
      <Header onAuthAction={handleAuthAction} />
      <div 
        key={location.pathname}
        className="page-transition-3d"
        style={{ willChange: 'opacity, transform' }}
      >
        <Routes>
          <Route path="/" element={<Home onAuthAction={handleAuthAction} />} />
          <Route path="/index" element={<Index onAuthAction={handleAuthAction} />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/signatures" element={<Signatures onAuthAction={handleAuthAction} />} />
          <Route path="/tutorial" element={<Tutorial />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/insights" element={
            <div className="pt-20 animate-fade-in-3d">
              <InsightsSection />
            </div>
          } />
          <Route path="/contact" element={
            <div className="pt-20 animate-fade-in-3d">
              <ContactSection />
            </div>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
      
      <AuthDialog
        isOpen={authDialog.isOpen}
        onClose={closeAuthDialog}
        mode={authDialog.mode}
        onSwitchMode={switchAuthMode}
      />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
