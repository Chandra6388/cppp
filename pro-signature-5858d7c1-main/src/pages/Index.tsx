
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import ServicesSection from "../components/ServicesSection";
import TestimonialsSection from "../components/TestimonialsSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";

interface IndexProps {
  onAuthAction: (action: 'signin' | 'signup') => void;
}

const Index = ({ onAuthAction }: IndexProps) => {
  return (
    <div className="min-h-screen">
      <Header onAuthAction={onAuthAction} />
      <HeroSection onAuthAction={onAuthAction} />
      <AboutSection />
      <ServicesSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
