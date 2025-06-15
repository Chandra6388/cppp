
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Dashboard from "@/Admin/dashboard/Dashboard";
import SupportTicket from "@/Admin/Support/supportTicket";
import Broadcast from "@/Admin/broadcast/Broadcast";
import MyAccount from "@/pages/AccountPage"
import AllBlogs from "@/Admin/blogs/AllBlogs"
import AddBlogs from "@/Admin/blogs/addBlogs"
import NotFound from "@/pages/NotFound";
import { AuthProvider } from "@/contexts/AuthContext";
import BlogDetail from "@/Admin/blogs/blogDetails";
import EditBlogs from "@/Admin/blogs/editBlogs";
import ContactUs from "@/Admin/contactUs/userContact";



const UserRoute = () => {
  const navigate = useNavigate();

  return (
    <AuthProvider navigate={navigate}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/support-tickets" element={<SupportTicket />} />
        <Route path="/broadcast" element={<Broadcast />} />
        <Route path="/account" element={<MyAccount />} />
        <Route path="/add-blogs" element={<AddBlogs />} />
        <Route path="/all-blog" element={<AllBlogs />} />
        <Route path="/edit-blog" element={<EditBlogs />} />
        <Route path="/blog/details" element={<BlogDetail />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </AuthProvider>
  );
};



export default UserRoute;
