
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Dashboard from "@/Admin/dashboard/Dashboard";
import SupportTicket from "@/Admin/Support/supportTicket";
import Broadcast from "@/Admin/broadcast/Broadcast";


 
import NotFound from "@/pages/NotFound";
import { AuthProvider } from "@/contexts/AuthContext";

const UserRoute = () => {
  const navigate = useNavigate();

  return (
    <AuthProvider navigate={navigate}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/support-tickets" element={<SupportTicket />} />
        <Route path="/broadcast" element={<Broadcast />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </AuthProvider>
  );
};



export default UserRoute;
