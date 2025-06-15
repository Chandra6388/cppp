
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from '@/service/auth/auth.service'
import { Mail, ArrowRight, Sparkles, CheckCircle, ArrowLeft, Shield, Clock, RefreshCw } from "lucide-react";
import { sweetAlert } from "../../Utils/CommonFunctions"
import { Errors } from "../../Utils/UserInterface"


const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [error, setError] = useState<Errors>({})


    const onSubmit = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email?.trim()) {
            setError({ email: "Email is required" });
            return;
        }
        if (!emailRegex.test(email)) {
            setError({ email: "Please enter a valid email address" });
            return;
        }

        const req = { Email: email };
        setIsLoading(true);

        try {
            const res = await forgotPassword(req);

            sweetAlert(
                res?.status ? "Success" : "Error",
                res.message,
                res?.status ? "success" : "error"
            );

            if (res?.status) {
                setIsEmailSent(true)
                localStorage.setItem("ResetPasswordtoken", JSON.stringify(res?.token));
            }
        } catch (err) {
            console.error("Error in forgotPassword API", err);
            sweetAlert("Oops!", "An unexpected error occurred. Please try again in a moment.", "error");
        } finally {
            setIsLoading(false);
        }
    };


    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        setEmail(value)
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


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
            <div className="w-full max-w-4xl bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
                <div className="flex min-h-[600px]">
                    <div className="hidden md:flex md:w-2/5 relative bg-gradient-to-br from-purple-900/50 via-indigo-900/50 to-blue-900/50">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-indigo-500/20"></div>
                        <div className="absolute top-16 left-16 w-24 h-24 bg-gradient-to-br from-purple-500/30 to-indigo-500/30 rounded-full blur-xl animate-float"></div>
                        <div className="absolute bottom-16 right-16 w-20 h-20 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
                        <div className="relative z-10 flex flex-col justify-center p-8 text-white">
                            <div className="inline-flex items-center px-3 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6 border border-purple-500/20 self-start">
                                <Shield className="w-4 h-4 mr-2 text-purple-300" />
                                <span className="text-sm font-light">Secure Recovery</span>
                            </div>

                            <h1 className="text-3xl font-light mb-4 leading-tight">
                                Account recovery
                                <span className="block text-purple-300 font-normal text-2xl mt-1">made simple</span>
                                <span className="block text-2xl mt-1">and secure</span>
                            </h1>

                            <p className="text-gray-300 font-light mb-6 leading-relaxed text-sm">
                                We understand that forgetting passwords happens. Our secure recovery process will have you back to creating professional signatures in no time.
                            </p>
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center">
                                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20 mr-3">
                                        <span className="text-xs font-medium text-purple-300">1</span>
                                    </div>
                                    <span className="text-gray-300 text-sm">Enter your email address</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20 mr-3">
                                        <span className="text-xs font-medium text-purple-300">2</span>
                                    </div>
                                    <span className="text-gray-300 text-sm">Check your inbox for reset link</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20 mr-3">
                                        <span className="text-xs font-medium text-purple-300">3</span>
                                    </div>
                                    <span className="text-gray-300 text-sm">Create your new secure password</span>
                                </div>
                            </div>
                            <div className="p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                                <div className="flex items-center mb-2">
                                    <Shield className="w-4 h-4 text-emerald-400 mr-2" />
                                    <span className="text-sm font-medium text-white">Security Features</span>
                                </div>
                                <div className="space-y-1 text-xs text-gray-300">
                                    <div className="flex items-center">
                                        <Clock className="w-3 h-3 mr-2 text-gray-400" />
                                        <span>Reset links expire in 24 hours</span>
                                    </div>
                                    <div className="flex items-center">
                                        <RefreshCw className="w-3 h-3 mr-2 text-gray-400" />
                                        <span>One-time use for maximum security</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-3/5 flex items-center justify-center p-8">
                        <div className="w-full max-w-md">
                            <div className="mb-6">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center text-sm text-gray-400 hover:text-purple-300 transition-colors group"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                                    Back to Sign In
                                </Link>
                            </div>
                            {!isEmailSent ? (
                                <>
                                    <div className="text-center mb-8">
                                        <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 backdrop-blur-xl border border-purple-500/20 mb-6 text-sm font-light text-purple-300">
                                            <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                                            Password Recovery
                                        </div>
                                        <h2 className="text-3xl font-light text-white mb-2">Forgot Password?</h2>
                                        <p className="text-gray-400 font-light">No worries! Enter your email address and we'll send you a link to reset your password.</p>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-gray-300 font-light">Email Address</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                                <Input
                                                    name="email"
                                                    type="email"
                                                    placeholder="Enter your email address"
                                                    value={email}
                                                    onChange={handleChangeInput}
                                                    className="pl-12 bg-black/20 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-300 hover:bg-black/30 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20"
                                                />
                                                {error?.email && <p className="text-red-500 text-sm mt-2">{error?.email}</p>}
                                            </div>
                                        </div>
                                        <Button
                                            onClick={onSubmit}
                                            disabled={isLoading}
                                            className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-light text-lg py-4 rounded-2xl group hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 border-0"
                                        >
                                            {isLoading ? (
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            ) : (
                                                <>
                                                    Send Reset Link
                                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="text-center">
                                        <div className="inline-flex items-center justify-center w-20 h-20 mb-8 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-sm border border-emerald-500/20">
                                            <CheckCircle className="w-10 h-10 text-emerald-400 animate-pulse" />
                                        </div>
                                        <h2 className="text-3xl font-light text-white mb-4">Check Your Email</h2>
                                        <p className="text-gray-400 font-light mb-8">
                                            We've sent a password reset link to <span className="text-purple-300">{email}</span>.
                                            Please check your inbox and follow the instructions to reset your password.
                                        </p>
                                        <div className="space-y-4">
                                            <p className="text-sm text-gray-500 font-light">
                                                Didn't receive the email? Check your spam folder or try again.
                                            </p>
                                            <Button
                                                onClick={() => {
                                                    setIsEmailSent(false);
                                                    setEmail("");
                                                }}
                                                variant="outline"
                                                className="w-full border-gray-600 text-gray-300 bg-transparent hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-indigo-500/20 hover:border-purple-400/30 transition-all duration-300"
                                            >
                                                Try Different Email
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className="mt-8 text-center">
                                <p className="text-gray-400 font-light">
                                    Remember your password?{" "}
                                    <Link
                                        to="/login"
                                        className="text-purple-300 hover:text-purple-200 transition-colors font-normal"
                                    >
                                        Sign in
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

export default ForgotPassword;
