
import { Button } from "@/components/ui/button";

const SignaturesSection = () => {
  const signatures = [
    {
      type: "Tech Developer",
      name: "Alex Rodriguez",
      title: "Full Stack Developer",
      company: "TechFlow Solutions",
      color: "from-blue-500 to-cyan-500"
    },
    {
      type: "Marketing",
      name: "Sarah Chen",
      title: "Marketing Director",
      company: "GrowthHub Agency",
      color: "from-pink-500 to-rose-500"
    },
    {
      type: "Corporate Clean",
      name: "Michael Thompson",
      title: "Senior Consultant",
      company: "Business Solutions Inc.",
      color: "from-gray-500 to-slate-500"
    },
    {
      type: "Freelancer Portfolio",
      name: "Emma Williams",
      title: "Creative Designer",
      company: "Independent Designer",
      color: "from-purple-500 to-indigo-500"
    },
    {
      type: "Social Media Influencer",
      name: "Jake Morrison",
      title: "Content Creator",
      company: "@jakecreates",
      color: "from-orange-500 to-yellow-500"
    }
  ];

  return (
    <section id="signatures" className="py-20 bg-gradient-to-b from-transparent to-prosignature/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Choose Your Style, <span className="text-gradient">Make It Yours</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore powerful templates designed to impress. Click any template to preview it live.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {signatures.map((sig, index) => (
            <div 
              key={index} 
              className="glass-card p-6 rounded-2xl hover-3d group cursor-pointer"
            >
              <div className="mb-4">
                <div className="text-sm text-prosignature font-semibold mb-2">{sig.type} Signature</div>
                <div className={`h-32 bg-gradient-to-br ${sig.color} rounded-lg p-4 text-white relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="relative z-10">
                    <div className="font-bold text-lg">{sig.name}</div>
                    <div className="text-sm opacity-90">{sig.title}</div>
                    <div className="text-xs opacity-75">{sig.company}</div>
                    <div className="mt-2 flex space-x-2">
                      <div className="w-6 h-6 bg-white/20 rounded"></div>
                      <div className="w-6 h-6 bg-white/20 rounded"></div>
                      <div className="w-6 h-6 bg-white/20 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex justify-between">
                  <span>Views this month</span>
                  <span className="text-prosignature font-semibold">{Math.floor(Math.random() * 1000) + 500}</span>
                </div>
                <div className="flex justify-between">
                  <span>Click rate</span>
                  <span className="text-prosignature font-semibold">{(Math.random() * 20 + 5).toFixed(1)}%</span>
                </div>
              </div>
              
              <Button 
                className="w-full mt-4 bg-prosignature-gradient hover:opacity-90" 
                size="sm"
              >
                Use This Template
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button 
            size="lg" 
            className="bg-prosignature-gradient hover:opacity-90 px-8 py-3"
          >
            [ Use It Like This ]
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SignaturesSection;
