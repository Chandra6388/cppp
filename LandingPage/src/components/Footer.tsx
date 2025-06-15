
import { Link } from "react-router-dom";
import { Instagram, Facebook } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const quickLinks = [{
    name: "Home",
    href: "/"
  }, {
    name: "About",
    href: "/about"
  }, {
    name: "Services",
    href: "/services"
  }, {
    name: "Signatures",
    href: "/signatures"
  }, {
    name: "Contact",
    href: "/contact"
  }];
  const legal = [{
    name: "Privacy Policy",
    href: "#"
  }, {
    name: "Terms of Service",
    href: "#"
  }, {
    name: "Cookie Policy",
    href: "#"
  }, {
    name: "GDPR Compliance",
    href: "#"
  }];
  
  return <footer className="relative bg-gradient-to-b from-black via-gray-900/50 to-black border-t border-cyan-500/20 overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-float" style={{
        animationDelay: '3s'
      }}></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Enhanced Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <img src="/lovable-uploads/c9b0f6e1-d4ca-40d7-9eb0-5706cf70f2c1.png" alt="ProSignature Logo" className="h-12 object-contain" />
            </div>
            <p className="text-gray-400 mb-8 leading-relaxed font-light">
              Transform your email signature into a smart branding engine with AI-powered analytics and real-time insights that drive unprecedented business growth.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/prosignature.io/" target="_blank" className="w-12 h-12 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center hover:from-cyan-500/40 hover:to-purple-500/40 transition-all duration-500 hover:scale-110 hover:-translate-y-1 border border-cyan-500/20 hover:border-cyan-400/40 backdrop-blur-sm" aria-label="Instagram">
                <Instagram className="w-5 h-5 text-gray-300 hover:text-white transition-colors" />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61572224159494" target="_blank" className="w-12 h-12 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center hover:from-cyan-500/40 hover:to-purple-500/40 transition-all duration-500 hover:scale-110 hover:-translate-y-1 border border-cyan-500/20 hover:border-cyan-400/40 backdrop-blur-sm" aria-label="Facebook">
                <Facebook className="w-5 h-5 text-gray-300 hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Enhanced Quick Links */}
          <div>
            <h3 className="text-xl font-light mb-8 text-gradient-primary flex items-center animate-section-heading">
              <span className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mr-3 animate-pulse"></span>
              Quick Links
            </h3>
            <ul className="space-y-4">
              {quickLinks.map((link, index) => <li key={index} className="transform transition-all duration-300 hover:translate-x-2">
                  <Link to={link.href} className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 font-light flex items-center group">
                    <span className="w-1 h-1 bg-cyan-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {link.name}
                  </Link>
                </li>)}
            </ul>
          </div>

          {/* Enhanced Contact Info */}
          <div>
            <h3 className="text-xl font-light mb-8 text-gradient-primary flex items-center animate-section-heading">
              <span className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mr-3 animate-pulse"></span>
              Contact
            </h3>
            <div className="space-y-6">
              <div className="group">
                <div className="text-sm text-gray-500 mb-2 font-light">Email</div>
                <a href="mailto:support@prosignature.ai" className="text-white hover:text-cyan-400 transition-colors duration-300 group-hover:translate-x-1 inline-block transform">
                support@prosignature.ai
                </a>
              </div>
               
            </div>
          </div>

          {/* Enhanced Legal */}
          <div>
            <h3 className="text-xl font-light mb-8 text-gradient-primary flex items-center animate-section-heading">
              <span className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mr-3 animate-pulse"></span>
              Legal
            </h3>
            <ul className="space-y-4">
              {legal.map((link, index) => <li key={index} className="transform transition-all duration-300 hover:translate-x-2">
                  <a href={link.href} className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 font-light flex items-center group">
                    <span className="w-1 h-1 bg-cyan-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {link.name}
                  </a>
                </li>)}
            </ul>
          </div>
        </div>

        {/* Enhanced Bottom Section */}
        <div className="border-t border-cyan-500/20 mt-16 pt-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-6 md:mb-0 font-light">
              © {currentYear} ProSignature. Powered by ITs Win Technologies.
            </div>
            <div className="flex items-center space-x-8 text-sm text-gray-400">
              <span className="flex items-center hover:text-cyan-400 transition-colors duration-300">
                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>
                100% Secure
              </span>
              
              <span className="flex items-center hover:text-cyan-400 transition-colors duration-300">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                99.9% Uptime
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Scroll to Top Button */}
      <button onClick={() => window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })} className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center hover:from-cyan-400 hover:to-purple-400 transition-all duration-500 shadow-2xl hover:shadow-cyan-500/50 z-50 group hover:scale-110 hover:-translate-y-1" aria-label="Scroll to top">
        <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>;
};

export default Footer;
