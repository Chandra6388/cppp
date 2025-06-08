
const AboutSection = () => {
  const stats = [
    { icon: "📈", number: "10K+", label: "Signatures Created" },
    { icon: "🌍", number: "20+", label: "Countries" },
    { icon: "🧠", number: "AI", label: "Smart Analytics" },
    { icon: "🔒", number: "100%", label: "GDPR Ready" }
  ];

  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Why <span className="text-gradient">ProSignature</span>?
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            ProSignature is more than a signature tool—it's your personal branding system built for the modern digital world. 
            With AI-driven analytics, customizable designs, and real-time engagement tracking, we give you complete control 
            and visibility over your email communication impact.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center glass-card p-8 rounded-2xl hover-3d group"
            >
              <div className="text-5xl mb-4 group-hover:animate-bounce">{stat.icon}</div>
              <div className="text-3xl font-bold text-gradient mb-2">{stat.number}</div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-20 grid md:grid-cols-2 gap-12 items-center">
          <div className="glass-card p-8 rounded-3xl">
            <h3 className="text-2xl font-bold mb-4">Built for Modern Professionals</h3>
            <p className="text-gray-300 mb-6">
              Whether you're a startup founder, sales executive, or freelancer, ProSignature 
              transforms every email into a strategic touchpoint that builds your brand and drives results.
            </p>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center">
                <span className="text-prosignature mr-3">✓</span>
                Enterprise-grade security
              </li>
              <li className="flex items-center">
                <span className="text-prosignature mr-3">✓</span>
                GDPR & privacy compliant
              </li>
              <li className="flex items-center">
                <span className="text-prosignature mr-3">✓</span>
                Works with all email clients
              </li>
            </ul>
          </div>

          <div className="glass-card p-8 rounded-3xl">
            <h3 className="text-2xl font-bold mb-4">AI-Powered Intelligence</h3>
            <p className="text-gray-300 mb-6">
              Our advanced AI analyzes your signature performance, suggests optimizations, 
              and provides actionable insights to maximize your professional impact.
            </p>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Performance Score</span>
                <span className="text-prosignature font-bold">94%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3">
                <div className="bg-prosignature-gradient h-3 rounded-full w-[94%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
