
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const InsightsSection = () => {
  const [activeTab, setActiveTab] = useState("analytics");
  
  const tabs = [
    { id: "analytics", label: "Analytics" },
    { id: "performance", label: "Performance" },
    { id: "growth", label: "Growth" }
  ];

  return (
    <section id="insights" className="py-32 section-dark relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in-3d">
          <div className="inline-flex items-center px-8 py-4 rounded-full creative-card mb-12 text-base font-light text-cyan-300 backdrop-blur-2xl border border-cyan-500/20">
            <svg className="w-5 h-5 mr-3 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Real-Time Insights
          </div>
          <h2 className="text-5xl md:text-6xl font-light mb-8 text-white animate-section-heading">
            Your Signature. <span className="text-gradient-primary font-extrabold">Your Metrics.</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
            Get deep insights into how your signature performs and optimize for maximum impact
          </p>
        </div>

        <div className="flex flex-wrap justify-center mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-8 py-3 rounded-full m-2 transition-all duration-500 ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/20' 
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Analytics Tab Content */}
        <div className={`transition-opacity duration-500 ${activeTab === 'analytics' ? 'opacity-100' : 'opacity-0 absolute -z-10'}`}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Views Over Time */}
            <div className="creative-card p-8 rounded-2xl hover-3d group animate-fade-in-3d">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-light text-white group-hover:text-cyan-300 transition-colors">
                  Views Over Time
                </h3>
                <span className="text-xs font-light text-gray-500">Last 7 days</span>
              </div>
              <div className="space-y-4">
                {[
                  { day: "Mon", views: 45 },
                  { day: "Tue", views: 67 },
                  { day: "Wed", views: 89 },
                  { day: "Thu", views: 123 },
                  { day: "Fri", views: 156 },
                  { day: "Sat", views: 34 },
                  { day: "Sun", views: 23 }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">{item.day}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 md:w-48 bg-gray-800 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-1000" 
                          style={{width: `${(item.views / 156) * 100}%`}}
                        ></div>
                      </div>
                      <span className="text-cyan-300 font-light text-sm w-10 text-right">{item.views}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Click-Through Rate */}
            <div className="creative-card p-8 rounded-2xl hover-3d group animate-fade-in-3d" style={{ animationDelay: '150ms' }}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-light text-white group-hover:text-cyan-300 transition-colors">
                  Click-Through Rate
                </h3>
                <span className="text-xs font-light text-gray-500">Today</span>
              </div>
              <div className="text-center py-6">
                <div className="text-4xl font-bold text-gradient-primary mb-2">18.5%</div>
                <div className="text-sm text-gray-400 mb-8">Above Industry Average</div>
                <div className="relative w-32 h-32 mx-auto">
                  <svg className="transform -rotate-90 w-32 h-32">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="transparent"
                      className="text-gray-800"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="url(#gradientInsights)"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray="351.86"
                      strokeDashoffset="287.03"
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="gradientInsights" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-2xl font-light text-cyan-300">18.5%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Link Performance */}
            <div className="creative-card p-8 rounded-2xl hover-3d group animate-fade-in-3d" style={{ animationDelay: '300ms' }}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-light text-white group-hover:text-cyan-300 transition-colors">
                  Top Links Clicked
                </h3>
                <span className="text-xs font-light text-gray-500">Last 30 days</span>
              </div>
              <div className="space-y-5">
                {[
                  { name: "LinkedIn Profile", clicks: 234, icon: "link" },
                  { name: "Calendar Link", clicks: 189, icon: "calendar" },
                  { name: "Portfolio Site", clicks: 156, icon: "globe" },
                  { name: "Contact Form", clicks: 98, icon: "mail" }
                ].map((link, index) => (
                  <div key={index} className="flex items-center justify-between group">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-md bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                        <svg className="w-4 h-4 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          {link.icon === "link" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />}
                          {link.icon === "calendar" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />}
                          {link.icon === "globe" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />}
                          {link.icon === "mail" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />}
                        </svg>
                      </div>
                      <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{link.name}</span>
                    </div>
                    <span className="text-cyan-300 font-light">{link.clicks}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-800">
                <a href="#" className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors group">
                  <span>View all links</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* Device Usage */}
            <div className="creative-card p-8 rounded-2xl hover-3d group animate-fade-in-3d" style={{ animationDelay: '450ms' }}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-light text-white group-hover:text-cyan-300 transition-colors">
                  Device Usage
                </h3>
                <span className="text-xs font-light text-gray-500">Last 30 days</span>
              </div>
              <div className="space-y-6">
                {[
                  { device: "Desktop", percentage: 65, icon: "desktop" },
                  { device: "Mobile", percentage: 28, icon: "smartphone" },
                  { device: "Tablet", percentage: 7, icon: "tablet" }
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-md bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                          <svg className="w-4 h-4 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            {item.icon === "desktop" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />}
                            {item.icon === "smartphone" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />}
                            {item.icon === "tablet" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />}
                          </svg>
                        </div>
                        <span className="text-sm text-gray-300">{item.device}</span>
                      </div>
                      <span className="text-cyan-300 font-light">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-1000" 
                        style={{width: `${item.percentage}%`}}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Geographic Reach */}
            <div className="creative-card p-8 rounded-2xl hover-3d group animate-fade-in-3d" style={{ animationDelay: '600ms' }}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-light text-white group-hover:text-cyan-300 transition-colors">
                  Geographic Reach
                </h3>
                <span className="text-xs font-light text-gray-500">Global</span>
              </div>
              <div className="space-y-4">
                {[
                  { country: "India", views: 1234, code: "IN" },
                  { country: "USA", views: 567, code: "US" },
                  { country: "UK", views: 234, code: "GB" },
                  { country: "Canada", views: 123, code: "CA" },
                  { country: "Australia", views: 98, code: "AU" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between group">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-md bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center overflow-hidden">
                        <span className="text-lg">{getCountryFlag(item.code)}</span>
                      </div>
                      <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{item.country}</span>
                    </div>
                    <span className="text-cyan-300 font-light">{item.views}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Engagement Score */}
            <div className="creative-card p-8 rounded-2xl hover-3d group animate-fade-in-3d" style={{ animationDelay: '750ms' }}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-light text-white group-hover:text-cyan-300 transition-colors">
                  AI Engagement Score
                </h3>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                  <span className="text-xs font-light text-emerald-400">Live</span>
                </div>
              </div>
              <div className="text-center mb-6">
                <div className="text-6xl font-bold text-gradient-secondary mb-2">92</div>
                <div className="text-sm text-emerald-400 mb-4 font-light">Excellent Performance</div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="flex justify-between text-sm items-center">
                  <span className="text-gray-400">Design Quality</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-800 rounded-full h-1.5">
                      <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-1.5 rounded-full" style={{width: '95%'}}></div>
                    </div>
                    <span className="text-cyan-300">95%</span>
                  </div>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span className="text-gray-400">Content Relevance</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-800 rounded-full h-1.5">
                      <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-1.5 rounded-full" style={{width: '89%'}}></div>
                    </div>
                    <span className="text-cyan-300">89%</span>
                  </div>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span className="text-gray-400">Call-to-Action</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-800 rounded-full h-1.5">
                      <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-1.5 rounded-full" style={{width: '92%'}}></div>
                    </div>
                    <span className="text-cyan-300">92%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Tab Content */}
        <div className={`transition-opacity duration-500 ${activeTab === 'performance' ? 'opacity-100' : 'opacity-0 absolute -z-10'}`}>
          <div className="creative-card p-10 rounded-2xl hover-3d group animate-fade-in-3d text-center">
            <h3 className="text-2xl font-light text-white mb-8">Performance Metrics</h3>
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="flex flex-col items-center space-y-8">
                <div className="text-6xl font-light text-gradient-secondary">+28%</div>
                <p className="text-xl text-gray-300 max-w-lg">
                  Increase in signature engagement since implementation
                </p>
                <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 mt-6">
                  View Full Report
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Growth Tab Content */}
        <div className={`transition-opacity duration-500 ${activeTab === 'growth' ? 'opacity-100' : 'opacity-0 absolute -z-10'}`}>
          <div className="creative-card p-10 rounded-2xl hover-3d group animate-fade-in-3d text-center">
            <h3 className="text-2xl font-light text-white mb-8">Growth Predictions</h3>
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="flex flex-col items-center space-y-8">
                <div className="text-6xl font-light text-gradient-accent">3.2x</div>
                <p className="text-xl text-gray-300 max-w-lg">
                  Projected ROI within the next quarter based on current trends
                </p>
                <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 mt-6">
                  View Growth Plan
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Helper function to convert country codes to flags
function getCountryFlag(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  
  return String.fromCodePoint(...codePoints);
}

export default InsightsSection;
