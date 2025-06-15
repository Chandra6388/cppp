
import { useState, useEffect, useRef } from "react";
import { Star } from "lucide-react";

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const testimonials = [
    {
      quote: "ProSignature transformed our email game completely. The templates are stunning and the analytics are incredibly detailed.",
      name: "Sarah Mitchell",
      title: "Marketing Director",
      company: "TechCorp",
      avatar: "SM",
      rating: 5
    },
    {
      quote: "Best investment we made this year. Our email click-through rates increased by 300% in just two months.",
      name: "David Chen",
      title: "Sales Manager",
      company: "GrowthHub",
      avatar: "DC",
      rating: 5
    },
    {
      quote: "The team collaboration features are amazing. We can maintain brand consistency across all departments effortlessly.",
      name: "Emily Rodriguez",
      title: "Brand Manager",
      company: "DesignCo",
      avatar: "ER",
      rating: 5
    },
    {
      quote: "I never knew my signature could work like a smart business card. This tool is a game changer.",
      name: "Priya",
      title: "SaaS Founder",
      company: "StartupHub",
      avatar: "P",
      rating: 5
    },
    {
      quote: "As a developer, the analytics dashboard blew my mind. I use it in every outreach.",
      name: "Ramesh",
      title: "Full Stack Developer",
      company: "DevCorp",
      avatar: "R",
      rating: 5
    },
    {
      quote: "The AI insights helped me optimize my signature and increase my meeting bookings by 40%.",
      name: "Michael",
      title: "Sales Executive",
      company: "SalesForce",
      avatar: "M",
      rating: 5
    },
    {
      quote: "Incredible ROI and the customer support team is phenomenal. Highly recommended!",
      name: "Lisa Thompson",
      title: "VP Marketing",
      company: "MarketingPro",
      avatar: "LT",
      rating: 5
    },
    {
      quote: "The customization options are endless and the templates look absolutely professional.",
      name: "James Wilson",
      title: "Creative Director",
      company: "DesignStudio",
      avatar: "JW",
      rating: 5
    }
  ];

  // Auto-scroll functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  // Smooth scroll to center the current testimonial
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = 320; // Width of each card + gap
      const containerWidth = container.offsetWidth;
      const targetScrollLeft = (currentIndex * cardWidth) - (containerWidth / 2) + (cardWidth / 2);
      
      container.scrollTo({
        left: Math.max(0, targetScrollLeft),
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-8 py-4 rounded-full glass-card mb-12 text-base font-light text-pink-300 backdrop-blur-2xl border border-pink-500/20">
            <span className="text-pink-400 mr-3">❤️</span>
            Customer Love
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Loved by <span className="text-gradient">Thousands</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join thousands of professionals who've transformed their email signatures
          </p>
        </div>

        {/* Auto-scrolling horizontal carousel */}
        <div className="relative overflow-hidden">
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
            style={{ 
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {testimonials.map((testimonial, index) => {
              const isCenter = index === currentIndex;
              return (
                <div 
                  key={index}
                  className={`flex-shrink-0 transition-all duration-700 ${
                    isCenter 
                      ? 'w-80 scale-110 z-10' 
                      : 'w-72 scale-95 opacity-70'
                  }`}
                >
                  <div className={`glass-card p-6 rounded-2xl h-full transition-all duration-700 ${
                    isCenter 
                      ? 'ring-2 ring-cyan-400 bg-gradient-to-br from-cyan-500/10 to-purple-500/10' 
                      : 'hover:scale-105'
                  }`}>
                    {/* Rating */}
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    
                    {/* Quote */}
                    <blockquote className={`text-gray-300 font-light italic leading-relaxed mb-6 ${
                      isCenter ? 'text-base' : 'text-sm'
                    }`}>
                      "{testimonial.quote}"
                    </blockquote>
                    
                    {/* Author */}
                    <div className="flex items-center">
                      <div className={`bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-light mr-4 ${
                        isCenter ? 'w-12 h-12 text-lg' : 'w-10 h-10 text-sm'
                      }`}>
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className={`font-light text-white ${isCenter ? 'text-base' : 'text-sm'}`}>
                          {testimonial.name}
                        </div>
                        <div className={`text-cyan-400 ${isCenter ? 'text-sm' : 'text-xs'}`}>
                          {testimonial.title}
                        </div>
                        <div className={`text-gray-500 ${isCenter ? 'text-sm' : 'text-xs'}`}>
                          {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Indicators */}
        <div className="flex justify-center space-x-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-cyan-400 w-8' 
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>
      </div>

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default TestimonialsSection;
