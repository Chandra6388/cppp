
import { Button } from "@/components/ui/button";
import { Zap, Users, BarChart3, Shield, Globe, Eye, CheckCircle, Star, ArrowRight, Clock, Target, Layers, HeadphonesIcon, TrendingUp, Brain, Lightbulb, Cpu, Database, Workflow, Infinity, Palette, Sparkles, Rocket, Play, ChevronRight, Award, Briefcase, Code, Smartphone, Monitor, Mail, Download, Share2, Building, Heart } from "lucide-react";
import HeroSection from "../components/HeroSection";
import { useEffect, useState } from "react";

interface HomeProps {
  onAuthAction: (action: 'signin' | 'signup') => void;
}

const Home = ({ onAuthAction }: HomeProps) => {
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
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <HeroSection onAuthAction={onAuthAction} />

      {/* Stats Section */}
      <section id="stats" data-section className="py-20 section-dark relative">
        <div className="container mx-auto px-4">
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-1000 ${isSectionVisible('stats') ? 'animate-fade-in-3d' : 'opacity-0'}`}>
            {[
              { number: "50K+", label: "Active Users", icon: Users },
              { number: "1M+", label: "Signatures Created", icon: Mail },
              { number: "99.9%", label: "Uptime", icon: TrendingUp },
              { number: "24/7", label: "Support", icon: HeadphonesIcon }
            ].map((stat, index) => (
              <div key={index} className={`text-center creative-card p-6 rounded-2xl hover-3d transition-all duration-700 ${isSectionVisible('stats') ? 'animate-scale-in-3d' : 'opacity-0'}`} style={{ animationDelay: `${index * 150}ms` }}>
                <stat.icon className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
                <div className="text-3xl font-light text-white mb-2">{stat.number}</div>
                <div className="text-gray-400 font-light">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Quick Start Section */}
      <section id="quickstart" data-section className="py-32 section-dark relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className={`text-center mb-20 transition-all duration-1000 ${isSectionVisible('quickstart') ? 'animate-fade-in-3d' : 'opacity-0'}`}>
            <h2 className="text-5xl md:text-6xl font-light mb-8 text-white">
              Get Started in <span className="text-gradient-primary font-extrabold">3 Simple Steps</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
              Creating professional email signatures has never been easier
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 mb-16">
            {[{
              step: "01",
              title: "Choose Template",
              desc: "Browse our collection of professionally designed templates",
              icon: Palette,
              action: "Browse Templates",
              actionType: "signin" as const
            }, {
              step: "02",
              title: "Customize Design",
              desc: "Add your information, logo, and personalize colors",
              icon: Layers,
              action: "Start Building Now",
              actionType: "signup" as const
            }, {
              step: "03",
              title: "Deploy & Track",
              desc: "Install your signature and monitor performance analytics",
              icon: BarChart3,
              action: "Start Your Journey",
              actionType: "signup" as const
            }].map((step, index) => (
              <div key={index} className={`creative-card p-10 rounded-3xl text-center transition-all duration-700 hover-3d group ${isSectionVisible('quickstart') ? 'animate-scale-in-3d' : 'opacity-0'}`} style={{ animationDelay: `${index * 250}ms` }}>
                <div className="text-6xl font-light text-cyan-400/30 mb-6 group-hover:text-cyan-400/50 transition-colors duration-500">
                  {step.step}
                </div>
                <div className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <step.icon className="w-10 h-10 text-white group-hover:rotate-12 transition-transform duration-500" />
                </div>
                <h3 className="text-2xl font-light mb-6 text-white group-hover:text-cyan-300 transition-colors duration-500">{step.title}</h3>
                <p className="text-gray-400 mb-8 font-light leading-relaxed group-hover:text-gray-300 transition-colors duration-500">{step.desc}</p>
                <Button onClick={() => onAuthAction(step.actionType)} className="w-full btn-dark-modern text-white font-light py-3 rounded-2xl group-hover:scale-105 transition-all duration-300">
                  {step.action}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase Section */}
      <section id="showcase" data-section className="py-32 section-dark relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-full blur-3xl animate-float"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className={`text-center mb-20 transition-all duration-1000 ${isSectionVisible('showcase') ? 'animate-fade-in-3d' : 'opacity-0'}`}>
            <h2 className="text-5xl md:text-6xl font-light mb-8 text-white">
              Professional <span className="text-gradient-secondary font-extrabold">Signatures</span> Made Simple
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
              Discover our powerful features designed to elevate your email communication
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {[
              {
                icon: Code,
                title: "HTML Export",
                desc: "Export clean, responsive HTML code ready for any email client",
                color: "from-blue-500/20 to-indigo-500/20"
              },
              {
                icon: Smartphone,
                title: "Mobile Optimized",
                desc: "Perfect display across all devices and email platforms",
                color: "from-emerald-500/20 to-teal-500/20"
              },
              {
                icon: Monitor,
                title: "Live Preview",
                desc: "See your changes in real-time with our interactive editor",
                color: "from-purple-500/20 to-pink-500/20"
              },
              {
                icon: Download,
                title: "Multiple Formats",
                desc: "Download in various formats: HTML, PNG, or direct copy",
                color: "from-orange-500/20 to-red-500/20"
              },
              {
                icon: Share2,
                title: "Team Sharing",
                desc: "Share templates and collaborate with your team members",
                color: "from-cyan-500/20 to-blue-500/20"
              },
              {
                icon: Building,
                title: "Brand Consistency",
                desc: "Maintain consistent branding across your organization",
                color: "from-violet-500/20 to-purple-500/20"
              }
            ].map((feature, index) => (
              <div key={index} className={`creative-card p-8 rounded-3xl text-center transition-all duration-700 hover-3d group ${isSectionVisible('showcase') ? 'animate-fade-in-3d' : 'opacity-0'}`} style={{ animationDelay: `${index * 100}ms` }}>
                <div className={`w-16 h-16 mx-auto mb-6 rounded-3xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                  <feature.icon className="w-8 h-8 text-white group-hover:rotate-12 transition-transform duration-500" />
                </div>
                <h3 className="text-xl font-light mb-4 text-white group-hover:text-cyan-300 transition-colors duration-500">{feature.title}</h3>
                <p className="text-gray-400 font-light leading-relaxed group-hover:text-gray-300 transition-colors duration-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" data-section className="py-32 section-dark relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className={`text-center mb-20 transition-all duration-1000 ${isSectionVisible('features') ? 'animate-fade-in-3d' : 'opacity-0'}`}>
            <div className="inline-flex items-center px-8 py-4 rounded-full creative-card mb-12 text-base font-light text-cyan-300 backdrop-blur-2xl border border-cyan-500/20">
              <Zap className="w-5 h-5 mr-3 animate-pulse" />
              Revolutionary Features
            </div>
            <h2 className="text-5xl md:text-6xl font-light mb-8 text-white animate-section-heading">
              Why <span className="text-gradient-primary font-extrabold">Professionals</span> Choose Us
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
              Experience the future of email communication with our cutting-edge signature technology
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
            {[{
              icon: Clock,
              title: "Instant Setup",
              desc: "Revolutionary one-click deployment with zero configuration required. Our AI handles everything automatically.",
              metric: "< 30sec",
              detail: "Average deployment time",
              gradient: "from-cyan-500/20 to-blue-500/20"
            }, {
              icon: Brain,
              title: "AI-Powered Analytics",
              desc: "Advanced machine learning algorithms provide predictive insights and behavioral analysis.",
              metric: "25.8%",
              detail: "Average engagement boost",
              gradient: "from-emerald-500/20 to-teal-500/20"
            }, {
              icon: Target,
              title: "Neural Targeting",
              desc: "Deep learning personalization that adapts in real-time to maximize conversion rates.",
              metric: "4.7x",
              detail: "Higher conversion rates",
              gradient: "from-purple-500/20 to-pink-500/20"
            }].map((feature, index) => (
              <div key={index} className={`creative-card p-10 rounded-3xl text-center transition-all duration-700 hover-3d group ${isSectionVisible('features') ? 'animate-scale-in-3d' : 'opacity-0'}`} style={{ animationDelay: `${index * 250}ms` }}>
                <div className={`w-20 h-20 mx-auto mb-8 rounded-3xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-500`}>
                  <feature.icon className="w-10 h-10 text-white group-hover:rotate-12 transition-transform duration-500" />
                </div>
                <h3 className="text-2xl font-light mb-6 text-white group-hover:text-cyan-300 transition-colors duration-500">{feature.title}</h3>
                <p className="text-gray-400 mb-8 font-light leading-relaxed group-hover:text-gray-300 transition-colors duration-500">{feature.desc}</p>
                <div className="creative-card rounded-2xl p-6 group-hover:bg-gradient-to-br group-hover:from-cyan-500/10 group-hover:to-purple-500/10 transition-all duration-500">
                  <div className="text-4xl font-light text-gradient-primary mb-2 group-hover:scale-110 transition-transform duration-500">{feature.metric}</div>
                  <div className="text-sm text-gray-500 font-light">{feature.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Use Cases Section */}
      <section id="use-cases" data-section className="py-32 section-dark relative">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-20 transition-all duration-1000 ${isSectionVisible('use-cases') ? 'animate-fade-in-3d' : 'opacity-0'}`}>
            <h2 className="text-5xl md:text-6xl font-light mb-8 text-white animate-section-heading">
              Perfect for <span className="text-gradient-accent font-extrabold">Every Professional</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {[{
              icon: Briefcase,
              title: "Sales Teams",
              desc: "Convert more leads with smart call-to-action buttons",
              users: "12K+ Sales Pros"
            }, {
              icon: Award,
              title: "Marketing Agencies",
              desc: "Showcase client work and drive campaign engagement",
              users: "5K+ Agencies"
            }, {
              icon: Users,
              title: "Consultants",
              desc: "Build credibility with professional branding",
              users: "8K+ Consultants"
            }, {
              icon: Globe,
              title: "Enterprises",
              desc: "Maintain brand consistency across all communications",
              users: "500+ Companies"
            }].map((useCase, index) => (
              <div key={index} className={`creative-card p-8 rounded-3xl text-center transition-all duration-700 hover-3d group ${isSectionVisible('use-cases') ? 'animate-fade-in-3d' : 'opacity-0'}`} style={{ animationDelay: `${index * 150}ms` }}>
                <div className="w-16 h-16 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <useCase.icon className="w-8 h-8 text-cyan-300 group-hover:rotate-12 transition-transform duration-500" />
                </div>
                <h3 className="text-xl font-light mb-4 text-white group-hover:text-cyan-300 transition-colors duration-500">{useCase.title}</h3>
                <p className="text-gray-400 font-light leading-relaxed mb-4 group-hover:text-gray-300 transition-colors duration-500">{useCase.desc}</p>
                <div className="text-sm text-cyan-400 font-light">{useCase.users}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Love Section */}
      <section id="customer-love" data-section className="py-32 section-dark relative">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-20 transition-all duration-1000 ${isSectionVisible('customer-love') ? 'animate-fade-in-3d' : 'opacity-0'}`}>
            <div className="inline-flex items-center px-8 py-4 rounded-full creative-card mb-12 text-base font-light text-pink-300 backdrop-blur-2xl border border-pink-500/20">
              <Heart className="w-5 h-5 mr-3 animate-pulse" />
              Customer Love
            </div>
            <h2 className="text-5xl md:text-6xl font-light mb-8 text-white">
              Loved by <span className="text-gradient-secondary font-extrabold">Thousands</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              {
                rating: 5,
                text: "ProSignature transformed our email game completely. The templates are stunning and the analytics are incredibly detailed.",
                author: "Sarah Mitchell",
                role: "Marketing Director",
                company: "TechCorp"
              },
              {
                rating: 5,
                text: "Best investment we made this year. Our email click-through rates increased by 300% in just two months.",
                author: "David Chen",
                role: "Sales Manager",
                company: "GrowthHub"
              },
              {
                rating: 5,
                text: "The team collaboration features are amazing. We can maintain brand consistency across all departments effortlessly.",
                author: "Emily Rodriguez",
                role: "Brand Manager",
                company: "DesignCo"
              }
            ].map((review, index) => (
              <div key={index} className={`creative-card p-8 rounded-3xl transition-all duration-700 hover-3d group ${isSectionVisible('customer-love') ? 'animate-scale-in-3d' : 'opacity-0'}`} style={{ animationDelay: `${index * 200}ms` }}>
                <div className="flex mb-6">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 font-light italic leading-relaxed mb-6 group-hover:text-white transition-colors duration-500">
                  "{review.text}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-light text-lg mr-4">
                    {review.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-light text-white">{review.author}</div>
                    <div className="text-sm text-gray-400">{review.role} at {review.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Success Stories */}
      <section id="testimonials" data-section className="py-32 section-dark relative">
        <div className="container mx-auto px-4 relative">
          <div className={`text-center mb-20 transition-all duration-1000 ${isSectionVisible('testimonials') ? 'animate-fade-in-3d' : 'opacity-0'}`}>
            <h2 className="text-5xl md:text-6xl font-light mb-8 text-white animate-section-heading">
              Success <span className="text-gradient-primary font-extrabold">Stories</span>
            </h2>
            <p className="text-xl text-gray-400 font-light">Transformative results from forward-thinking professionals</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
            {[{
              name: "Sarah Johnson",
              title: "Chief Innovation Officer",
              result: "+320% Lead Generation",
              quote: "ProSignature's AI revolutionized our entire email strategy. The predictive analytics are absolutely game-changing.",
              avatar: "SJ",
              company: "TechVision Corp",
              rating: 5,
              gradient: "from-cyan-500 to-blue-500"
            }, {
              name: "Alex Chen",
              title: "Digital Marketing Director",
              result: "+275% Click-through Rate",
              quote: "The neural targeting capabilities exceeded all our expectations. Our engagement metrics have never been higher.",
              avatar: "AC",
              company: "InnovateHub",
              rating: 5,
              gradient: "from-emerald-500 to-teal-500"
            }, {
              name: "Mike Rodriguez",
              title: "Growth Strategy Lead",
              result: "+450% Conversion Rate",
              quote: "The AI-powered optimization delivered results we never thought possible. It's like having a data scientist in every email.",
              avatar: "MR",
              company: "NextGen Solutions",
              rating: 5,
              gradient: "from-purple-500 to-pink-500"
            }].map((story, index) => (
              <div key={index} className={`creative-card p-10 rounded-3xl transition-all duration-700 hover-3d group ${isSectionVisible('testimonials') ? 'animate-scale-in-3d' : 'opacity-0'}`} style={{ animationDelay: `${index * 200}ms` }}>
                <div className="flex items-center mb-8">
                  <div className={`w-16 h-16 bg-gradient-to-r ${story.gradient} rounded-full flex items-center justify-center text-white font-light text-xl mr-5 group-hover:scale-110 transition-transform duration-500`}>
                    {story.avatar}
                  </div>
                  <div>
                    <h4 className="font-light text-white text-lg group-hover:text-cyan-300 transition-colors duration-500">{story.name}</h4>
                    <p className="text-gray-400 font-light text-sm">{story.title}</p>
                    <p className="text-cyan-300 font-light text-sm">{story.company}</p>
                  </div>
                </div>
                <div className="text-3xl font-light text-gradient-secondary mb-6 group-hover:scale-105 transition-transform duration-500">{story.result}</div>
                <p className="text-gray-400 font-light italic leading-relaxed mb-6 group-hover:text-gray-300 transition-colors duration-500">"{story.quote}"</p>
                <div className="flex">
                  {[...Array(story.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current group-hover:scale-110 transition-transform duration-300" style={{ transitionDelay: `${i * 50}ms` }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section id="cta" data-section className="py-32 section-dark relative">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className={`transition-all duration-1000 ${isSectionVisible('cta') ? 'animate-fade-in-3d' : 'opacity-0'}`}>
            <h2 className="text-5xl md:text-6xl font-light mb-8 text-white animate-section-heading">
              Ready to <span className="text-gradient-primary font-extrabold">Transform</span> Your Email?
            </h2>
            <p className="text-xl text-gray-400 mb-16 max-w-4xl mx-auto font-light leading-relaxed">
              Join thousands of professionals who are already transforming their business communication. 
              Start creating professional email signatures today - completely free.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-16">
              <Button size="lg" onClick={() => onAuthAction('signin')} className="w-full sm:w-auto btn-dark-modern text-white font-light text-xl px-16 py-8 rounded-2xl hover-3d group">
                <Rocket className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-500" />
                Create Your Signature
              </Button>
              <Button size="lg" variant="outline" onClick={() => onAuthAction('signin')} className="w-full sm:w-auto btn-accent-dark font-light text-xl px-16 py-8 rounded-2xl hover-3d group">
                <Play className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-500" />
                Watch Demo
              </Button>
            </div>
            
            <div className="flex flex-wrap justify-center items-end gap-10 text-gray-400 font-light px-[16px]">
              {[{
                icon: CheckCircle,
                text: "Completely free"
              }, {
                icon: CheckCircle,
                text: "Professional templates"
              }, {
                icon: CheckCircle,
                text: "Real-time analytics"
              }, {
                icon: CheckCircle,
                text: "Expert support"
              }].map((item, index) => (
                <div key={index} className="flex items-center hover:text-cyan-300 transition-colors duration-500 group">
                  <item.icon className="w-5 h-5 text-emerald-400 mr-3 group-hover:scale-110 transition-transform duration-300" />
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
