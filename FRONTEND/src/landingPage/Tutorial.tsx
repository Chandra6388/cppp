import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Play, 
  FileText, 
  Palette, 
  Settings, 
  Download, 
  CheckCircle, 
  ArrowRight, 
  Video,
  BookOpen,
  Lightbulb,
  Rocket,
  Target,
  Users
} from "lucide-react";

const Tutorial = () => {
  const [activeTab, setActiveTab] = useState("getting-started");
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const markStepComplete = (stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
  };

  const tutorialSections = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: Rocket,
      description: "Learn the basics of creating your first signature"
    },
    {
      id: "customization",
      title: "Customization",
      icon: Palette,
      description: "Personalize your signature with colors, fonts, and images"
    },
    {
      id: "advanced",
      title: "Advanced Features",
      icon: Settings,
      description: "Explore analytics, A/B testing, and team management"
    },
    {
      id: "integration",
      title: "Integration",
      icon: Target,
      description: "Connect your signature to email clients and platforms"
    }
  ];

  const gettingStartedSteps = [
    {
      id: "step-1",
      title: "Create Your Account",
      description: "Sign up for your free ProSignature account and access the dashboard",
      videoId: "demo-signup",
      duration: "2:30"
    },
    {
      id: "step-2", 
      title: "Choose a Template",
      description: "Browse our professional template library and select one that matches your style",
      videoId: "demo-templates",
      duration: "3:45"
    },
    {
      id: "step-3",
      title: "Add Your Information",
      description: "Fill in your contact details, job title, and company information",
      videoId: "demo-info",
      duration: "4:20"
    },
    {
      id: "step-4",
      title: "Customize Design",
      description: "Adjust colors, fonts, and layout to match your brand",
      videoId: "demo-design",
      duration: "5:15"
    },
    {
      id: "step-5",
      title: "Generate & Install",
      description: "Export your signature and install it in your email client",
      videoId: "demo-install",
      duration: "3:10"
    }
  ];

  return (
    <div className="min-h-screen pt-20 dark-hero-bg">
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
              Everything you need to know to create stunning email signatures and maximize their impact
            </p>
          </div>

          {/* Tutorial Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {tutorialSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id)}
                className={`creative-card p-6 rounded-2xl transition-all duration-500 hover-3d group ${
                  activeTab === section.id 
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-400/40' 
                    : 'hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-purple-500/10'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                    <section.icon className="w-6 h-6 text-cyan-300" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-light text-white group-hover:text-cyan-300 transition-colors duration-500">
                      {section.title}
                    </h3>
                    <p className="text-sm text-gray-400 font-light">{section.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tutorial Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {activeTab === "getting-started" && (
            <div className="space-y-12">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-light text-white mb-4">Getting Started</h2>
                <p className="text-xl text-gray-400 font-light">Follow these simple steps to create your first signature</p>
              </div>

              {/* Video Overview */}
              <div className="creative-card p-8 rounded-3xl mb-16">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <div className="flex-1">
                    <h3 className="text-2xl font-light text-white mb-4">Quick Start Video</h3>
                    <p className="text-gray-400 font-light leading-relaxed mb-6">
                      Watch this comprehensive overview to understand the entire process before diving into individual steps.
                    </p>
                    <Button className="btn-dark-modern group">
                      <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                      Watch Overview (8:45)
                    </Button>
                  </div>
                  <div className="flex-1">
                    <div className="aspect-video bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-2xl flex items-center justify-center border border-cyan-500/20">
                      <Play className="w-16 h-16 text-cyan-300 hover:scale-110 transition-transform duration-300 cursor-pointer" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step-by-Step Guide */}
              <div className="space-y-8">
                {gettingStartedSteps.map((step, index) => (
                  <Card key={step.id} className="creative-card border-0 hover-3d transition-all duration-700">
                    <CardContent className="p-8">
                      <div className="flex items-start gap-6">
                        <div className="flex-shrink-0">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-light text-lg transition-all duration-500 ${
                            completedSteps.has(step.id)
                              ? 'bg-emerald-500 text-white'
                              : 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20 text-cyan-300'
                          }`}>
                            {completedSteps.has(step.id) ? (
                              <CheckCircle className="w-6 h-6" />
                            ) : (
                              index + 1
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-light text-white mb-3">{step.title}</h3>
                          <p className="text-gray-400 font-light leading-relaxed mb-6">{step.description}</p>
                          
                          <div className="flex flex-col sm:flex-row gap-4">
                            <Button 
                              variant="outline" 
                              className="btn-accent-dark group"
                              onClick={() => markStepComplete(step.id)}
                            >
                              <Video className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                              Watch Video ({step.duration})
                            </Button>
                            <Button 
                              variant="ghost" 
                              className="text-gray-400 hover:text-white group"
                            >
                              <FileText className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                              Written Guide
                            </Button>
                            {!completedSteps.has(step.id) && (
                              <Button 
                                onClick={() => markStepComplete(step.id)}
                                className="text-emerald-400 hover:text-emerald-300 group"
                                variant="ghost"
                              >
                                <CheckCircle className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                                Mark Complete
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Progress Summary */}
              <div className="creative-card p-8 rounded-3xl text-center">
                <h3 className="text-2xl font-light text-white mb-4">Your Progress</h3>
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <div className="text-3xl font-light text-gradient-primary">
                    {completedSteps.size}/{gettingStartedSteps.length}
                  </div>
                  <div className="text-gray-400 font-light">steps completed</div>
                </div>
                {completedSteps.size === gettingStartedSteps.length && (
                  <div className="space-y-4">
                    <p className="text-emerald-400 font-light">🎉 Congratulations! You've completed the getting started guide!</p>
                    <Button className="btn-dark-modern group">
                      <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                      Continue to Customization
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Other Tutorial Sections */}
          {activeTab !== "getting-started" && (
            <div className="text-center py-20">
              <div className="creative-card p-12 rounded-3xl max-w-2xl mx-auto">
                <Lightbulb className="w-16 h-16 text-cyan-300 mx-auto mb-6 animate-pulse" />
                <h3 className="text-2xl font-light text-white mb-4">Coming Soon</h3>
                <p className="text-gray-400 font-light leading-relaxed mb-8">
                  We're working on creating comprehensive tutorials for {tutorialSections.find(s => s.id === activeTab)?.title.toLowerCase()}. 
                  These will include step-by-step guides, video tutorials, and practical examples.
                </p>
                <Button className="btn-dark-modern group">
                  <Users className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Join Waitlist
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Tutorial;
