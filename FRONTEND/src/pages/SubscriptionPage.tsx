
import React, { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/layout/Header";
import MainSidebar from "@/components/layout/Sidebar";
import MobileNavbar from "@/components/layout/MobileNavbar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Check, CreditCard } from "lucide-react";
import CreateSignatureModal from "@/components/modals/CreateSignatureModal";
import { useToast } from "@/hooks/use-toast";

const SubscriptionPage = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [activePlan, setActivePlan] = useState("pro");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { toast } = useToast();

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSidebarCollapseChange = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  const handleCreateSignature = () => {
    setCreateModalOpen(true);
  };

  const handleSignatureSuccess = (name: string) => {
    toast({
      title: "Success!",
      description: `Signature "${name}" created successfully!`,
    });
  };

  const handlePlanChange = (plan: string) => {
    setActivePlan(plan);
    toast({
      title: "Plan Selected",
      description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} plan selected`,
    });
  };

  const handleUpgrade = () => {
    toast({
      title: "Upgrade Initiated",
      description: "Processing your subscription upgrade",
    });
  };

  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: "$9",
      period: "/month",
      description: "Essential features for small teams",
      features: [
        "Up to 5 signatures",
        "Basic templates",
        "Standard support",
        "Analytics dashboard"
      ]
    },
    {
      id: "pro",
      name: "Pro",
      price: "$19",
      period: "/month",
      description: "Advanced features for growing businesses",
      features: [
        "Unlimited signatures",
        "Premium templates",
        "Priority support",
        "Advanced analytics",
        "Team collaboration",
      ],
      popular: true
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$49",
      period: "/month",
      description: "Custom solutions for large organizations",
      features: [
        "Everything in Pro",
        "Custom templates",
        "Dedicated support",
        "API access",
        "SSO integration",
        "Compliance features"
      ]
    }
  ];

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex w-full min-h-screen bg-[#001430] font-sans">
        <MainSidebar 
          open={sidebarOpen} 
          onOpenChange={setSidebarOpen} 
          onCreateSignature={handleCreateSignature}
          onCollapseChange={handleSidebarCollapseChange}
        />
        
        <div 
          className="flex flex-col flex-1 transition-all duration-300 ease-in-out"
          style={{ 
            width: "100%",
            marginLeft: isMobile ? 0 : sidebarCollapsed ? '70px' : '230px',
            paddingBottom: isMobile ? '80px' : '0'
          }}
        >
          <Header 
            onMenuClick={handleMenuClick}
            username="Deepesh"
          />

          <div className="flex flex-col p-4 sm:p-6 w-full">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <h1 className="text-white text-xl font-semibold">Subscription</h1>
                <p className="text-gray-400 text-sm">Manage your subscription plan</p>
              </div>
            </div>

            <div className="bg-[#031123] border border-[#112F59] rounded-lg p-6 mb-8 w-full">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#01C8A9] text-white text-xs py-1 px-2 rounded-full">Current Plan</span>
                    <h3 className="text-white font-medium">Pro Plan</h3>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">Your subscription will expire on 23/03/2025</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="border border-[#112F59] text-white px-4 py-2 rounded-md hover:bg-[#07234A] transition-colors">
                    Cancel Plan
                  </button>
                  <button className="bg-[#01C8A9] hover:bg-[#01a78f] text-white px-4 py-2 rounded-md transition-colors">
                    Renew Now
                  </button>
                </div>
              </div>
            </div>

            <h2 className="text-white text-lg font-medium mb-4">Available Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              {plans.map((plan) => (
                <div 
                  key={plan.id}
                  className={`bg-[#031123] border rounded-lg overflow-hidden transition-all duration-300 relative ${
                    activePlan === plan.id 
                      ? 'border-[#01C8A9] ring-1 ring-[#01C8A9]' 
                      : 'border-[#112F59] hover:border-[#01C8A9]/50'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-[#01C8A9] text-white text-xs py-1 px-3 rounded-bl-lg">
                        Popular
                      </div>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-white font-medium text-lg">{plan.name}</h3>
                    <div className="mt-2">
                      <span className="text-white text-2xl font-bold">{plan.price}</span>
                      <span className="text-gray-400 text-sm">{plan.period}</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-2">{plan.description}</p>
                    
                    <ul className="mt-4 space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-[#01C8A9] flex-shrink-0" />
                          <span className="text-white text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <button
                      onClick={() => handlePlanChange(plan.id)}
                      className={`mt-6 w-full py-2.5 rounded-md font-medium transition-colors ${
                        activePlan === plan.id
                          ? 'bg-[#01C8A9] text-white'
                          : 'bg-[#07234A] text-white hover:bg-[#01C8A9] hover:text-white'
                      }`}
                    >
                      {activePlan === plan.id ? 'Current Selection' : 'Select Plan'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 bg-[#031123] border border-[#112F59] rounded-lg p-6 w-full">
              <h3 className="text-white font-medium mb-4">Payment Method</h3>
              <div className="flex items-center gap-4 p-4 border border-[#112F59] rounded-lg">
                <div className="bg-[#07234A] p-2 rounded-md">
                  <CreditCard className="h-6 w-6 text-[#01C8A9]" />
                </div>
                <div>
                  <p className="text-white text-sm">Visa ending in 4242</p>
                  <p className="text-gray-400 text-xs">Expires 12/2025</p>
                </div>
                <button className="text-[#01C8A9] hover:text-[#01a78f] text-sm ml-auto">
                  Change
                </button>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleUpgrade}
                  className="bg-[#01C8A9] hover:bg-[#01a78f] text-white font-medium px-6 py-2.5 rounded-md transition-all duration-300"
                >
                  Upgrade Subscription
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        {isMobile && (
          <MobileNavbar onCreateClick={handleCreateSignature} />
        )}
      </div>

      <CreateSignatureModal 
        open={createModalOpen} 
        onOpenChange={setCreateModalOpen}
        onSuccess={handleSignatureSuccess}
      />
    </SidebarProvider>
  );
};

export default SubscriptionPage;
