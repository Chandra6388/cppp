
import React, { useState, useRef, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/layout/Header";
import MainSidebar from "@/components/layout/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useResponsiveSidebar } from "@/hooks/use-responsive-sidebar";
import { useAuth } from "@/hooks/use-auth";
import MobileNavbar from "@/components/layout/MobileNavbar";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LogOut, Shield, CreditCard, User, Check, Pencil, X, Mail, Building, Calendar, Camera, MapPin, Phone, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConvertDate } from '../../Utils/CommonFunctions'
import { updateProfileImg, getUserById } from '@/service/auth/auth.service'
import { SEO } from '../../Utils/Helmet'
import { EditableFieldProps } from "../../Utils/UserInterface";
import { updateUser } from "@/service/auth/auth.service";
import {uploadImg} from "@/service/auth/auth.service";



const EditableField: React.FC<EditableFieldProps> = ({ label, value, icon: Icon, onSave, type = "text", placeholder, isEditable = true, name }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const userDetails = JSON.parse(localStorage.getItem('user'))

  const { toast } = useToast();
  const handleSave = async () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue === "") {
      toast({
        title: "warning",
        description: `Please enter a valid ${name}`,
        variant: "warning",
        duration: 1000,
      });
      return;
    }
    if (name === "PhoneNo") {
      const phoneValid = /^\d{10}$/.test(trimmedValue);
      if (!phoneValid) {
        toast({
          title: "Warning",
          description: "Please enter a valid 10-digit phone number",
          variant: "warning",
          duration: 1000,
        });
        return;
      }
    }

    const req = { id: userDetails?._id, value: inputValue, name: name }
    await updateUser(req)
      .then((res) => {
        if (res.status) {
          onSave(inputValue);
          setIsEditing(false);
          toast({
            title: "Success",
            description: `Your ${name} has been updated successfully`,
            variant: "success",
            duration: 1000,
          });
        } else {
          console.error("Error updating user details:", res.message);
        }
      }
      )
      .catch((error) => {
        console.error("Error in updating user details:", error);
      }
      );

  }

  const handleCancel = () => {
    setInputValue(value);
    setIsEditing(false);
  };

  return (
    <motion.div
      className="relative group p-3 bg-[#031123]/50 rounded-lg hover:bg-[#031123] transition-colors duration-300"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-3">
        {Icon && <Icon className="text-[#01C8A9] w-5 h-5" />}
        <div className="flex-1">
          <label className="text-sm text-gray-400 font-medium">{label}</label>
          {isEditing ? (
            <div className="flex gap-2 mt-1">
              <Input
                type={type}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="bg-[#001430] border-[#112F59] text-white h-9"
                placeholder={placeholder}
                autoFocus
              />
              <Button variant="ghost" size="sm" onClick={handleSave} className="text-green-500 h-9 w-9 p-0">
                <Check size={16} />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleCancel} className="text-red-500 h-9 w-9 p-0">
                <X size={16} />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between mt-1">
              <p className="text-white text-base font-medium">{value}</p>
              {isEditable && <button
                onClick={() => setIsEditing(true)}
                className="opacity-100 group-hover:opacity-100 text-gray-400 hover:text-[#01C8A9] p-1 transition-opacity duration-300"
                aria-label={`Edit ${label}`}
              >
                <Pencil size={16} />
              </button>}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const AccountPage = () => {
  const isMobile = useIsMobile();
  const location = useLocation()
  const fileInputRef = useRef(null);
  const userdata = JSON.parse(localStorage.getItem('user'))
  const { sidebarOpen, setSidebarOpen, sidebarCollapsed, setSidebarCollapsed } = useResponsiveSidebar();
  const { logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [userDetails, setUserDetails] = useState(null)
  const [userProfile, setUserProfile] = useState({
    displayName: userdata?.FirstName + " " + userdata?.LastName || 'N/A',
    email: userdata?.Email || 'N/A',
    company: '',
    position: '',
    phone: userdata?.PhoneNo || 'N/A',
    location: userdata?.address + " " + (userdata?.country || ''),
    joinedDate: ConvertDate(userdata?.createdAt) || 'N/A',
    bio: 'N/A'
  });


  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleCreateClick = () => {
    if (isMobile) {
      navigate("/create-signature");
    } else {
    }
  };

  useEffect(() => {
    getUserData()
  }, [])

  const getUserData = async () => {
    const req = { id: userdata?._id }
    await getUserById(req)
      .then((res) => {
        if (res.status) {
          setUserDetails(res.data)
          localStorage.setItem('user', JSON.stringify(res.data))
        }
        else {
          setUserDetails(null)
        }
      })
      .catch((error) => {
        console.log("Error in retrieved user", error)
      })
  }

  const updateProfile = (field: string, value: string) => {
    setUserProfile(prev => ({ ...prev, [field]: value }));
    toast({
      title: "Profile updated",
      description: `Your ${field} has been updated successfully`,
      variant: "success",
      duration: 1000,
    });
  };


  const uploadProfilePicture = async (file) => {
    try {
      setUploading(true);   
      const uploadResponse = await uploadImg({ file });
      if (!uploadResponse?.url) {
        throw new Error("Failed to upload image to S3");
      }
   
      const req = {
        id: userdata?._id,
        url: uploadResponse.url
      };
  
      const updateRes = await updateProfileImg(req);
  
      if (updateRes?.status) {
        toast({
          title: "Profile picture updated",
          description: "Your profile picture has been updated successfully",
          variant: "success",
          duration: 1000,
        });
        getUserData(); // 🔄 Refresh user info
      } else {
        throw new Error(updateRes?.message || "Failed to update image in database");
      }
    } catch (error) {
      console.error("Profile image upload error:", error);
      toast({
        title: "Upload failed",
        description: error?.message || "Something went wrong while uploading your profile picture",
        variant: "destructive",
        duration: 1500,
      });
    } finally {
      setUploading(false); // 🛑 Stop spinner no matter what
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const base64 = await convertToBase64(file);
      uploadProfilePicture(base64);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Converts to base64
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const endpoint = window.location.hash.replace(/^#/, '').split('?')[0];


  return (
    <>
      <SEO title={endpoint.split('/').pop()} description={"MyAccount"} />
      <SidebarProvider defaultOpen={!isMobile}>
        <div className="flex w-full min-h-screen bg-gradient-to-br from-[#001430] to-[#002040] font-sans">
          <MainSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} onCollapseChange={setSidebarCollapsed} />
          <div
            className="flex flex-col flex-1 transition-all duration-300 ease-in-out"
            style={{
              width: "100%",
              marginLeft: isMobile ? 0 : sidebarCollapsed ? '70px' : '250px',
              paddingBottom: isMobile ? '80px' : '20px'
            }}
          >
            <Header onMenuClick={handleMenuClick} hideAccount={isMobile} />
            <div className="flex flex-col p-4 sm:p-6">
              <h1 className="text-white text-xl font-semibold mb-6 flex items-center">
                <User className="mr-2 text-[#01C8A9]" />
                My Account
              </h1>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                {/* User Profile Card */}
                <motion.div
                  variants={itemVariants}
                  className="bg-[#031123] border border-[#112F59] rounded-lg overflow-hidden shadow-lg"
                >
                  <div className="h-32 bg-gradient-to-r from-[#01C8A9] to-[#3B82F6] relative">
                    <div className="absolute -bottom-16 left-6">
                      <div className="relative">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#01C8A9] to-[#3B82F6] flex items-center justify-center text-white text-3xl font-bold border-4 border-[#031123] overflow-hidden">
                          <img src={userDetails?.profile_img} alt="User Profile Img" />
                        </div>

                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          className="hidden"
                        />

                        <button
                          onClick={handleButtonClick}
                          disabled={uploading}
                          className="absolute bottom-2 right-2 bg-[#01C8A9] rounded-full p-2 text-white hover:bg-[#00a088] transition-colors"
                        >
                          {uploading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Camera size={20} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-20 px-6 pb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                      <div>
                        <h2 className="text-white text-2xl font-medium">{userProfile?.displayName}</h2>
                        {/* <p className="text-gray-400">{userProfile.position} at {userProfile.company}</p> */}
                      </div>

                      <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
                        {/* <span className="bg-[#01C8A9]/20 text-[#01C8A9] text-xs px-3 py-1 rounded-full">Premium</span> */}
                        <span className="bg-blue-500/20 text-blue-400 text-xs px-3 py-1 rounded-full">Verified</span>
                        <span className="bg-purple-500/20 text-purple-400 text-xs px-3 py-1 rounded-full">{userProfile?.location}</span>
                      </div>
                    </div>

                  </div>
                </motion.div>

                {/* Account Settings Cards */}
                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {/* Personal Info */}
                  <div className="bg-[#031123] border border-[#112F59] rounded-lg p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/50 to-blue-700/50 flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-400" />
                      </div>
                      <h3 className="text-white font-medium text-lg">Personal Information</h3>
                    </div>

                    <div className="space-y-3">
                      <EditableField
                        label="Full Name"
                        value={userProfile.displayName}
                        icon={User}
                        placeholder="Enter your full name"
                        onSave={(value) => updateProfile('Username', value)}
                        isEditable={true}
                        name="Username"
                      />
                      <EditableField
                        label="Email Address"
                        value={userProfile.email}
                        icon={Mail}
                        type="email"
                        placeholder="Enter your email address"
                        onSave={(value) => updateProfile('email', value)}
                        isEditable={false}
                        name="email"

                      />
                      <EditableField
                        label="Phone Number"
                        value={userProfile.phone}
                        icon={Phone}
                        placeholder="Enter your phone number"
                        onSave={(value) => updateProfile('phone', value)}
                        isEditable={true}
                        name="PhoneNo"

                      />
                      <EditableField
                        label="Location"
                        value={userProfile.location}
                        icon={MapPin}
                        placeholder="Enter your location"
                        onSave={(value) => updateProfile('location', value)}
                        isEditable={true}
                        name="address"

                      />
                    </div>
                  </div>

                  {/* Account Settings */}
                  <div className="bg-[#031123] border border-[#112F59] rounded-lg p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#01C8A9]/50 to-teal-700/50 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-[#01C8A9]" />
                      </div>
                      <h3 className="text-white font-medium text-lg">Account Settings</h3>
                    </div>

                    <div className="space-y-6">
                      {/* <div className="bg-[#031123]/50 p-3 rounded-lg">
                      <Label className="text-gray-400 text-sm">Account Type</Label>
                      <div className="flex items-center mt-1">
                        <span className="text-[#01C8A9] font-medium">Premium</span>
                        <Button variant="link" className="text-[#01C8A9] text-xs ml-2 p-0 h-auto">
                          Upgrade
                        </Button>
                      </div>
                    </div> */}

                      <div className="bg-[#031123]/50 p-3 rounded-lg">
                        <Label className="text-gray-400 text-sm">Joined Date</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="text-gray-400 w-4 h-4" />
                          <p className="text-white">{userProfile.joinedDate}</p>
                        </div>
                      </div>

                      <div className="bg-[#031123]/50 p-3 rounded-lg">
                        <Label className="text-gray-400 text-sm">Last Login</Label>
                        <p className="text-white mt-1">April 9, 2025 - 14:32 GMT</p>
                      </div>
                      {/* 
                    <div className="pt-4">
                      <Button
                        variant="outline"
                        className="w-full bg-gradient-to-r from-[#01C8A9]/20 to-[#01C8A9]/5 border-[#01C8A9]/50 text-[#01C8A9] hover:bg-[#01C8A9]/20 transition-all duration-300"
                        onClick={() => navigate('/subscription')}
                      >
                        Manage Subscription
                      </Button>
                    </div> */}
                    </div>
                  </div>
                </motion.div>

                {/* Security Section */}
                {/* <motion.div
                variants={itemVariants}
                className="bg-[#031123] border border-[#112F59] rounded-lg p-6 shadow-lg"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/50 to-purple-700/50 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-white font-medium text-lg">Security Settings</h3>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    className="w-full sm:w-auto bg-gradient-to-r from-[#01C8A9] to-[#01a088] text-white hover:opacity-90"
                  >
                    Change Password
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto border-[#112F59] text-white hover:bg-[#112F59]/30"
                  >
                    Enable Two-Factor Authentication
                  </Button>
                </div>
              </motion.div> */}

                {/* Logout Button */}

              </motion.div>
            </div>
          </div>

          {isMobile && (
            <MobileNavbar onCreateClick={handleCreateClick} />
          )}
        </div>
      </SidebarProvider>
    </>
  );
};

export default AccountPage;
