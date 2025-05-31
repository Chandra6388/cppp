
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Dashboard from "@/Employee/dashboard/dashboard";
import SupportTicket from "@/Employee/Support/supportTicket";


import NotFound from "@/pages/NotFound";
import { AuthProvider } from "@/contexts/AuthContext";

const EmployeeRoute = () => {
  const navigate = useNavigate();
  return (
    <AuthProvider navigate={navigate}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tickets" element={<SupportTicket />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </AuthProvider>
  );
};



export default EmployeeRoute;
