
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { LogIn, Loader2, Lock } from "lucide-react";
import { resetPassword } from '@/service/auth/auth.service'

// Define form schema
const loginFormSchema = z.object({
    newPassword: z.string().min(6, { message: "Password must we at leat 6 digit" }),
    confirmPassword: z.string().min(6, { message: "Password must we at leat 6 digit" }),
});


type LoginFormValues = z.infer<typeof loginFormSchema>;

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();
    const token = JSON.parse(localStorage.getItem("token") || "null");


    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            confirmPassword: "",
            newPassword: "",
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
        setLoading(true);
        const req = { newPassword: data.confirmPassword, token: token };
        if (data.confirmPassword !== data.newPassword) {
            toast({
                title: 'Error',
                description: 'New Password and Confirm Password must be the same',
                variant: "warning",
                duration: 1000,
            });
            setLoading(false);
            return;
        }

        try {
            const res = await resetPassword(req);
            toast({
                title: res?.status ? 'success' : "error",
                description: res?.status ?
                    'Password reset successfully' :
                    'Failed to reset password. Please try again.',
                variant: res?.status ? "success" : "destructive",
                duration: 1000,
            });
            if (res?.status) {
                setLoading(false);
                navigate('/login')
            } else {
                setLoading(false);
            }

        } catch (err) {
            console.log("Error in Reset Password API", err);
            toast({
                title: 'Error',
                description: 'An unexpected error occurred. Please try again.',
                variant: "destructive",
                duration: 1000,
            });
        }
    };

    return (
        <div className="flex min-h-screen bg-[#001430] font-sans overflow-hidden">
            <div className="flex flex-col md:flex-row w-full">
                {/* Left panel - Login Form */}
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
                                className="h-10 mx-auto mb-6 animate-logo-reveal"
                            />
                            <h1 className="text-3xl font-bold text-white tracking-tight">Reset Password</h1>
                            <p className="text-[#8A99B4] mt-2">Almost there! Create a new password to access your account.</p>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="newPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white">New Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8A99B4] h-5 w-5" />
                                                    <Input
                                                        type="password"
                                                        placeholder="Enter new password"
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
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white">Confirm Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8A99B4] h-5 w-5" />
                                                    <Input
                                                        type="password"
                                                        placeholder="Enter confirm password"
                                                        className="bg-[#031123] border-[#112F59] text-white pl-10"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
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
                                            <LogIn className="mr-2 h-4 w-4" />
                                            Reset Password
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Form>
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
            </div>
        </div>
    );
};

export default LoginPage;