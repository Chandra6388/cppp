import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, Copy, Star, Palette, Zap, Users, Building, Sparkles, Play, Clock, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import * as Config from "../Utils/config";

interface ActualTemplate {
  id: number;
  name: string;
  category: string;
  preview: string;
  rating: number;
  downloads: string;
  features: string[];
  isPremium: boolean;
  isComingSoon: false;
}

interface ComingSoonTemplate {
  id: number;
  name: string;
  category: string;
  isComingSoon: true;
}

type Template = ActualTemplate | ComingSoonTemplate;

const Signatures = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hoveredTemplate, setHoveredTemplate] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleAuthAction = (action: 'signin' | 'signup') => {
    if (action === 'signin') {
      window.location.href = `${Config.FRONTEND_URL}login`
    } else {
      window.location.href = `${Config.FRONTEND_URL}signup`
    }
  };


  const actualTemplates: ActualTemplate[] = [
    {
      id: 1,
      name: "Executive Pro",
      category: "Professional",
      preview: "https://prosignature.s3.us-east-2.amazonaws.com/1749711880678-upload.jpg",
      rating: 4.9,
      downloads: "12.5K",
      features: ["Social Links", "Company Logo", "Contact Info"],
      isPremium: false,
      isComingSoon: false
    },
    {
      id: 2,
      name: "Creative Edge",
      category: "Modern",
      preview: "https://prosignature.s3.us-east-2.amazonaws.com/1749711723849-upload.jpg",
      rating: 4.8,
      downloads: "8.2K",
      features: ["Animated Icons", "Color Gradients", "Custom Fonts"],
      isPremium: true,
      isComingSoon: false
    },
    {
      id: 3,
      name: "Creative Edge",
      category: "Modern",
      preview: "https://prosignature.s3.us-east-2.amazonaws.com/1749711176041-upload.jpg",
      rating: 4.8,
      downloads: "8.2K",
      features: ["Animated Icons", "Color Gradients", "Custom Fonts"],
      isPremium: true,
      isComingSoon: false
    }
  ];


  const allTemplates: Template[] = [...actualTemplates];

  const filteredTemplates = selectedCategory === "All"
    ? allTemplates
    : allTemplates.filter(template => template.category === selectedCategory);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 dark-hero-bg">
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 rounded-full creative-card mb-8 text-sm font-light text-cyan-300 backdrop-blur-xl border border-cyan-500/20">
            <Palette className="w-4 h-4 mr-2 animate-pulse" />
            Professional Email Signatures
          </div>
          <h1 className="text-5xl md:text-6xl font-light mb-6 text-white">
            Choose Your Perfect <span className="text-gradient-primary font-extrabold">Signature</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
            Professionally designed templates that convert visitors into customers.
            Each template is optimized for performance and engagement.
          </p>
        </div>

        {/* Category Filter */}
        {/* <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-6 py-2 transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg"
                  : "border-gray-600 text-gray-300 hover:border-cyan-400 hover:text-cyan-300"
              }`}
            >
              {category}
            </Button>
          ))}
        </div> */}

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className="creative-card border border-gray-700 transition-all duration-500 hover-3d group overflow-hidden"
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
            >

              <>
                <div className="relative overflow-hidden">
                  <img
                    src={(template as ActualTemplate).preview}
                    alt={template.name}
                    className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* {(template as ActualTemplate).isPremium && (
                    <Badge className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black">
                      Premium
                    </Badge>
                  )} */}
                  {/* <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${hoveredTemplate === template.id ? 'opacity-100' : 'opacity-0'
                    }`}>
                    <div className="flex gap-3">
                      <Button size="sm" variant="outline" className="text-white border-white hover:bg-white hover:text-black">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAuthAction('signin')}
                        className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Use Template
                      </Button>
                    </div>
                  </div> */}
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>

                    <CardTitle className="text-xl font-light text-white group-hover:text-cyan-300 transition-colors duration-300">
                      {template.name}
                    </CardTitle>
                    {!template.isComingSoon && (
                    <div className="flex items-center text-gray-400 text-sm font-light">
                      <Users  className="w-4 h-4 mr-1" />
                      {(template as ActualTemplate).downloads} Used
                    </div>
                  )}
                    </div>
                    <div>

                    <Button
                      size="sm"
                      onClick={() => handleAuthAction('signin')}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 "
                    
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Use Template
                    </Button>
                    </div>
                  </div>
                 
                </CardHeader>

                <CardContent className="pt-0">
                  {/* {!template.isComingSoon && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(template as ActualTemplate).features.map((feature, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs border-gray-600 text-gray-300"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  )} */}

                  <div className="flex gap-2">
                    {/* <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-gray-600 text-gray-300 hover:border-cyan-400 hover:text-cyan-300"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button> */}
                    
                  </div>
                </CardContent>
              </>

            </Card>
          ))}
        </div>

        {/* Coming Soon Section */}
        {/* <div className="text-center mb-16 creative-card p-12 rounded-3xl">
          <Sparkles className="w-16 h-16 text-cyan-400 mx-auto mb-6 animate-pulse" />
          <h2 className="text-3xl md:text-4xl font-light mb-6 text-white">
            More Templates <span className="text-gradient-accent font-bold">Coming Soon</span>
          </h2>
          <p className="text-xl text-gray-400 mb-8 font-light max-w-2xl mx-auto">
            We're working on exciting new templates to give you even more professional options. Stay tuned!
          </p>
          <Button
            size="lg"
            onClick={() => handleAuthAction('signup')}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white text-xl px-12 py-6 rounded-2xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300"
          >
            Get Notified When Ready
          </Button>
        </div> */}

        {/* Features Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light mb-8 text-white">
            Why Choose Our <span className="text-gradient-accent font-bold">Templates</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                desc: "Optimized for speed and performance across all email clients"
              },
              {
                icon: Users,
                title: "Team Collaboration",
                desc: "Share and manage signatures across your entire organization"
              },
              {
                icon: Building,
                title: "Enterprise Ready",
                desc: "Scalable solutions for businesses of all sizes"
              }
            ].map((feature, index) => (
              <div key={index} className="creative-card p-8 rounded-3xl text-center hover-3d group">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-cyan-300" />
                </div>
                <h3 className="text-xl font-light mb-4 text-white group-hover:text-cyan-300 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 font-light leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signatures;
