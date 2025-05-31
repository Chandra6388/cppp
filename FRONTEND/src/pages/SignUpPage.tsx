
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { LogIn, Mail, Lock, User, Loader2, Phone } from "lucide-react";
import { SEO } from '../../Utils/Helmet'


const loginFormSchema = z.object({
  firstName: z.string().min(1, { message: "Please enter first Name" }),
  userName: z.string().min(1, { message: "Please enter user Name" }),
  lastName: z.string().min(1, { message: "Please enter last Name" }),
  phoneNumber: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .max(10, { message: "Phone number must be at most 10 digits" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const Signup = () => {
  const { loading, register } = useAuth();
  const navigate = useNavigate();

  // Form definition
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      firstName: "",
      userName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      password: "",
    },
  });


  type FieldType = {
    label: string;
    type: string;
    name: keyof LoginFormValues;
    icons: React.ElementType;
  };

  const onSubmit = async (data: LoginFormValues) => {

    try {
      await register({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        userName: data.userName
      });
    } catch (error) {
      console.error("Login error:", error);
    }
  };



  const fields: FieldType[] = [
    {
      label: "First Name",
      type: 'text',
      name: "firstName",
      icons: User
    },
    {
      label: "Last Name",
      type: 'text',
      name: "lastName",
      icons: User
    },
    {
      label: "User Name",
      name: "userName",
      type: 'text',
      icons: User
    },
    {
      label: "Phone Number",
      name: "phoneNumber",
      type: 'number',
      icons: Phone
    },
    {
      label: "Email",
      name: "email",
      type: 'text',
      icons: Mail
    },
    {
      label: "Password",
      name: "password",
      type: 'password',
      icons: Lock
    }
  ]
  const endpoint = window.location.hash.replace(/^#/, '').split('?')[0];

  return (
    <>
      <SEO title={endpoint.split('/').pop()} description={"Register"} />
      <div className="flex min-h-screen bg-[#001430] font-sans overflow-hidden">
        <div className="flex flex-col md:flex-row w-full">
          <motion.div
            className="w-full md:w-3/5 p-8 flex flex-col justify-center items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-full max-w-[50rem] space-y-8">
              <div className="text-center mb-10">
                <img
                  src="/lovable-uploads/8618aaab-fb95-49b4-83c0-5a18aef975ae.png"
                  alt="ProSignature Logo"
                  className="h-28 mx-auto mb-6 animate-logo-reveal"
                />
                <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back</h1>
                <p className="text-[#8A99B4] mt-2">Sign Up to continue to your account</p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {fields?.map((items) => (
                      <div key={items.name}>
                        <FormField
                          control={form.control}
                          name={items.name}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">{items.label}</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <items.icons className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8A99B4] h-5 w-5" />
                                  <Input
                                    type={items.type}
                                    placeholder={`Enter your ${items.label.toLowerCase()}`}
                                    className="bg-[#031123] border-[#112F59] text-white pl-10"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                  </div>
                  <Button
                    type="submit"
                    variant="teal"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign Up
                      </>
                    )}
                  </Button>
                </form>
              </Form>


              <div className="text-center mt-8">
                <p className="text-[#8A99B4] text-sm">
                  Already have an account?{" "}
                  <button
                    className="text-[#01C8A9] hover:underline font-medium"
                    onClick={() => navigate("/login")}
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="hidden md:flex md:w-2/5 bg-[#031123] p-8 items-center justify-center"
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
    </>
  );
};

export default Signup;
