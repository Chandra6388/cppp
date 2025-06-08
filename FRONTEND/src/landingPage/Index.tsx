
import Header from "@/components/ui/Header";
import HeroSection from "@/components/ui/HeroSection";
import AboutSection from "@/components/ui/AboutSection";
import ServicesSection from "@/components/ui/ServicesSection";
import TestimonialsSection from "@/components/ui/TestimonialsSection";
import ContactSection from "@/components/ui/ContactSection";
import Footer from "@/components/ui/Footer";

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
