
import { Button } from "@/components/ui/button";

const PricingSection = () => {
  const plans = [
    {
      name: "Individual",
      icon: "🧍",
      price: "₹199",
      period: "/month",
      yearlyPrice: "₹1,999",
      yearlyPeriod: "/year",
      description: "Perfect for professionals and freelancers",
      features: [
        "Unlimited Signatures",
        "AI Analytics",
        "Real-Time Dashboard",
        "All Integrations",
        "Email Support",
        "Mobile App Access"
      ],
      popular: false
    },
    {
      name: "Team",
      icon: "👥",
      price: "₹699",
      period: "/month",
      yearlyPrice: "₹6,999",
      yearlyPeriod: "/year",
      description: "Ideal for small to medium teams",
      features: [
        "Everything in Individual",
        "Team Management",
        "Brand Consistency Tools",
        "Bulk Deployment",
        "Advanced Analytics",
        "Priority Support",
        "Team Collaboration",
        "Custom Branding"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      icon: "🏢",
      price: "Custom",
      period: "pricing",
      yearlyPrice: "Contact",
      yearlyPeriod: "us",
      description: "For large organizations with custom needs",
      features: [
        "Everything in Team",
        "Custom Integrations",
        "Dedicated Account Manager",
        "SLA Guarantee",
        "Custom Training",
        "API Access",
        "White-label Solution",
        "Advanced Security"
      ],
      popular: false
    }
  ];

  const commonFeatures = [
    "✅ Unlimited Signatures",
    "✅ AI Analytics", 
    "✅ Real-Time Dashboard",
    "✅ All Integrations"
  ];

  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-prosignature/5 to-transparent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Simple, <span className="text-gradient">Transparent Pricing</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose the plan that fits your needs. All plans include our core features with no hidden costs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`glass-card p-8 rounded-2xl hover-3d relative ${
                plan.popular ? 'ring-2 ring-prosignature border-prosignature/50' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-prosignature-gradient text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <div className="text-4xl mb-4">{plan.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
                
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gradient">{plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>
                
                <div className="text-sm text-gray-400">
                  or <span className="text-prosignature font-semibold">{plan.yearlyPrice}</span>
                  <span className="text-gray-400">{plan.yearlyPeriod}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm">
                    <span className="text-prosignature mr-3">✓</span>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className={`w-full ${
                  plan.popular 
                    ? 'bg-prosignature-gradient hover:opacity-90' 
                    : 'border border-prosignature text-prosignature hover:bg-prosignature hover:text-white'
                }`}
                variant={plan.popular ? 'default' : 'outline'}
                size="lg"
              >
                {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
              </Button>
            </div>
          ))}
        </div>

        {/* Common Features */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-6">All Plans Include:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {commonFeatures.map((feature, index) => (
              <div key={index} className="glass-card p-4 rounded-xl text-center">
                <span className="text-sm text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
