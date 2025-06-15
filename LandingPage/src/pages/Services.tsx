
import { CheckCircle, Zap, BarChart3, Palette, Users, Shield, Cpu, Globe, Clock, Target, Code, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import * as Config from "../Utils/config";
const Services = () => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => new Set([...prev, entry.target.id]));
        }
      });
    }, {
      threshold: 0.1
    });
    const sections = document.querySelectorAll('[data-section]');
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const isSectionVisible = (sectionId: string) => visibleSections.has(sectionId);

  return (
    <div className="min-h-screen pt-20 creative-gradient">
      {/* Hero Section */}
      <section className="py-32 section-dark">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-light mb-8 text-white">
              Advanced <span className="text-gradient-primary font-extrabold">Services</span>
            </h1>
            <p className="text-2xl text-gray-400 mb-12 font-light leading-relaxed max-w-4xl mx-auto">
              Comprehensive solutions designed to transform your email communication and drive unprecedented business growth through intelligent automation.
            </p>
          </div>
        </div>
      </section>

      {/* Core Services */}
      <section id="core-services" data-section className="py-32 section-dark">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-20 transition-all duration-1000 ${isSectionVisible('core-services') ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <h2 className="text-5xl font-light mb-8 text-white">
              Core <span className="text-gradient-secondary font-extrabold">Solutions</span>
            </h2>
            <p className="text-xl text-gray-400 font-light max-w-3xl mx-auto">
              Powerful services that form the foundation of your email signature strategy
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {[{
              icon: Palette,
              title: "AI-Powered Design Studio",
              desc: "Revolutionary design engine that creates stunning, brand-consistent signatures automatically. Our AI analyzes your brand identity and generates optimized designs that convert.",
              features: ["Smart color palette generation", "Brand logo optimization", "Typography intelligence", "Template customization", "Real-time preview"],
              gradient: "from-purple-500/20 to-pink-500/20"
            }, {
              icon: BarChart3,
              title: "Advanced Analytics Platform",
              desc: "Deep insights and predictive analytics that reveal hidden patterns in your email performance. Track, analyze, and optimize every aspect of your signature strategy.",
              features: ["Real-time performance tracking", "Behavioral analytics", "Conversion optimization", "A/B testing automation", "Predictive insights"],
              gradient: "from-cyan-500/20 to-blue-500/20"
            }, {
              icon: Users,
              title: "Enterprise Team Management",
              desc: "Centralized control and management for organizations of any size. Deploy, monitor, and optimize signatures across your entire team with military-grade security.",
              features: ["Role-based permissions", "Bulk deployment", "Team analytics", "Compliance monitoring", "SSO integration"],
              gradient: "from-emerald-500/20 to-teal-500/20"
            }, {
              icon: Cpu,
              title: "Intelligent Automation",
              desc: "Smart workflows that adapt to your business processes. Our AI learns from your patterns and automates signature updates, deployments, and optimizations.",
              features: ["Workflow automation", "Dynamic content updates", "Smart scheduling", "Auto-optimization", "Integration APIs"],
              gradient: "from-orange-500/20 to-red-500/20"
            }].map((service, index) => (
              <div 
                key={index} 
                className={`creative-card p-10 rounded-3xl transition-all duration-700 ${isSectionVisible('core-services') ? 'animate-scale-in' : 'opacity-0'}`} 
                style={{
                  animationDelay: `${index * 200}ms`
                }}
              >
                <div className={`w-20 h-20 mb-8 rounded-3xl bg-gradient-to-br ${service.gradient} flex items-center justify-center backdrop-blur-sm`}>
                  <service.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-light mb-6 text-white">{service.title}</h3>
                <p className="text-gray-400 mb-8 font-light leading-relaxed">{service.desc}</p>
                <ul className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-300 font-light">
                      <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Services */}
      <section id="premium-services" data-section className="py-32 section-dark">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-20 transition-all duration-1000 ${isSectionVisible('premium-services') ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <h2 className="text-5xl font-light mb-8 text-white">
              Premium <span className="text-gradient-accent font-extrabold">Offerings</span>
            </h2>
            <p className="text-xl text-gray-400 font-light max-w-3xl mx-auto">
              Exclusive services for enterprises that demand the highest level of performance and customization
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
            //   {
            //   icon: Shield,
            //   title: "Enterprise Security Suite",
            //   desc: "Military-grade security with zero-knowledge architecture, end-to-end encryption, and comprehensive compliance certifications.",
            //   highlights: ["SOC 2 Type II certified", "GDPR & CCPA compliant", "Zero-knowledge encryption"],
            //   gradient: "from-red-500/20 to-orange-500/20"
            // }, 
            // {
            //   icon: Globe,
            //   title: "Global CDN Network",
            //   desc: "Lightning-fast content delivery with 99.99% uptime guarantee. Your signatures load instantly anywhere in the world.",
            //   highlights: ["200+ edge locations", "99.99% uptime SLA", "Auto-scaling infrastructure"],
            //   gradient: "from-blue-500/20 to-cyan-500/20"
            // },
            //  {
            //   icon: Code,
            //   title: "Custom API Development",
            //   desc: "Bespoke integrations and custom features tailored to your unique business requirements and existing technology stack.",
            //   highlights: ["Custom endpoint creation", "Webhook integrations", "Real-time data sync"],
            //   gradient: "from-purple-500/20 to-indigo-500/20"
            // }, 
            {
              icon: Target,
              title: "Dedicated Success Manager",
              desc: "Personal account management with strategic consultation, optimization recommendations, and priority support.",
              highlights: ["24/7 priority support", "Strategic consultation", "Performance optimization"],
              gradient: "from-emerald-500/20 to-teal-500/20"
            }, {
              icon: Lightbulb,
              title: "AI Research Partnership",
              desc: "Collaborate with our research team to develop cutting-edge AI features and get early access to experimental technologies.",
              highlights: ["Beta feature access", "Research collaboration", "Custom AI models"],
              gradient: "from-yellow-500/20 to-orange-500/20"
            }, {
              icon: Clock,
              title: "White-Label Solutions",
              desc: "Complete rebrand our platform with your identity. Offer signature services under your own brand with full customization.",
              highlights: ["Complete rebranding", "Custom domain setup", "Revenue sharing model"],
              gradient: "from-pink-500/20 to-purple-500/20"
            }].map((service, index) => (
              <div 
                key={index} 
                className={`creative-card p-8 rounded-3xl transition-all duration-700 ${isSectionVisible('premium-services') ? 'animate-fade-in-up' : 'opacity-0'}`} 
                style={{
                  animationDelay: `${index * 150}ms`
                }}
              >
                <div className={`w-16 h-16 mb-6 rounded-3xl bg-gradient-to-br ${service.gradient} flex items-center justify-center backdrop-blur-sm`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-light mb-4 text-white">{service.title}</h3>
                <p className="text-gray-400 mb-6 font-light leading-relaxed">{service.desc}</p>
                <ul className="space-y-2">
                  {service.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-300 font-light">
                      <CheckCircle className="w-4 h-4 text-emerald-400 mr-2 flex-shrink-0" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" data-section className="py-32 section-dark">
        <div className="container mx-auto px-4 text-center">
          <div className={`max-w-4xl mx-auto transition-all duration-1000 ${isSectionVisible('cta') ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <h2 className="text-5xl font-light mb-8 text-white">
              Ready to <span className="text-gradient-secondary font-extrabold">Transform</span> Your Communication?
            </h2>
            <p className="text-xl text-gray-400 mb-12 font-light leading-relaxed">
              Let's discuss how our services can be tailored to your specific needs and business objectives.
            </p>
            <div className="flex justify-center">
              <Button 
                size="lg" 
                onClick={() => window.location.href = `${Config.FRONTEND_URL}login`}
                className="btn-dark-modern text-white font-light text-xl px-12 py-8 rounded-2xl"
              >
                <Zap className="w-6 h-6 mr-3" />
                Start Your Journey
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
