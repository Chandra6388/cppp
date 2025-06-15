import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRegister } from '@/service/auth/auth.service'
import { sweetAlert } from "../../Utils/CommonFunctions"
import { Link, useNavigate } from "react-router-dom";

import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Sparkles, CheckCircle, TrendingUp, Zap, Globe } from "lucide-react";
const SignUp = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
 
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    if (name === "phone") {
      // Allow only digits
      const numericValue = value.replace(/\D/g, "");
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
      return;
    }
  
    // For all other fields
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
 
  const register = async (): Promise<void> => {
    setIsLoading(true);
    if (formData.password.length < 6) {
      setIsLoading(false);
      sweetAlert("warning!", "Your password must be at least 6 characters long.", "warning");
      return 
    }

    if (formData?.confirmPassword != formData?.password) {
      setIsLoading(false);
      sweetAlert("Oops!", "Your password and confirmation do not match. Please re-enter both fields.", "warning");
      return
    }
    const req = {
      FirstName: formData.firstName,
      LastName: formData.lastName,
      Email: formData.email,
      PhoneNo: formData.phone,
      Password: formData.password
    }
    await UserRegister(req)
      .then((res) => {
        if (res?.status) {
          sweetAlert(
            "Registration successful",
            res.message,
            "success"
          );

          setIsLoading(false);
          navigate('/login');
        }
        else {
          setIsLoading(false);
          localStorage.removeItem('user');
          sweetAlert("error", res?.message, "error")
        }
      })
      .catch((err) => {
        setIsLoading(false);
        sweetAlert("Registration failed", err.message, "error");
      })
  };


  return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
    <div className="w-full max-w-5xl bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
      <div className="flex min-h-[700px]">
        {/* Left Side - Background Content */}
        <div className="hidden md:flex md:w-2/5 relative bg-gradient-to-br from-emerald-900/50 via-cyan-900/50 to-teal-900/50">
          {/* Background Image */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20"></div>

          {/* Floating Elements */}
          <div className="absolute top-16 left-16 w-24 h-24 bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 rounded-full blur-xl animate-float"></div>
          <div className="absolute bottom-16 right-16 w-20 h-20 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full blur-xl animate-float" style={{
            animationDelay: '2s'
          }}></div>

          {/* Content Overlay */}
          <div className="relative z-10 flex flex-col justify-center p-8 text-white">
            <div className="inline-flex items-center px-3 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6 border border-emerald-500/20 self-start">
              <Sparkles className="w-4 h-4 mr-2 text-emerald-300" />
              <span className="text-sm font-light">Join ProSignature</span>
            </div>

            <h1 className="text-3xl font-light mb-4 leading-tight">
              Start creating
              <span className="block text-emerald-300 font-normal text-2xl mt-1">professional signatures</span>
              <span className="block text-2xl mt-1">in minutes</span>
            </h1>

            <p className="text-gray-300 font-light mb-6 leading-relaxed text-sm">
              Join thousands of professionals who trust ProSignature to enhance their communications.
            </p>

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-xl font-bold text-emerald-300 mb-1">1.5K+</div>
                <div className="text-xs text-gray-400">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-cyan-300 mb-1">1M+</div>
                <div className="text-xs text-gray-400">Signatures Created</div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 text-emerald-400 mr-3" />
                <span className="text-gray-300 text-sm">Advanced analytics dashboard</span>
              </div>
              <div className="flex items-center">
                <Zap className="w-4 h-4 text-yellow-400 mr-3" />
                <span className="text-gray-300 text-sm">Lightning-fast creation</span>
              </div>
              <div className="flex items-center">
                <Globe className="w-4 h-4 text-cyan-400 mr-3" />
                <span className="text-gray-300 text-sm">Global team collaboration</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="w-full md:w-3/5 flex items-center justify-center p-6">
          <div className="w-full max-w-lg">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-xl border border-emerald-500/20 mb-6 text-sm font-light text-emerald-300">
                <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                Join ProSignature
              </div>
              <h2 className="text-2xl md:text-3xl font-light text-white mb-2">Create Account</h2>
              <p className="text-gray-400 font-light text-sm">Start creating professional signatures for free</p>
            </div>


            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-gray-300 font-light text-sm">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input id="firstName" name="firstName" type="text" placeholder="John" value={formData.firstName} onChange={handleInputChange} className="pl-10 h-10 bg-black/20 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-300 hover:bg-black/30 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/20 text-sm" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-gray-300 font-light text-sm">Last Name</Label>
                  <Input id="lastName" name="lastName" type="text" placeholder="Doe" value={formData.lastName} onChange={handleInputChange} className="h-10 bg-black/20 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-300 hover:bg-black/30 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/20 text-sm" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300 font-light text-sm">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input id="email" name="email" type="email" placeholder="john@company.com" value={formData.email} onChange={handleInputChange} className="pl-10 h-10 bg-black/20 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-300 hover:bg-black/30 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/20 text-sm" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-300 font-light text-sm">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 123-4567" value={formData.phone} onChange={handleInputChange} className="pl-10 h-10 bg-black/20 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-300 hover:bg-black/30 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/20 text-sm" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300 font-light text-sm">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Create a strong password" value={formData.password} onChange={handleInputChange} className="pl-10 pr-10 h-10 bg-black/20 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-300 hover:bg-black/30 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/20 text-sm" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-300 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-300 font-light text-sm">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleInputChange} className="pl-10 pr-10 h-10 bg-black/20 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-300 hover:bg-black/30 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/20 text-sm" required />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-300 transition-colors">
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-start">
                <input id="terms" type="checkbox" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)} className="w-4 h-4 text-emerald-400 bg-black/20 border-gray-600 rounded focus:ring-emerald-400/20 mt-1" />
                <Label htmlFor="terms" className="ml-3 text-xs text-gray-400 font-light leading-relaxed">
                  I agree to the{" "}
                  <Link to="/terms" className="text-emerald-300 hover:text-emerald-200 transition-colors">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-emerald-300 hover:text-emerald-200 transition-colors">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button onClick={register} disabled={isLoading || !agreedToTerms} className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-light text-base py-3 rounded-2xl group hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-0">
                {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <>
                  Create Account
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </>}
              </Button>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-gray-400 font-light text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-emerald-300 hover:text-emerald-200 transition-colors font-normal">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>;
};
export default SignUp;