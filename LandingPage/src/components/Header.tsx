import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import * as Config from "../Utils/config";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Signatures", path: "/signatures" },
    { name: "Tutorial", path: "/tutorial" },
    { name: "Blog", path: "/blog" },
    { name: "Insights", path: "/insights" },
    { name: "Contact", path: "/contact" }
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);


  
  const handleLogin = ()=>{
    window.location.href = `${Config.FRONTEND_URL}login`;
  }

  const handleSignup = ()=>{
    window.location.href = `${Config.FRONTEND_URL}signup`;
  }
  return (
    <>
      <header className={`fixed top-0 w-full z-50 ${isScrolled ? 'bg-black/90' : 'bg-black/60'} backdrop-blur-2xl border-b border-cyan-500/20 shadow-2xl shadow-cyan-500/10 transition-all duration-500`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Enhanced Logo */}
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-all duration-500 group relative z-50">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                <img 
                  src="/lovable-uploads/48b9e8e8-9c85-447a-9f69-3e3a7e61e649.png" 
                  alt="ProSignature Logo" 
                  className="h-12 w-auto transition-transform duration-500 group-hover:scale-110 relative z-10" 
                />
              </div>
            </Link>

            {/* Enhanced Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map(item => (
                <Link 
                  key={item.name} 
                  to={item.path} 
                  className={`text-sm font-light transition-all duration-500 hover:text-cyan-400 hover:scale-110 relative group transform-gpu ${isActive(item.path) ? "text-cyan-400" : "text-gray-300"}`}
                >
                  <span className="relative z-10">{item.name}</span>
                  {isActive(item.path) && (
                    <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-scale-in"></div>
                  )}
                  <div className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full transition-all duration-500 group-hover:w-full"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></div>
                </Link>
              ))}
            </nav>

            {/* Enhanced Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <Button 
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-4 py-2 from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1"
                onClick={handleLogin}
                style={{background: "none" , border: "1px solid #f3ebeb"}}
              >
                 Login 
              </Button>
              <Button 
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1"
                onClick={handleSignup}
              >
                Sign Up Free
              </Button>
            </div>

            {/* Enhanced Mobile Menu Button */}
            <button 
              className="lg:hidden text-white p-3 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-purple-500/20 rounded-xl transition-all duration-500 z-50 relative group" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`bg-white block transition-all duration-500 ease-out h-0.5 w-6 rounded-sm ${isMenuOpen ? "rotate-45 translate-y-1.5" : "-translate-y-1.5"}`}></span>
                <span className={`bg-white block transition-all duration-500 ease-out h-0.5 w-6 rounded-sm my-1 ${isMenuOpen ? "opacity-0" : "opacity-100"}`}></span>
                <span className={`bg-white block transition-all duration-500 ease-out h-0.5 w-6 rounded-sm ${isMenuOpen ? "-rotate-45 -translate-y-1.5" : "translate-y-1.5"}`}></span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Enhanced Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Background overlay */}
          <div 
            className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu content */}
          <div className="relative flex flex-col h-full pt-20">
            <nav className="flex-1 px-6 py-8 overflow-y-auto">
              <div className="flex flex-col space-y-6">
                {navItems.map((item, index) => (
                  <Link 
                    key={item.name} 
                    to={item.path} 
                    className={`text-2xl font-light transition-all duration-500 hover:text-cyan-400 hover:translate-x-4 transform-gpu ${isActive(item.path) ? "text-cyan-400" : "text-gray-300"} animate-slide-in-left`} 
                    style={{
                      animationDelay: `${index * 100}ms`
                    }} 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Mobile Auth Buttons */}
                <div className="border-t border-cyan-500/20 pt-8 space-y-4 mt-8">
                  <Button 
                    variant="ghost" 
                    asChild
                    className="w-full text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-purple-500/20 text-lg py-4 justify-center"
                  >
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
                  </Button>
                  <Button 
                    asChild
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white text-lg py-4 justify-center"
                  >
                    <Link to="/signup" onClick={() => setIsMenuOpen(false)}>Sign Up Free</Link>
                  </Button>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
