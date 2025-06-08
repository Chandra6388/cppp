import { HashRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import LoginPage from "@/pages/LoginPage";
import SignUpPage from "@/pages/SignUpPage";
import NotFound from "@/pages/NotFound";
import { AuthProvider } from "@/contexts/AuthContext";
import AdminRoutes from "@/routes/adminRoutes";
import UserRoutes from "@/routes/userRoutes";
import EmployeeRoute from "@/routes/employeeRoutes";
import ForgotPass from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import { jwtDecode } from "jwt-decode";

const AppWithAuth = () => {
  const navigate = useNavigate();
  const endpoint = window.location.hash.replace(/^#/, '').split('?')[0];
  const token = JSON.parse(localStorage.getItem("token")) || null; 
  const UserDetails = JSON.parse(localStorage.getItem("user")) || null;
  const Role = UserDetails?.Role;
  const isTokenValid = () => {
    try {
      if (!token) return false;
      const decoded = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp >= currentTime;
    } catch (err) {
      console.error("Invalid token:", err);
      return false;
    }
  };

  useEffect(() => {
    const validToken = isTokenValid();

    if (endpoint === "/signup") {
      navigate("/signup");
      return;
    }

    if (endpoint === "/") {
      navigate("/login");
      return;
    }

    if (endpoint === "/forgot-password") {
      navigate("/forgot-password");
      return;
    }

    if (endpoint === "/reset-password") {
      const tokenData = localStorage.getItem("ResetPasswordtoken");
      if (!tokenData) {
        navigate("/login");
        return;
      }
      try {
        const decoded = jwtDecode(tokenData);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp < currentTime) {
          navigate("/login");
        }
      } catch (error) {
        console.error("Invalid token format.", error);
        navigate("/login");
      }
      return;
    }

    if (!UserDetails || !Role || UserDetails === "null" || Role === "null" || !validToken) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
      return;
    }

    switch (Role) {
      case "ADMIN":
        if (endpoint === "/login" || endpoint === "/" || !endpoint.startsWith("/admin")) {
          navigate("/admin/dashboard");
        }
        break;
      case "USER":
        if (endpoint === "/login" || endpoint === "/" || !endpoint.startsWith("/user")) {
          navigate("/user/dashboard");
        }
        break;
      case "EMPLOYEE":
        if (endpoint === "/login" || endpoint === "/" || !endpoint.startsWith("/employee")) {
          navigate("/employee/dashboard");
        }
        break;
      default:
        navigate("/login");
        break;
    }

  }, [navigate, endpoint]);


  return (
    <AuthProvider navigate={navigate}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPass />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin/*" element={Role === "ADMIN" ? <AdminRoutes /> : <LoginPage />} />
        <Route path="/user/*" element={Role === "USER" ? <UserRoutes /> : <LoginPage />} />
        <Route path="/employee/*" element={Role === "EMPLOYEE" ? <EmployeeRoute /> : <LoginPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </AuthProvider>
  );
};

function App() {
  return (
    <HashRouter>
      <AppWithAuth />
    </HashRouter>
  );
}

export default App;




