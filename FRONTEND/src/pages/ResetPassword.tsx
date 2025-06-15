import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { sweetAlert } from "../../Utils/CommonFunctions";
import { resetPassword } from "@/service/auth/auth.service";
import { Errors } from "../../Utils/UserInterface";
import { Shield, Lock, ArrowLeft, CheckCircle } from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ newPassword: "", confirmPassword: "" });
  const [error, setError] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validate(name, value);
  };

  const validate = (name: string, value: string) => {
    const updatedErrors = { ...error };
    if (!value) {
      updatedErrors[name] = `${name === "newPassword" ? "New password" : "Confirm password"} is required.`;
    } else if (name === "newPassword" && value.length < 6) {
      updatedErrors[name] = "Password must be at least 6 characters.";
    } else {
      delete updatedErrors[name];
    }
    setError(updatedErrors);
  };

  const onSubmit = async () => {
    const { newPassword, confirmPassword } = formData;


    console.log("formData", formData)

    if (!newPassword || !confirmPassword) {
      setError({
        newPassword: !newPassword ? "New password is required." : "",
        confirmPassword: !confirmPassword ? "Confirm password is required." : "",
      });
      return;
    }

    if (newPassword.length < 6) {
      setError({ newPassword: "Password must be at least 6 characters." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setError({ confirmPassword: "Passwords do not match." });
      return;
    }

    setIsLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem("ResetPasswordtoken"));
      const res = await resetPassword({ newPassword: newPassword, token: token });
      sweetAlert(
        res?.status ? "Success" : "Error",
        res?.status
          ? "Your password has been successfully reset."
          : "Failed to reset password. Please try again.",
        res?.status ? "success" : "error"
      );

      if (res?.status) {
        localStorage.removeItem("ResetPasswordtoken");
        setSuccess(true);
        setTimeout(() => navigate("/login"), 3000);
      }
    } catch (err) {
      console.error(err);
      sweetAlert("Oops!", "Something went wrong. Please try again later.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <div className="w-full max-w-4xl bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row min-h-[600px]">
          {/* Left Panel */}
          <div className="hidden md:flex md:w-2/5 flex-col justify-center px-10 py-8 bg-gradient-to-br from-purple-800 to-indigo-900 text-white">
            <div className="mb-4 inline-flex items-center px-4 py-2 bg-white/10 rounded-full backdrop-blur">
              <Shield className="w-4 h-4 mr-2 text-purple-300" />
              <span className="text-sm font-light">Secure Reset</span>
            </div>
            <h2 className="text-3xl font-light">
              Reset your password
              <span className="block text-purple-300 font-normal text-2xl mt-1">quickly & securely</span>
            </h2>
            <p className="text-gray-300 text-sm font-light mt-4">
              Create a new password to regain access to your account. Our secure system ensures your data is protected at every step.
            </p>
            <div className="mt-8 space-y-3">
              <p className="flex items-center text-sm text-gray-300">
                <span className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center mr-3 text-purple-300 text-xs">1</span>
                Enter new password
              </p>
              <p className="flex items-center text-sm text-gray-300">
                <span className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center mr-3 text-purple-300 text-xs">2</span>
                Confirm and submit
              </p>
              <p className="flex items-center text-sm text-gray-300">
                <span className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center mr-3 text-purple-300 text-xs">3</span>
                Login securely
              </p>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-full md:w-3/5 flex items-center justify-center p-10 bg-black/80">
            {!success ? (
              <div className="w-full max-w-md">
                <Link to="/login" className="flex items-center mb-6 text-sm text-gray-400 hover:text-purple-300">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to Sign In
                </Link>
                <h2 className="text-3xl font-light text-white mb-2 text-center">Reset Password</h2>
                <p className="text-sm text-gray-400 mb-6 text-center">Enter and confirm your new password below.</p>

                <div className="space-y-5">
                  <div>
                    <Label htmlFor="newPassword" className="text-gray-300 font-light">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <Input
                        name="newPassword"
                        type="password"
                        placeholder="Enter new password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="pl-12 bg-black/20 border-gray-600 text-white"
                      />
                      {error?.newPassword && <p className="text-red-500 text-sm mt-1">{error.newPassword}</p>}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword" className="text-gray-300 font-light">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <Input
                        name="confirmPassword"
                        type="password"
                        placeholder="Re-enter password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="pl-12 bg-black/20 border-gray-600 text-white"
                      />
                      {error?.confirmPassword && <p className="text-red-500 text-sm mt-1">{error.confirmPassword}</p>}
                    </div>
                  </div>

                  <Button
                    onClick={onSubmit}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white py-3 rounded-xl text-base"
                  >
                    {isLoading ? "Resetting..." : "Reset Password"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center w-full max-w-md">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-emerald-400 animate-pulse" />
                  </div>
                </div>
                <h2 className="text-2xl font-light text-white mb-2">Password Reset Successful</h2>
                <p className="text-gray-400 text-sm">Redirecting you to login page...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
