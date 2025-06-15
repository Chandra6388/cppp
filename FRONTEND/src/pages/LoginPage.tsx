
import { useState, lazy, useEffect, Suspense, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, Star, Users, Shield, Loader2 } from "lucide-react";
import { UserLogin } from '@/service/auth/auth.service'
import { sweetAlert } from "../../Utils/CommonFunctions"
import { Link, useNavigate } from "react-router-dom";
import { Errors } from "../../Utils/UserInterface"
const GoogleLogin = lazy(() => import('@react-oauth/google').then(mod => ({ default: mod.GoogleLogin })));
import { googleLogin } from '@/service/auth/auth.service';
import { useToast } from "@/hooks/use-toast";


const Login = () => {
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate()
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Errors>({})
  const [formData, setFromData] = useState({ email: "", password: "" })
  const [googleLoginloading, setGoogleLoginLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      setGoogleReady(true);
    }
  }, []);

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
            `Welcome back, ${res.user?.FirstName} ${res.user?.LastName}!`,
            "success"
          );
          setIsLoading(false);
          setTimeout(() => {

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
    setFromData((prev) => ({
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
      if (!validate(key, formData[key])) {
        isValid = false;
      }
    }

    return isValid;
  };

  const handleLoginClick = () => {
    setGoogleLoginLoading(true);
    const button = googleButtonRef.current?.querySelector("div[role='button']");
    if (button) {
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      setGoogleLoginLoading(false);
    } else {
      setGoogleLoginLoading(false);
      toast({
        title: "Login Error",
        description: "Google button not ready. Try again in a moment.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };


  const loginWithGoogle = async (googleToken: string) => {
    const req = { token: googleToken };
    try {
      const res = await googleLogin(req);
      if (res.status) {
        toast({
          title: "Success",
          description: res?.message,
          variant: "success",
          duration: 3000,
        });
        localStorage.setItem('user', JSON.stringify(res.data));
        localStorage.setItem('token', JSON.stringify(res.logintoken));
        navigate('/user/dashboard');
      } else {
        toast({
          title: "Error",
          description: res?.message,
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Google Login Failed",
        description: "Unexpected error. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <div className="w-full max-w-4xl bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex min-h-[600px]">
          <div className="hidden md:flex md:w-2/5 relative bg-gradient-to-br from-cyan-900/50 via-purple-900/50 to-indigo-900/50">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20"></div>
            <div className="absolute top-16 left-16 w-24 h-24 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-full blur-xl animate-float"></div>
            <div className="absolute bottom-16 right-16 w-20 h-20 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
            <div className="relative z-10 flex flex-col justify-center p-8 text-white">
              <div className="inline-flex items-center px-3 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6 border border-cyan-500/20 self-start">
                <Sparkles className="w-4 h-4 mr-2 text-cyan-300" />
                <span className="text-sm font-light">ProSignature Platform</span>
              </div>
              <h1 className="text-3xl font-light mb-4 leading-tight">
                Welcome back to your
                <span className="block text-cyan-300 font-normal text-2xl mt-1">professional signature suite</span>
              </h1>

              <p className="text-gray-300 font-light mb-6 leading-relaxed text-sm">
                Access your dashboard, manage your signatures, and boost your professional presence.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-3" />
                  <span className="text-gray-300 text-sm">Premium signature templates</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 text-cyan-400 mr-3" />
                  <span className="text-gray-300 text-sm">Team collaboration tools</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 text-emerald-400 mr-3" />
                  <span className="text-gray-300 text-sm">Advanced security & analytics</span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-3/5 flex items-center justify-center p-8">
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-xl border border-cyan-500/20 mb-6 text-sm font-light text-cyan-300">
                  <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                  Welcome Back
                </div>
                <h2 className="text-3xl font-light text-white mb-2">Sign In</h2>
                <p className="text-gray-400 font-light">Access your ProSignature account</p>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300 font-light">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChangeInput}
                      className="pl-12 bg-black/20 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20 transition-all duration-300 hover:bg-black/30 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20"
                    />
                    {error?.email && <p className="text-red-500 text-sm mt-2">{error.email}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300 font-light">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChangeInput}
                      className="pl-12 pr-12 bg-black/20 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20 transition-all duration-300 hover:bg-black/30 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20"
                    />
                    {error?.password && <p className="text-red-500 text-sm mt-2">{error.password}</p>}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-end">
                 
                  <Link
                    to="/forgot-password"
                    className="text-sm text-cyan-300 hover:text-cyan-200 transition-colors font-light"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Button
                  disabled={isLoading}
                  onClick={loginWithEmail}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-light text-lg py-4 rounded-2xl group hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 border-0"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </Button>
              </div>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#112F59]"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-[#001430] text-[#8A99B4]">Or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="darkOutline"
                className="w-full"
                onClick={handleLoginClick}
                disabled={googleLoginloading}
              >
                {googleLoginloading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Sign in with Google
                  </>
                )}
              </Button>

              {googleReady && (
                <Suspense fallback={null}>
                  <div ref={googleButtonRef} style={{ display: "none" }}>
                    <GoogleLogin
                      onSuccess={(credentialResponse) => {
                        const token = credentialResponse.credential;
                        if (token) {
                          loginWithGoogle(token);
                        } else {
                          toast({
                            title: "Google Login Failed",
                            description: "Token not received. Try again.",
                            variant: "destructive",
                          });
                        }
                      }}
                      onError={() => {
                        toast({
                          title: "Google Login Failed",
                          description: "Something went wrong. Please try again.",
                          variant: "destructive",
                        });
                      }}
                    />
                  </div>
                </Suspense>
              )}
              <div className="mt-8 text-center">
                <p className="text-gray-400 font-light">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-cyan-300 hover:text-cyan-200 transition-colors font-normal"
                  >
                    Sign up for free
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
