
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Signatures", href: "/signatures" },
    { name: "Contact", href: "/contact" }
  ];
  const legal = [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
    { name: "GDPR Compliance", href: "#" }
  ];
  const socialIcons = [
    { name: "LinkedIn", icon: "linkedin", href: "#" },
    { name: "Twitter", icon: "twitter", href: "#" },
    { name: "Instagram", icon: "instagram", href: "#" },
    { name: "GitHub", icon: "github", href: "#" }
  ];

  return (
    <footer className="relative bg-gradient-to-b from-black via-gray-900/50 to-black border-t border-cyan-500/20 overflow-hidden">
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
              <img 
                src="/lovable-uploads/c9b0f6e1-d4ca-40d7-9eb0-5706cf70f2c1.png" 
                alt="ProSignature Logo" 
                className="h-12 object-contain"
              />
            </div>
            <p className="text-gray-400 mb-8 leading-relaxed font-light">
              Transform your email signature into a smart branding engine with AI-powered analytics and real-time insights that drive unprecedented business growth.
            </p>
            <div className="flex space-x-4">
              {socialIcons.map((social, index) => (
                <a 
                  key={social.name} 
                  href={social.href} 
                  className="w-12 h-12 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center hover:from-cyan-500/40 hover:to-purple-500/40 transition-all duration-500 hover:scale-110 hover:-translate-y-1 border border-cyan-500/20 hover:border-cyan-400/40 backdrop-blur-sm" 
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                  aria-label={social.name}
                >
                  <svg className="w-5 h-5 text-gray-300 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    {social.icon === "linkedin" && (
                      <>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.5v-7a.75.75 0 00-.75-.75H3.75a.75.75 0 00-.75.75v14c0 .414.336.75.75.75h16.5a.75.75 0 00.75-.75V13.5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12l5.25-3L15 12l5.25-3M4.5 19.5h15M4.5 7.5h15" />
                      </>
                    )}
                    {social.icon === "twitter" && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    )}
                    {social.icon === "instagram" && (
                      <>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 3H7C4.791 3 3 4.791 3 7v10c0 2.209 1.791 4 4 4h10c2.209 0 4-1.791 4-4V7c0-2.209-1.791-4-4-4z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.25 5.5a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                      </>
                    )}
                    {social.icon === "github" && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    )}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Enhanced Quick Links */}
          <div>
            <h3 className="text-xl font-light mb-8 text-gradient-primary flex items-center animate-section-heading">
              <span className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mr-3 animate-pulse"></span>
              Quick Links
            </h3>
            <ul className="space-y-4">
              {quickLinks.map((link, index) => (
                <li key={index} className="transform transition-all duration-300 hover:translate-x-2">
                  <Link 
                    to={link.href} 
                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 font-light flex items-center group"
                  >
                    <span className="w-1 h-1 bg-cyan-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
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
                <a 
                  href="mailto:support@prosignature.lovable.app" 
                  className="text-white hover:text-cyan-400 transition-colors duration-300 group-hover:translate-x-1 inline-block transform"
                >
                  support@prosignature.lovable.app
                </a>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-2 font-light">Location</div>
                <span className="text-white font-light">India (expanding globally)</span>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-2 font-light">Support</div>
                <span className="text-white font-light">24/7 Customer Support</span>
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
              {legal.map((link, index) => (
                <li key={index} className="transform transition-all duration-300 hover:translate-x-2">
                  <a 
                    href={link.href} 
                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 font-light flex items-center group"
                  >
                    <span className="w-1 h-1 bg-cyan-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {link.name}
                  </a>
                </li>
              ))}
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
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                100% Secure
              </span>
              <span className="flex items-center hover:text-cyan-400 transition-colors duration-300">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9 3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                GDPR Compliant
              </span>
              <span className="flex items-center hover:text-cyan-400 transition-colors duration-300">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                99.9% Uptime
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Scroll to Top Button */}
      <button 
        onClick={() => window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })} 
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center hover:from-cyan-400 hover:to-purple-400 transition-all duration-500 shadow-2xl hover:shadow-cyan-500/50 z-50 group hover:scale-110 hover:-translate-y-1" 
        aria-label="Scroll to top"
      >
        <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  );
};

export default Footer;
