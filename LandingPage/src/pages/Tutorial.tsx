import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, CheckCircle, ArrowRight, BookOpen, Rocket, Clock, Star, Users, Sparkles } from "lucide-react";
const Tutorial = () => {
  const [isVideoCompleted, setIsVideoCompleted] = useState(false);
  const quickSteps = [{
    step: "01",
    title: "Create Account",
    description: "Sign up and access your dashboard"
  }, {
    step: "02",
    title: "Choose Template",
    description: "Pick from our professional designs"
  }, {
    step: "03",
    title: "Customize",
    description: "Add your details and branding"
  }, {
    step: "04",
    title: "Deploy",
    description: "Install and start tracking results"
  }];
  return <div className="min-h-screen pt-20 dark-hero-bg">
      {/* Hero Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-8 py-4 rounded-full creative-card mb-8 text-base font-light text-cyan-300 backdrop-blur-2xl border border-cyan-500/20">
              <BookOpen className="w-5 h-5 mr-3 animate-pulse" />
              Learn & Master
            </div>
            <h1 className="text-5xl md:text-6xl font-light mb-8 text-white">
              Complete <span className="text-gradient-primary font-extrabold">Tutorial</span> Guide
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
              Everything you need to know to create stunning email signatures in just minutes
            </p>
          </div>
        </div>
      </section>

      {/* Main Tutorial Video */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Video Section */}
            <div className="creative-card p-8 rounded-3xl mb-16">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-light text-white mb-4">Master Tutorial Video</h2>
                <p className="text-gray-400 font-light">
                  Complete step-by-step guide to creating your first professional email signature
                </p>
              </div>
              
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-2xl flex items-center justify-center border border-cyan-500/20 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="relative z-10 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer group">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                    <div className="text-white font-light text-lg mb-2">Complete Tutorial</div>
                    <div className="text-cyan-300 text-sm">Duration: 12:45</div>
                  </div>
                </div>
                
                {/* Video Controls */}
                <div className="flex justify-center mt-6 gap-4">
                  <Button onClick={() => setIsVideoCompleted(!isVideoCompleted)} className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 group">
                    <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                    {isVideoCompleted ? 'Watch Again' : 'Watch Tutorial'}
                  </Button>
                  {isVideoCompleted && <Button variant="outline" className="btn-accent-dark">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Completed
                    </Button>}
                </div>
              </div>
            </div>

            {/* Quick Steps Overview */}
            <div className="creative-card p-8 rounded-3xl mb-16">
              <h3 className="text-2xl font-light text-white mb-8 text-center">Quick Steps Overview</h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickSteps.map((step, index) => <div key={index} className="text-center group">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-cyan-300 font-light text-lg">{step.step}</span>
                    </div>
                    <h4 className="text-white font-light text-lg mb-2 group-hover:text-cyan-300 transition-colors duration-300">
                      {step.title}
                    </h4>
                    <p className="text-gray-400 font-light text-sm">
                      {step.description}
                    </p>
                  </div>)}
              </div>
            </div>

            {/* Progress Section */}
            {isVideoCompleted && <div className="creative-card p-8 rounded-3xl text-center mb-16">
                <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
                <h3 className="text-2xl font-light text-white mb-4">Tutorial Completed!</h3>
                <p className="text-emerald-400 font-light mb-6">
                  🎉 Great job! You're now ready to create amazing email signatures.
                </p>
                <Button className="btn-dark-modern group">
                  <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                  Start Creating Your Signature
                </Button>
              </div>}
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      {/* <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="creative-card p-12 rounded-3xl text-center">
              <Sparkles className="w-16 h-16 text-cyan-300 mx-auto mb-6 animate-pulse" />
              <h3 className="text-3xl font-light text-white mb-6">More Tutorials Coming Soon</h3>
              <p className="text-gray-400 font-light leading-relaxed mb-8 max-w-2xl mx-auto">
                We're creating additional in-depth tutorials covering advanced features, 
                customization techniques, and pro tips to maximize your email signature impact.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {[{
                icon: Star,
                title: "Advanced Customization",
                desc: "Deep dive into design options"
              }, {
                icon: Rocket,
                title: "Analytics Mastery",
                desc: "Track and optimize performance"
              }, {
                icon: Users,
                title: "Team Management",
                desc: "Collaborate effectively"
              }].map((item, index) => <div key={index} className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-purple-500/5 border border-cyan-500/20">
                    <item.icon className="w-8 h-8 text-cyan-300 mx-auto mb-4" />
                    <h4 className="text-white font-light mb-2">{item.title}</h4>
                    <p className="text-gray-400 font-light text-sm">{item.desc}</p>
                    <div className="flex items-center justify-center mt-3 text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      Coming Soon
                    </div>
                  </div>)}
              </div>
              
              <Button className="btn-dark-modern group bg-zinc-50 text-zinc-50">
                <Users className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Get Notified When Available
              </Button>
            </div>
          </div>
        </div>
      </section> */}
    </div>;
};
export default Tutorial;