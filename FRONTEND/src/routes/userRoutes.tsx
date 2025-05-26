
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import SignatureEditorPageRedesigned from "@/pages/SignatureEditorPageRedesigned";
import CreateSignaturePage from "@/pages/CreateSignaturePage";
import SignaturesPage from "@/pages/SignaturesPage";
import NotificationsPage from "@/pages/NotificationsPage";
import AccountPage from "@/pages/AccountPage";
import SettingsPage from "@/pages/SettingsPage";
import SupportPage from "@/pages/SupportPage";
import TemplatesPage from "@/pages/TemplatesPage";
import TicketsPage from "@/pages/TicketsPage";
import SubscriptionPage from "@/pages/SubscriptionPage";
import NotFound from "@/pages/NotFound";
import { AuthProvider } from "@/contexts/AuthContext";

const UserRoute = () => {
  const navigate = useNavigate();

  return (
    <AuthProvider navigate={navigate}>
      <Routes>
        <Route path="/dashboard" element={<Index />} />
        <Route path="/editor" element={<SignatureEditorPageRedesigned />} />
        <Route path="/create-signature" element={<CreateSignaturePage />} />
        <Route path="/signatures" element={<SignaturesPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/tickets" element={<TicketsPage />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </AuthProvider>
  );
};



export default UserRoute;
