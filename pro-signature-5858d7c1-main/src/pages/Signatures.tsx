
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, Copy, Star, Palette, Zap, Users, Building, Sparkles, Play } from "lucide-react";

interface SignaturesProps {
  onAuthAction: (action: 'signin' | 'signup') => void;
}

const Signatures = ({ onAuthAction }: SignaturesProps) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hoveredTemplate, setHoveredTemplate] = useState<number | null>(null);

  const categories = ["All", "Modern", "Professional", "Creative", "Minimal"];

  const templates = [
    {
      id: 1,
      name: "Executive Pro",
      category: "Professional",
      preview: "/lovable-uploads/c9b0f6e1-d4ca-40d7-9eb0-5706cf70f2c1.png",
      rating: 4.9,
      downloads: "12.5K",
      features: ["Social Links", "Company Logo", "Contact Info"],
      isPremium: false
    },
    {
      id: 2,
      name: "Creative Edge",
      category: "Creative",
      preview: "/lovable-uploads/e48ee70d-cc64-4816-9ef8-85ae556b7f8d.png",
      rating: 4.8,
      downloads: "8.2K",
      features: ["Animated Icons", "Color Gradients", "Custom Fonts"],
      isPremium: true
    },
    {
      id: 3,
      name: "Minimal Clean",
      category: "Minimal",
      preview: "/lovable-uploads/2c963d8a-b8cb-4f4c-a415-66da6dd3b901.png",
      rating: 4.7,
      downloads: "15.1K",
      features: ["Clean Layout", "Typography Focus", "Mobile Optimized"],
      isPremium: false
    },
    {
      id: 4,
      name: "Modern Corporate",
      category: "Modern",
      preview: "/lovable-uploads/52021a06-8ced-4327-8ea5-adfd92329368.png",
      rating: 4.9,
      downloads: "9.8K",
      features: ["Dark Theme", "Interactive Elements", "Analytics Ready"],
      isPremium: true
    },
    {
      id: 5,
      name: "Startup Vibe",
      category: "Modern",
      preview: "/lovable-uploads/ed048820-101c-494c-8e6f-59d9278098cd.png",
      rating: 4.6,
      downloads: "6.7K",
      features: ["Bold Colors", "Modern Icons", "CTA Buttons"],
      isPremium: false
    },
    {
      id: 6,
      name: "Enterprise Elite",
      category: "Professional",
      preview: "/lovable-uploads/c9d207c4-f978-4a11-899c-e740a2999efc.png",
      rating: 5.0,
      downloads: "11.3K",
      features: ["Multi-language", "Advanced Analytics", "Team Management"],
      isPremium: true
    }
  ];

  const filteredTemplates = selectedCategory === "All" 
    ? templates 
    : templates.filter(template => template.category === selectedCategory);

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
        <div className="flex flex-wrap justify-center gap-4 mb-12">
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
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredTemplates.map((template) => (
            <Card 
              key={template.id} 
              className="creative-card border border-gray-700 transition-all duration-500 hover-3d group overflow-hidden"
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={template.preview} 
                  alt={template.name}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {template.isPremium && (
                  <Badge className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black">
                    Premium
                  </Badge>
                )}
                <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${
                  hoveredTemplate === template.id ? 'opacity-100' : 'opacity-0'
                }`}>
                  <div className="flex gap-3">
                    <Button size="sm" variant="outline" className="text-white border-white hover:bg-white hover:text-black">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => onAuthAction('signin')}
                      className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Use Template
                    </Button>
                  </div>
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-light text-white group-hover:text-cyan-300 transition-colors duration-300">
                    {template.name}
                  </CardTitle>
                  <div className="flex items-center text-yellow-400">
                    <Star className="w-4 h-4 fill-current mr-1" />
                    <span className="text-sm font-light">{template.rating}</span>
                  </div>
                </div>
                <div className="flex items-center text-gray-400 text-sm font-light">
                  <Download className="w-4 h-4 mr-1" />
                  {template.downloads} downloads
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2 mb-4">
                  {template.features.map((feature, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="text-xs border-gray-600 text-gray-300"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-gray-600 text-gray-300 hover:border-cyan-400 hover:text-cyan-300"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => onAuthAction('signin')}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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

        {/* CTA Section */}
        <div className="text-center creative-card p-12 rounded-3xl">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 mb-8 text-sm font-light text-cyan-300 border border-cyan-500/20">
            <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
            Ready to Get Started?
          </div>
          <h2 className="text-3xl md:text-4xl font-light mb-6 text-white">
            Create Your Professional Signature
          </h2>
          <p className="text-xl text-gray-400 mb-8 font-light max-w-2xl mx-auto">
            Choose from our collection of professionally designed templates and start building your signature today.
          </p>
          <Button 
            size="lg"
            onClick={() => onAuthAction('signup')}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white text-xl px-12 py-6 rounded-2xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300"
          >
            Start Building Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Signatures;
