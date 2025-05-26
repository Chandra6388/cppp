
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { LogIn, Mail, Lock, Loader2, X, User, Phone } from "lucide-react";
import { GoogleLogin } from '@react-oauth/google';
import { googleLogin, AddNewUser } from '@/service/auth/auth.service'
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { SEO } from '../../Utils/Helmet'

const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const loginWithGoogleSchema = z.object({
  password: z.string()
    .min(6, { message: "Password must be at least 6 characters" }),
  phone: z.string()
    .nonempty("Phone number is required")
    .regex(/^[0-9]{10}$/, "Phone number must be 10 digits"),
  userName: z.string()
    .nonempty("User name is required")
    .transform(val => val.trim()),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;
type LoginWithGoogleValues = z.infer<typeof loginWithGoogleSchema>;
const LoginPage = () => {
  const googleButtonRef = useRef(null);
  const { loginWithEmail } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false)
  const [googleLoginUserData, setGoogleLoginUserData] = useState(null)
  const form = useForm<LoginFormValues>({ resolver: zodResolver(loginFormSchema), defaultValues: { email: "", password: "", }, });
  const GoogleLoginform = useForm<LoginWithGoogleValues>({ resolver: zodResolver(loginWithGoogleSchema), defaultValues: { phone: "", password: "", userName: "" }, });
 
 
  const onSubmit = async (data: LoginFormValues) => {
    try {
      await loginWithEmail(data.email, data.password);
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  const loginWithGoogle = async (googleUser) => {
    const req = { token: googleUser }
    try {
      const res = await googleLogin(req)
      if (res.status) {
        if (!res?.isNewUser) {
          setShow(true)
          setGoogleLoginUserData(res.data)
        }
        else {
          localStorage.setItem('user', JSON.stringify(res.data));
          navigate('/user/dashboard');
        }
      }
      else {
        toast({
          title: "error",
          description: res?.message,
          variant: "destructive",
          duration: 1000,
        });
        console.log("error", res?.message)
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
  const handleSubmit = async (data: LoginWithGoogleValues) => {
    setLoading(true)
    const req = {
      FirstName: googleLoginUserData?.given_name,
      LastName: googleLoginUserData?.family_name,
      Username: data?.userName,
      profile_img: googleLoginUserData?.picture,
      Email: googleLoginUserData?.email,
      PhoneNo: data?.phone,
      Password: data?.password
    }
    await AddNewUser(req)
      .then((res: any) => {
        if (res.status) {
          toast({
            title: "success",
            description: res.message,
            variant: "success",
            duration: 1000,
          });
          setLoading(false);
          localStorage.setItem('user', JSON.stringify(res.data));
          navigate('/user/signatures');
        }
        else {
          setLoading(false);
          toast({
            title: "error",
            description: res.message,
            variant: "destructive",
            duration: 1000,
          });
        }
      })
  }
  const handleLoginClick = () => {
    const button = googleButtonRef.current?.querySelector("div[role='button']");
    if (button) {
      button.click();
    } else {
      toast({
        title: "Login Error",
        description: "Google button not ready. Try again in a moment.",
        variant: "destructive",
        duration: 1000,
      });
    }
  };
  const endpoint = window.location.hash.replace(/^#/, '').split('?')[0];
  const handleForgotPass = () => {
    navigate('/forgot-password')
  }
  return (
    <>
      <SEO title={endpoint.split('/').pop()} description={"Login"} />
      <div className="flex min-h-screen bg-[#001430] font-sans overflow-hidden">
        <div className="flex flex-col md:flex-row w-full">
          <motion.div
            className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-full max-w-md space-y-8">
              <div className="text-center mb-10">
                <img
                  src="/lovable-uploads/8618aaab-fb95-49b4-83c0-5a18aef975ae.png"
                  alt="ProSignature Logo"
                  className="h-30 mx-auto mb-6 animate-logo-reveal"
                />
                <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back</h1>
                <p className="text-[#8A99B4] mt-2">Sign in to continue to your account</p>
              </div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8A99B4] h-5 w-5" />
                            <Input
                              placeholder="Enter your email"
                              className="bg-[#031123] border-[#112F59] text-white pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8A99B4] h-5 w-5" />
                            <Input
                              type="password"
                              placeholder="Enter your password"
                              className="bg-[#031123] border-[#112F59] text-white pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      className="text-[#01C8A9] text-sm hover:underline focus:outline-none"
                      onClick={handleForgotPass}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <Button
                    type="submit"
                    variant="teal"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (<>  <Loader2 className="mr-2 h-4 w-4 animate-spin" />  Signing in...   </>) : (
                      <>  <LogIn className="mr-2 h-4 w-4" />Sign in</>)}
                  </Button>
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
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                        Sign in with Google
                      </>
                    )}
                  </Button>
                  <div ref={googleButtonRef} style={{ display: "none" }}>
                    <GoogleLogin
                      onSuccess={(credentialResponse) => {
                        const token = credentialResponse.credential;
                        console.log("ss", credentialResponse)
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
                </form>
              </Form>
              <div className="text-center mt-8">
                <p className="text-[#8A99B4] text-sm">
                  Don't have an account?{" "}
                  <button
                    className="text-[#01C8A9] hover:underline font-medium"
                    onClick={() => navigate("/signup")}
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="hidden md:flex md:w-1/2 bg-[#031123] p-8 items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="max-w-lg">
              <img
                src="/lovable-uploads/9e8729bb-ef12-4190-9169-b8a5c55be57c.png"
                alt="Email signature example"
                className="rounded-lg shadow-2xl animate-image-reveal"
              />
              <div className="mt-8 text-center">
                <h2 className="text-2xl font-bold text-white">Professional Email Signatures</h2>
                <p className="mt-2 text-[#8A99B4] max-w-md mx-auto">
                  Create stunning email signatures to make a lasting impression with your clients and contacts.
                </p>
              </div>
            </div>
          </motion.div>
        </div >
        <Dialog open={show} onOpenChange={() => setShow(!show)}>
          <DialogContent className="bg-[#001430] border-[#112F59] p-0 overflow-hidden max-w-md">
            <DialogHeader className="p-0">
              <div className="flex items-center justify-between w-full bg-[#001430] p-6 border-b border-[#112F59]">
                <h2 className="text-white text-xl font-medium">New User</h2>
                <button
                  onClick={() => setShow(false)}
                  className="text-white hover:text-gray-300"
                >
                  <X size={20} />
                </button>
              </div>
              <p style={{ fontWeight: "300", color: 'white', fontSize: "12px" }} className="text-center">You are new user Please enter some require details</p>
            </DialogHeader>
            <div className="p-6">
              <Form {...GoogleLoginform}>
                <form onSubmit={GoogleLoginform.handleSubmit(handleSubmit)} className="space-y-4">
                  <FormField
                    control={GoogleLoginform.control}
                    name="userName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">User Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8A99B4] h-5 w-5" />
                            <Input
                              placeholder="Enter user name"
                              className="bg-[#031123] border-[#112F59] text-white pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={GoogleLoginform.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Phone Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8A99B4] h-5 w-5" />
                            <Input
                              type="number"
                              placeholder="Enter phone number"
                              className="bg-[#031123] border-[#112F59] text-white pl-10"
                              {...field}
                            />
                         
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={GoogleLoginform.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8A99B4] h-5 w-5" />
                            <Input
                              type="password"
                              placeholder="Enter password"
                              className="bg-[#031123] border-[#112F59] text-white pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    variant="teal"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting request...
                      </>
                    ) : (
                      <>
                        Login
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3.33398 8H12.6673" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M8.33398 3.33337L13.0007 8.00004L8.33398 12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>
      </div >
    </>
  );
};
export default LoginPage;
