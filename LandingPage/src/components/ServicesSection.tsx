
const ServicesSection = () => {
  const services = [
    {
      icon: "📊",
      title: "Signature Analytics",
      description: "Track views, clicks, and reach in real time.",
      features: ["Real-time tracking", "Detailed reports", "Performance metrics"]
    },
    {
      icon: "🎨",
      title: "Custom Templates",
      description: "Use ready-made, modern signature styles.",
      features: ["Professional designs", "Brand customization", "Mobile responsive"]
    },
    {
      icon: "🔗",
      title: "Smart Link Integration",
      description: "Add Calendly, WhatsApp, LinkedIn & more.",
      features: ["One-click booking", "Social media links", "Custom CTAs"]
    },
    {
      icon: "📥",
      title: "Bulk Signature Deployment",
      description: "For teams, orgs, and enterprise.",
      features: ["Team management", "Brand consistency", "Centralized control"]
    },
    {
      icon: "🧪",
      title: "A/B Testing",
      description: "Test what style performs better.",
      features: ["Split testing", "Performance comparison", "Data-driven decisions"],
      badge: "Coming Soon"
    },
    {
      icon: "📤",
      title: "Email Client Support",
      description: "Works with Gmail, Outlook, Apple Mail.",
      features: ["Universal compatibility", "Easy setup", "Seamless integration"]
    }
  ];

  return (
    <section id="services" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            What You Can Do with <span className="text-gradient">ProSignature</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive tools to elevate your email signature game and track its impact
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="glass-card p-8 rounded-2xl hover-3d group relative"
            >
              {service.badge && (
                <div className="absolute -top-3 -right-3 bg-prosignature-gradient text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {service.badge}
                </div>
              )}
              
              <div className="text-5xl mb-6 group-hover:animate-bounce">{service.icon}</div>
              
              <h3 className="text-xl font-bold mb-4">{service.title}</h3>
              
              <p className="text-gray-300 mb-6">{service.description}</p>
              
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-400">
                    <span className="text-prosignature mr-2">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <div className="mt-6 pt-6 border-t border-prosignature/20">
                <button className="text-prosignature hover:text-prosignature-600 transition-colors font-semibold">
                  Learn More →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
