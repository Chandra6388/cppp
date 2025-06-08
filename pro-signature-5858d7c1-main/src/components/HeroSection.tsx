import { Button } from "@/components/ui/button";
import { ArrowDown, Zap, Eye, Sparkles, Rocket } from "lucide-react";
import { useEffect, useState } from "react";

interface HeroSectionProps {
  onAuthAction: (action: 'signin' | 'signup') => void;
}

const HeroSection = ({ onAuthAction }: HeroSectionProps) => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const animatedWords = ["Creative", "Impactful", "Personalized"];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    setIsVisible(true);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex(prev => (prev + 1) % animatedWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden dark-hero-bg">
      {/* ... keep existing code (background elements and floating particles) the same ... */}
      <div className="absolute inset-0">
        <div className="absolute top-32 left-16 w-96 h-96 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-32 right-16 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-float" style={{
          animationDelay: '3s'
        }}></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl animate-float" style={{
          animationDelay: '6s'
        }}></div>
        <div className="absolute top-20 right-1/3 w-48 h-48 bg-gradient-to-br from-orange-500/8 to-red-500/8 rounded-full blur-3xl animate-float" style={{
          animationDelay: '4s'
        }}></div>
        <div className="absolute bottom-20 left-1/3 w-52 h-52 bg-gradient-to-br from-indigo-500/8 to-purple-500/8 rounded-full blur-3xl animate-float" style={{
          animationDelay: '7s'
        }}></div>
      </div>

      <div className="absolute inset-0 overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <div 
            key={i} 
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-pulse" 
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }} 
          />
        ))}
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i} 
            className="absolute creative-card p-4 rounded-2xl opacity-10 animate-float" 
            style={{
              left: `${5 + Math.random() * 90}%`,
              top: `${5 + Math.random() * 90}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 5}s`
            }}
          >
            <div className="w-6 h-6 bg-gradient-to-br from-cyan-400/40 to-purple-400/40 rounded-lg"></div>
          </div>
        ))}
      </div>

      {/* Main Hero Content */}
      <div className="container mx-auto px-4 relative z-20">
        <div className={`max-w-7xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          {/* Enhanced Badge */}
          <div className="inline-flex items-center px-8 rounded-full dark-glass-card mb-12 text-base font-light text-cyan-300 backdrop-blur-xl mx-0 py-[8px] my-[105px]">
            <Sparkles className="w-5 h-5 mr-3 animate-pulse" />
            Next-Generation Email Signatures
          </div>

          {/* Improved Main Heading with better spacing */}
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light leading-tight text-white text-center">
              Transform Your Email Into a
            </h1>
            <div className="animated-word-container mt-8 mb-8">
              {animatedWords.map((word, index) => (
                <h1 
                  key={index} 
                  className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight text-center animated-word text-gradient-primary ${index === currentWordIndex ? 'active' : ''}`}
                >
                  {word}
                </h1>
              ))}
            </div>
          </div>
          
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-300 mb-16 leading-relaxed font-light max-w-5xl mx-auto">
            Create stunning email signatures with real-time analytics and smart targeting that{' '}
            <span className="text-gradient-accent font-normal">converts visitors into customers</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-20">
            <Button 
              size="lg" 
              onClick={() => onAuthAction('signin')}
              className="w-full sm:w-auto btn-dark-modern text-white font-light text-xl px-16 py-8 rounded-3xl group hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              <Rocket className="w-6 h-6 mr-4 group-hover:rotate-12 transition-transform duration-300" />
              Create Your Signature
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => onAuthAction('signin')}
              className="w-full sm:w-auto btn-accent-dark font-light text-xl px-16 py-8 rounded-3xl group hover:scale-105 transition-all duration-300"
            >
              <Eye className="w-6 h-6 mr-4 group-hover:scale-110 transition-transform duration-300" />
              Browse Templates
            </Button>
          </div>

          {/* ... keep existing code (trust indicators) the same ... */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: ({ className }: { className?: string }) => (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                ),
                number: "50K+",
                label: "Active Users",
                color: "cyan",
                bg: "from-cyan-500/15 to-blue-500/15",
                delay: "0ms"
              },
              {
                icon: ({ className }: { className?: string }) => (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 2h20" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                ),
                number: "127",
                label: "Countries",
                color: "emerald",
                bg: "from-emerald-500/15 to-teal-500/15",
                delay: "200ms"
              },
              {
                icon: ({ className }: { className?: string }) => (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                    <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                    <line x1="6" y1="6" x2="6.01" y2="6" />
                    <line x1="6" y1="18" x2="6.01" y2="18" />
                  </svg>
                ),
                number: "2.5M",
                label: "Signatures Created",
                color: "purple",
                bg: "from-purple-500/15 to-pink-500/15",
                delay: "400ms"
              },
              {
                icon: ({ className }: { className?: string }) => (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                ),
                number: "99.9%",
                label: "Uptime",
                color: "orange",
                bg: "from-orange-500/15 to-red-500/15",
                delay: "600ms"
              }
            ].map((stat, index) => (
              <div 
                key={index} 
                className={`creative-card p-8 rounded-3xl text-center transition-all duration-700 group hover:scale-110 hover:rotate-1 ${isVisible ? 'animate-scale-in' : 'opacity-0'}`} 
                style={{
                  animationDelay: stat.delay
                }}
              >
                <div className={`w-16 h-16 mx-auto mb-6 rounded-3xl bg-gradient-to-br ${stat.bg} flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <stat.icon className={`w-8 h-8 text-${stat.color}-300 group-hover:rotate-12 transition-transform duration-300`} />
                </div>
                <div className="text-3xl font-light text-white mb-2 group-hover:text-cyan-300 transition-colors duration-300">{stat.number}</div>
                <div className="text-gray-400 text-sm font-light group-hover:text-gray-300 transition-colors duration-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-cyan-300/60 rounded-full flex justify-center backdrop-blur-sm">
            <div className="w-1.5 h-4 bg-gradient-to-b from-cyan-300 to-transparent rounded-full mt-3 animate-pulse"></div>
          </div>
          <ArrowDown className="w-5 h-5 text-cyan-300 opacity-80 mx-auto mt-3 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
