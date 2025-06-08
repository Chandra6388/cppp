import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles, X, Phone } from "lucide-react";
import { sweetAlert } from "../../../Utils/CommonFunctions"
import { UserLogin } from '@/service/auth/auth.service'
import { Link, useNavigate } from "react-router-dom";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'signin' | 'signup';
  onSwitchMode: (mode: 'signin' | 'signup') => void;
}

interface Errors {
  fullname?: string;
  email?: string,
  password?: string;
  phone?: string

}
const AuthDialog = ({
  isOpen,
  onClose,
  mode,
  onSwitchMode
}: AuthDialogProps) => {
  const navigate = useNavigate()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ fullname: "", email: "", password: "", phone: "" })
  const [error, setError] = useState<Errors>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(`${mode} attempt:`, {
      email,
      password,
      ...(mode === 'signup' && {
        name
      })
    });
    setIsLoading(false);
    onClose();
  };
  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setShowPassword(false);
  };
  const handleClose = () => {
    resetForm();
    onClose();
  };
  const handleSwitchMode = (newMode: 'signin' | 'signup') => {
    resetForm();
    onSwitchMode(newMode);
  };

  const getRedirectUrl = (role: string, token: string): string => {
    const basePath =
      role === "ADMIN"
        ? "#/admin/dashboard"
        : role === "EMPLOYEE"
          ? "#/employee/dashboard"
          : "#/user/dashboard";

    return `http://localhost:8080/${basePath}?token=${encodeURIComponent(token)}`;
  };


  const getTokenExpiryInSeconds = (token: string): number => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const exp = payload.exp; // expiry in seconds (Unix timestamp)
      const now = Math.floor(Date.now() / 1000); // current time in seconds
      return exp - now; // how many seconds left
    } catch (e) {
      return 0; // fallback: expire immediately
    }
  };




  const loginWithEmail = async (): Promise<void> => {
    const isValidate = validateAllFields(1)
    if (!isValidate) return
    setIsLoading(true);
    const req = { Email: formData?.email, Password: formData?.password }
    await UserLogin(req)
      .then((res) => {
        if (res?.status) {
          if (res?.user?.Is_AdminDeleted) {
            sweetAlert(
              "Account Deleted",
              "Your account has been permanently deleted by the admin. If you have any questions, please contact our support team at support@gmail.com.",
              "error",
              4000
            );
            setIsLoading(false);
            return navigate('/login');
          }

          if (res?.user?.Is_Active === false) {
            sweetAlert(
              "Account Deactivated",
              "Your account has been temporarily deactivated by the admin. For assistance, please reach out to our support team at support@gmail.com.",
              "error",
              4000
            );
            setIsLoading(false);
            return navigate('/login');
          }

          if (res?.user?.isGoogleLogin) {
            sweetAlert(
              "Google Login Detected",
              "You have logged in using Google. Please use the Google login option for future logins.",
              "warning",
              4000
            );
            setIsLoading(false);
            return navigate('/login');
          }
 
          localStorage.setItem('user', JSON.stringify(res.user));
          localStorage.setItem('token', JSON.stringify(res.token));

          sweetAlert(
            "Login Successful",
            `Welcome back, ${res.user?.Username}!`,
            "success"
          );
          setIsLoading(false);
          setTimeout(() => {
            onClose()
            navigate(res.Role == "ADMIN" ? '/admin/dashboard' : res.Role == "EMPLOYEE" ? '/employee/dashboard' : '/user/dashboard');
          }, 1000)
        }
        else {
          setIsLoading(false);
          localStorage.removeItem('user');
          sweetAlert(
            "Login Failed",
            res.message || "Invalid email or password. Please try again.",
            "error"
          );
        }
      })
      .catch((err) => {
        console.log("Error in login api", err)
      })
  };


  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    validate(name, value)
  };

  const validate = (name: string, value: string) => {
    const newErrors = { ...error };
    if (!value) {
      newErrors[name] = `${name} is required`;
    }
    else {
      delete newErrors[name];
      setError((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[name];
        return updatedErrors;
      });
    }
    if (Object.keys(newErrors).length !== 0) {
      setError((prevErrors) => ({
        ...prevErrors,
        ...newErrors,
      }));
    }
    return Object.keys(newErrors).length === 0;
  };

  const validateAllFields = (type: number): boolean => {
    let isValid = true;

    for (const key in formData) {
      // In login mode (type === 1), skip fullname and phone
      if (type === 1 && (key === "fullname" || key === "phone")) {
        continue;
      }

      if (!validate(key, formData[key])) {
        isValid = false;
      }
    }

    return isValid;
  };



  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl h-screen sm:h-[700px] p-0 border-0 bg-transparent overflow-hidden fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-full sm:w-auto">
        <div className="flex h-full relative flex-col sm:flex-row">
          {/* Left side - Image/Background - Hidden on mobile */}
          <div className="hidden sm:flex md:w-1/2 relative overflow-hidden rounded-l-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-blue-500/20 backdrop-blur-sm"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%222%22/%3E%3Ccircle%20cx%3D%2227%22%20cy%3D%227%22%20r%3D%222%22/%3E%3Ccircle%20cx%3D%2247%22%20cy%3D%227%22%20r%3D%222%22/%3E%3Ccircle%20cx%3D%227%22%20cy%3D%2227%22%20r%3D%222%22/%3E%3Ccircle%20cx%3D%2227%22%20cy%3D%2227%22%20r%3D%222%22/%3E%3Ccircle%20cx%3D%2247%22%20cy%3D%2227%22%20r%3D%222%22/%3E%3Ccircle%20cx%3D%227%22%20cy%3D%2247%22%20r%3D%222%22/%3E%3Ccircle%20cx%3D%2227%22%20cy%3D%2247%22%20r%3D%222%22/%3E%3Ccircle%20cx%3D%2247%22%20cy%3D%2247%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
            <div className="relative z-10 flex flex-col justify-center items-center text-center p-12 text-white">
              <div className="w-20 h-20 mb-8 rounded-3xl bg-gradient-to-br from-cyan-500/30 to-purple-500/30 flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-10 h-10 animate-pulse" />
              </div>
              <h2 className="text-3xl font-light mb-4">
                {mode === 'signin' ? 'Welcome Back!' : 'Join Our Community'}
              </h2>
              <p className="text-cyan-200 font-light leading-relaxed">
                {mode === 'signin' ? 'Sign in to access your professional email signatures and analytics dashboard.' : 'Create an account to start building stunning email signatures that convert leads into customers.'}
              </p>
              <div className="mt-8 space-y-3">
                <div className="flex items-center text-sm text-cyan-300">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                  Professional templates
                </div>
                <div className="flex items-center text-sm text-cyan-300">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                  Advanced analytics
                </div>
                <div className="flex items-center text-sm text-cyan-300">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                  Team collaboration
                </div>
              </div>
            </div>
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-full blur-xl animate-float"></div>
            <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-xl animate-float" style={{
              animationDelay: '2s'
            }}></div>
          </div>

          {/* Right side - Form - Full width on mobile */}
          <div className="w-full sm:w-1/2 creative-card bg-black/95 backdrop-blur-2xl border border-cyan-500/20 rounded-3xl sm:rounded-r-3xl sm:rounded-l-none relative min-h-screen sm:min-h-0">
            {/* Close Button */}
            <button onClick={onClose} className="absolute right-6 top-6 z-50 text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 sm:p-8 pt-16 h-full flex flex-col justify-center overflow-y-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center px-6 py-3 rounded-full creative-card mb-6 text-sm font-light text-cyan-300 backdrop-blur-xl border border-cyan-500/20">
                  <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                  {mode === 'signin' ? 'Welcome Back' : 'Get Started'}
                </div>
                <h1 className="text-2xl sm:text-3xl font-light text-white mb-2">
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                </h1>
                <p className="text-gray-400 font-light text-sm sm:text-base">
                  {mode === 'signin' ? 'Access your ProSignature account' : 'Start creating professional signatures'}
                </p>
              </div>

              {/* Mobile benefits section - Only on mobile */}
              <div className="sm:hidden mb-8 space-y-3">
                {[
                  "Professional templates",
                  "Advanced analytics",
                  "Team collaboration"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center text-sm text-cyan-300">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                    {benefit}
                  </div>
                ))}
              </div>

              {/* Form */}
              <div onSubmit={handleSubmit} className="space-y-6">
                {mode === 'signup' && <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300 font-light">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input name="fullname" type="text" placeholder="Enter your full name" value={formData?.fullname} onChange={handleChangeInput} className="pl-12 bg-black/20 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20" />
                    {error?.fullname && <p className="text-red-500 text-sm mt-2">{error.fullname}</p>}

                  </div>

                </div>}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300 font-light">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input name="email" type="email" placeholder="Enter your email" value={formData?.email} onChange={handleChangeInput} className="pl-12 bg-black/20 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20" />
                    {error?.email && <p className="text-red-500 text-sm mt-2">{error.email}</p>}

                  </div>
                </div>
                {mode === 'signup' && <div className="space-y-2">
                  <Label className="text-gray-300 font-light">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input name="phone" type="text" placeholder="Enter your phone number" value={formData?.phone} onChange={handleChangeInput} className="pl-12 bg-black/20 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20" />
                    {error?.phone && <p className="text-red-500 text-sm mt-2">{error?.phone}</p>}

                  </div>
                </div>}

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300 font-light">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input name="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={formData.password} onChange={handleChangeInput} className="pl-12 pr-12 bg-black/20 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-300 transition-colors">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    {error?.password && <p className="text-red-500 text-sm mt-2">{error.password}</p>}
                  </div>
                </div>

                {mode === 'signin' && <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input id="remember" type="checkbox" className="w-4 h-4 text-cyan-400 bg-black/20 border-gray-600 rounded focus:ring-cyan-400/20" />
                    <Label htmlFor="remember" className="ml-2 text-sm text-gray-400 font-light">
                      Remember me
                    </Label>
                  </div>
                  <button type="button" className="text-sm text-cyan-300 hover:text-cyan-200 transition-colors font-light">
                    Forgot password?
                  </button>
                </div>}

                <Button
                  disabled={isLoading}
                  onClick={loginWithEmail}
                  className="w-full btn-dark-modern text-white font-light text-lg py-4 rounded-2xl group hover:scale-105 transition-all duration-300"
                >
                  {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <>
                    {mode === 'signin' ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </>}
                </Button>
              </div>

              {/* Footer */}
              <div className="mt-8 text-center">
                <p className="text-gray-400 font-light text-sm sm:text-base">
                  {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}{" "}
                  <button
                    onClick={() => onSwitchMode(mode === 'signin' ? 'signup' : 'signin')}
                    className="text-cyan-300 hover:text-cyan-200 transition-colors font-normal"
                  >
                    {mode === 'signin' ? 'Sign up for free' : 'Sign in'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
