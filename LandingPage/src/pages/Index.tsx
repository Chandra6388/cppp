
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import ServicesSection from "../components/ServicesSection";
import TestimonialsSection from "../components/TestimonialsSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const handleAuthAction = (action: 'signin' | 'signup') => {
    if (action === 'signin') {
      navigate('/login');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen">
      <HeroSection onAuthAction={handleAuthAction} />
      <AboutSection />
      <ServicesSection />
      <TestimonialsSection />
      <ContactSection />
    </div>
  );
};

export default Index;
