
import React, { useState, useEffect, useCallback } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/layout/Header";
import MainSidebar from "@/components/layout/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowLeft, Mail, Save } from "lucide-react";
import { useResponsiveSidebar } from "@/hooks/use-responsive-sidebar";
import { useToast } from "@/hooks/use-toast";
import { TabsContent, TabsList, TabsTrigger, Tabs } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { X, Plus, Image, Phone, Upload } from "lucide-react";
import SignaturePreviewDialog from "@/components/signature/SignaturePreviewDialog";
import SignatureBackgroundPicker from "@/components/signature/SignatureBackgroundPicker";
import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";
import { AddSignature, getSignatureById, updateSignature } from "@/service/User/signatureService";
import 'react-image-crop/dist/ReactCrop.css';
import * as Config from "../../Utils/config";
import Cropper, { Area } from 'react-easy-crop';
import Slider from '@mui/material/Slider';
interface ButtonOption {
  id: string;
  text: string;
  type: string;
  connect_with: string;
  color: string;
  fontStyle: "normal" | "italic" | "bold" | "boldItalic";
}

interface SocialMediaOption {
  id: string;
  type: string;
  link: string;
  icon: string;
}

interface BackgroundOption {
  id: string;
  background_type: 'color' | 'gradient' | 'image';
  background_value: string;
  label?: string;
}

interface FormData {
  fullName: string;
  jobTitle: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  headshot_url?: string;
}


interface SingleSignature {
  _id: string,
  SignatureName: string,
  Templates_Id: string,
  details: {
    html: string;
    background: {
      background_value: string
    }
  }
}

const SignatureEditorPageRedesigned = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useIsMobile();
  const userDetails = JSON.parse(localStorage.getItem('user'))
  const { sidebarOpen, setSidebarOpen, sidebarCollapsed, setSidebarCollapsed } = useResponsiveSidebar();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("personal");
  const [btnActiveTab, setBtnActiveTab] = useState<string>("button-1");
  const [showPreview, setShowPreview] = useState(false);
  const [socialMediaActiveTab, setSocialMediaActiveTab] = useState<string>("btn-1")
  const [getSelectedTemplateID, setSelectedTemplateID] = useState<string>("")
  const [getSingleSignatureData, setSingleSignatureData] = useState<SingleSignature | null>(null)
  const [selectedSocialMedia, setSelectedSocialMedia] = useState<SocialMediaOption[]>([{ id: "btn-1", type: "Facebook", link: "", icon: "" }])
  const [selectedButtons, setSelectedButtons] = useState<ButtonOption[]>([{ id: "button-1", text: "Join Meeting", type: "join_meeting", connect_with: "", color: "bg-green-500", fontStyle: "normal" }]);
  const [selectedBackground, setSelectedBackground] = useState<BackgroundOption | null>({ id: 'white', background_type: 'color', background_value: '#ffffff', label: 'White' });

  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);



  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCropSrc(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);


  const getCroppedImg = (imageSrc: string, crop: Area): Promise<string> => {
    return new Promise((resolve, reject) => {
      const image = new window.Image(); 
      image.src = imageSrc;
      image.crossOrigin = 'anonymous';
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Failed to get context');
  
        ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);
  
        canvas.toBlob((blob) => {
          if (!blob) return reject('Canvas is empty');
          const fileUrl = URL.createObjectURL(blob);
          resolve(fileUrl);
        }, 'image/jpeg');
      };
      image.onerror = () => reject('Image load error');
    });
  };
  

  const handleCropApply = async () => {
    if (!cropSrc || !croppedAreaPixels) return;
    const croppedImage = await getCroppedImg(cropSrc, croppedAreaPixels);
    setFormData(prev => ({
      ...prev,
      headshot_url: croppedImage as string
    }));
    setShowCropper(false);
    setCropSrc(null);
  };


  const [formData, setFormData] = useState<FormData>({
    fullName: userDetails?.FirstName + " " + userDetails?.LastName,
    jobTitle: "",
    company: "",
    phone: userDetails?.PhoneNo,
    email: userDetails?.Email,
    website: "",
    headshot_url: userDetails?.profile_img
  });


  useEffect(() => {
    if (location?.state?.type == "edit") {
      getSingaleSignature()
    }
  }, [])

  const getSingaleSignature = async () => {
    const req = { id: location?.state?.id }
    await getSignatureById(req)
      .then((res) => {
        if (res.status) {


          setFormData(prev => ({
            ...prev,
            fullName: res?.data[0]?.details.fullName,
            jobTitle: res?.data[0]?.details.jobTitle,
            company: res?.data[0]?.details.company,
            phone: res?.data[0]?.details.phone,
            email: res?.data[0]?.details.email,
            website: res?.data[0]?.details.website,
            headshot_url: res?.data[0]?.details.headshot_url
          }));
          setSelectedSocialMedia(res?.data[0]?.details?.socialMedia)
          setSelectedButtons(res?.data[0]?.details?.buttons)
          setSelectedTemplateID(res?.data[0]?.Templates_Id);
          setSelectedBackground(res?.data[0]?.details.background)
          setSingleSignatureData(res?.data[0])
          setBtnActiveTab(res?.data[0]?.details?.buttons[0].id)

        }


      })
      .catch((error) => {
        console.log("error in fetching the signature by id", error)
      })
  }

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };


  const handleSaveSignature = async () => {
    const req = {
      id: location.state.type === "edit" ? location.state.id : "",
      SignatureName: location.state.type === "edit" ? getSingleSignatureData?.SignatureName : location?.state?.signatureName,
      Templates_Id: location.state.type === "edit" ? getSingleSignatureData?.Templates_Id : location?.state?.templatesId?.id,
      userId: userDetails?._id,
      usageCount: 0,
      details: {
        ...formData,
        layout: "standard",
        buttons: selectedButtons,
        background: selectedBackground,
        socialMedia: selectedSocialMedia,
        html: findSelectedTemplate[0]?.html,
      },
    };

    try {
      const res = location.state.type === "edit"
        ? await updateSignature(req)
        : await AddSignature(req);

      if (res.status) {
        toast({
          title: "Signature Saved",
          description: res.message,
          variant: "success",
  duration: 1000,
        });
        navigate('/user/signatures');
      } else {
        toast({
          title: "Error",
          description: res.message,
          variant: "destructive",
          duration: 1000,
        });
      }
    } catch (err) {
      console.error("Error in signature API", err);
      toast({
        title: "Error",
        description: "Something went wrong while saving the signature.",
        variant: "destructive",
        duration: 1000,
      });
    }
  };

  const handlePreviewClick = () => {
    setShowPreview(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddButton = () => {
    const newButton = {
      id: `button-${Date.now()}`,
      text: "Join Meeting",
      type: "join_meeting",
      connect_with: "",
      color: "bg-green-500",
      fontStyle: "normal" as const
    };

    const updatedButtons = [...selectedButtons, newButton];
    setSelectedButtons(updatedButtons);
    setBtnActiveTab(newButton.id);
  };

  const handleAddSocialMedia = () => {
    const newButton = {
      id: `button-${Date.now()}`,
      link: "",
      type: "Facebook",
      icon: ""
    };

    const updatedSocialMedia = [...selectedSocialMedia, newButton];
    setSelectedSocialMedia(updatedSocialMedia);
    setSocialMediaActiveTab(newButton.id);
  };

  const handleRemoveSocialMedia = (id: string) => {
    const updatedSocialMedia = selectedSocialMedia.filter((item) => item.id !== id);
    setSelectedSocialMedia(updatedSocialMedia);

    if (socialMediaActiveTab === id && updatedSocialMedia.length > 0) {
      setSocialMediaActiveTab(updatedSocialMedia[updatedSocialMedia.length - 1].id);
    } else if (updatedSocialMedia.length === 0) {
      setSocialMediaActiveTab("");
    }
  };

  const handleRemoveButton = (id: string) => {
    const updatedButtons = selectedButtons.filter((btn) => btn.id !== id);
    setSelectedButtons(updatedButtons);

    // If the deleted tab was active, switch to the last one
    if (btnActiveTab === id && updatedButtons.length > 0) {
      setBtnActiveTab(updatedButtons[updatedButtons.length - 1].id);
    } else if (updatedButtons.length === 0) {
      setBtnActiveTab(""); // Or handle no-tabs case
    }
  };

  const btnLabel = {
    "book_meeting": "Book Meeting",
    "contact_us": "Contact Us",
    "leave_review": "Leave Review",
    "join_meeting": "Join Meeting",
    "visit_website": "Visit Website"

  }
  const handleButtonChange = (id: string, field: string, value: string) => {
    setSelectedButtons(prev =>
      prev.map(button =>
        button.id === id ? field == "type" ? { ...button, [field]: value, ["text"]: btnLabel[value] } : { ...button, [field]: value, } : button
      )
    );
  };

  const handlSocialMediaChange = (id: string, field: string, value: string) => {
    setSelectedSocialMedia(prev =>
      prev.map(items =>
        items.id === id ? { ...items, [field]: value } : items
      )
    );
  };

  const handleHeadshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormData(prev => ({
          ...prev,
          headshot_url: event.target?.result as string
        }));
      }
    };
    reader.readAsDataURL(file);
  };



  const colorMapping = {
    "bg-green-500": "#10B981",
    "bg-blue-500": "#3B82F6",
    "bg-purple-500": "#8B5CF6",
    "bg-red-500": "#EF4444",
    "bg-orange-500": "#FB923C",
    "bg-pink-500": "#EC4899",
    "bg-gray-500": "#6B7280",
    "#00BCD4": "#00BCD4",
    '#da4e96': "#da4e96",
    '#F28C66': '#F28C66',
    '#867ba1': '#867ba1',
  };

  const btnsIcons = {
    "book_meeting": "https://los-static.s3.us-east-1.amazonaws.com/tv/s-icon/date.png",
    "contact_us": "https://los-static.s3.us-east-1.amazonaws.com/tv/s-icon/call-phone.png",
    "leave_review": "https://los-static.s3.us-east-1.amazonaws.com/tv/s-icon/star.png",
    "join_meeting": "https://los-static.s3.us-east-1.amazonaws.com/tv/s-icon/star.png",
    "visit_website": "https://los-static.s3.us-east-1.amazonaws.com/tv/s-icon/star.png",
  }

  const buttonsHtml = selectedButtons.map((button) => {
    let link = button.connect_with || "#";
    const commonStyle = `color:#fff; text-decoration:none; font-size: 12px; display:inline-flex; align-items:center;`;
    if (button.type === "contact_us") {
      link = `tel:${button.connect_with}`;
      return `<td style="padding: 3px;">
                <table cellpadding="0" cellspacing="0" border="0" style="background-color: ${colorMapping[button?.color]}; border-radius: 10px;">
                  <tr>
                    <td style="padding:4px 10px;">
                     <a href="${`${Config.base_url}track-click?btnName=${encodeURIComponent(button.type)}&url=${encodeURIComponent(link)}&userId=${encodeURIComponent(userDetails?._id)}&linkType=${"btn"}`}&signatureId=__SIGNATURE_ID__" style="${commonStyle}">
                        <img src="${btnsIcons[button.type]}" width="15px" style="margin-right: 4px; vertical-align:middle;"> ${button.text}
                      </a>
                    </td>
                  </tr>
                </table>
              </td>`;
    }
    return `<td style="padding: 3px;">
              <a  href="${`${Config.base_url}track-click?btnName=${encodeURIComponent(button.type)}&url=${encodeURIComponent(link)}&userId=${encodeURIComponent(userDetails?._id)}&linkType=${"btn"}&signatureId=__SIGNATURE_ID__`}"
                style="display:inline-flex; align-items:center; padding:6px 10px; background-color: ${colorMapping[button?.color]}; border-radius: 10px; color:#fff; text-decoration:none; font-size: 12px; 
                ${button.fontStyle === "italic" ? "font-style: italic;" : ""} 
                ${button.fontStyle === "bold" ? "font-weight: bold;" : ""} 
                ${button.fontStyle === "boldItalic" ? "font-style: italic; font-weight: bold;" : ""}">
                <img src="${btnsIcons[button.type]}" width="15px" style="margin-right: 4px; vertical-align:middle;"> ${button.text}
              </a>
            </td>`;
  }).join("");


  const socialMediaIcons = {
    "Facebook": "https://los-static.s3.us-east-1.amazonaws.com/tv/s-icon/ic-facebook.png",
    "Twitter": "https://los-static.s3.us-east-1.amazonaws.com/tv/s-icon/icon-twitter.png",
    "Linkedin": "https://los-static.s3.us-east-1.amazonaws.com/tv/s-icon/ic-linkedin.png",
    "Whatsapp": "https://los-static.s3.us-east-1.amazonaws.com/tv/s-icon/ic-whatsapp.png",
    "Instagram": "https://los-static.s3.us-east-1.amazonaws.com/tv/s-icon/ic-instagram.png"
  }

  const socialMediaHtml = selectedSocialMedia.map((item) => {
    return ` <p style="margin: 0px;"><a href="${`${Config.base_url}track-click?btnName=${encodeURIComponent(item.type)}&url=${encodeURIComponent(item.link || "#")}&userId=${encodeURIComponent(userDetails?._id)}&linkType=${"social"}&signatureId=__SIGNATURE_ID__`}" style="text-decoration: none; display: inline-block; margin-right: 8px;">
    <img src="${socialMediaIcons[item.type]}" alt="${item.type}" width="20" style="margin: 7px;"></a>
    </p>`;
  });

  const socialMediaHtml2 = selectedSocialMedia.map((item) => {
    return `<a href="${`${Config.base_url}track-click?btnName=${encodeURIComponent(item.type)}&url=${encodeURIComponent(item.link || "#")}&userId=${encodeURIComponent(userDetails?._id)}&linkType=social&signatureId=__SIGNATURE_ID__`}"
               style="display: inline-block; margin: 0 4px;">
              <img src="${socialMediaIcons[item.type]}" alt="${item.type}" width="25">
            </a>`;
  }).join('');


  const templatesArr = [
    {
      id: "6809dc9c921ec942269433d0",
      html: `
     <table cellpadding="0" cellspacing="0"
  style="background: #ffffff; border:1px solid #d9d5d5; border-radius:10px; width:652px">
  <tr>
    <td style="vertical-align: top;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="width: 40%; padding:30px 0 0 56px;">
            <h3
              style="color: #999999; font-size: 20px; font-weight: 500;line-height: 100%;letter-spacing: 0%;color: #7B7B7B; margin: 0;">
              ${formData?.jobTitle || "Profession "} <span
                style=" ;width: 70px; height: 4px;background-color: #3FA9F5;margin-left: 5px; border-radius: 2px; position: relative; top: -2px;"></span>
            </h3>
            <h1 style="font-size: 30px; font-weight: 900;line-height: 100%;margin: 2px 0 8px;color: #000000;">
              ${formData.fullName}</h1>

            <!-- Unified Table for Alignment -->
            <table cellpadding="0" cellspacing="0" border="0" style="font-size: 12px; color: #999999;">
              <tr>
                <td style="width: 70px;padding-top:4px">Phone:</td>
                <td><a href="tel:+1680773560" style="color: #1976d2; text-decoration: none;">${formData.phone || "Phone"}</a></td>
              </tr>
              <tr>
                <td style="width: 70px;padding-top:4px">Email:</td>
                <td><a href="mailto:thomas@acmee.com" style="color: #1976d2; text-decoration: none;">${formData.email || ""}</a></td>
              </tr>
              <tr>
                <td style="width: 70px;padding-top:4px">Website:</td>
                <td><a href="https://acmee.com" style="color: #1976d2; text-decoration: none;">${formData.website || "website"}</a></td>
              </tr>
              <tr>
                <td style="width: 70px;padding-top:4px">Company:</td>
                <td><a href="https://acmee.com" style="color: #1976d2; text-decoration: none;">${formData?.company || "company name"}</a></td>
              </tr>
              <tr>
                <td style="width: 70px;padding-top:4px">Address:</td>
                <td><a href="#" style="color: #1976d2; text-decoration: none;">${userDetails?.address || ""} ${userDetails?.country || ""}</a></td>
              </tr>
              <tr>
                <td style="width: 70px;padding-top:4px">NMLS:</td>
                <td>61131131</td>
              </tr>
            </table>

          </td>
          <td align="center" style="width: 30%; padding-top: 10px;">
            <img src="${formData.headshot_url || userDetails?.profile_img}" width="120" height="120"
              style="border-radius: 50%; display: block; border: 3px solid #64b5f6;" alt="Wade Warren">
          </td>
          <td
            style="width: 7%; background: #FFFFFF; border-left: 1px solid #e7e7e7; border-top-left-radius: 24.45px; border-bottom-left-radius: 18px;"
            align="center">${socialMediaHtml.join('')}</td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
  <td style="padding: 10px 5px 10px 38px; text-align: left;">
    <table cellpadding="0" cellspacing="0" style="width: auto; display: inline-block;">
      <tr>
        ${buttonsHtml} 
      </tr>
    </table>
  </td>
</tr>
</table>
`
    },
    {
      id: "6825ddb868e8079f26761aa9",
      html:
        `
        <table width="100%" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="background: #ffffff; border: 1px solid #dbdbdb; border-radius: 10px; max-width: 652px; width: 100%;  ">
          <tr>
            <td>
              <table cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; padding: 8px; border-radius: 8px;">
                <tr>
                  <!-- Left Side: Image + Social Icons -->
                  <td style="padding: 16px; vertical-align: top;" width="200">
                    <table cellpadding="0" cellspacing="0" align="center">
                      <tr>
                        <td align="center">
                          <img src="https://loanofficersupport.s3.amazonaws.com/pimgs/18140800618image_6809d9cce7e92.png"
                            width="90" height="90"
                            style="border-radius: 50%; display: block; border: 3px solid #64b5f6;" alt="Chandra Prakash">
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding-top: 30px;">
                          <div style="text-align: center;">
                            ${socialMediaHtml2}
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>

                  <!-- Right Side: Info -->
                  <td style="padding-left: 16px; padding-top: 16px; vertical-align: top;">
                    <h3 style="color: #7B7B7B; font-size: 20px; font-weight: 500; margin: 0;">
                      ${formData?.jobTitle || "Profession "}
                    </h3>
                    <h1 style="font-size: 30px; font-weight: 900; margin: 2px 0 8px; color: #000000;">
                      ${formData?.fullName}
                    </h1>
                    <p style="font-weight: 400; font-size: 12px; color: #999999; margin: 4px 0;">
                      <span style="display: inline-block; min-width: 60px;">Phone:</span>
                      <a href="tel:1234567891" style="color: #1976d2; text-decoration: none;">
                        ${formData.phone || "Phone"}
                      </a>
                    </p>
                    <p style="font-weight: 400; font-size: 12px; color: #999999; margin: 4px 0;">
                      <span style="display: inline-block; min-width: 60px;">Email:</span>
                      <a href="mailto:xyz@gmail.com" style="color: #1976d2; text-decoration: none;">
                        ${formData.email || ""}
                      </a>
                    </p>
                    <p style="font-weight: 400; font-size: 12px; color: #999999; margin: 4px 0;">
                      <span style="display: inline-block; min-width: 60px;">Website:</span>
                      <a href="https://xyz.com/" style="color: #1976d2; text-decoration: none;">
                        ${formData.website || "website"}
                      </a>
                    </p>
                    <p style="font-weight: 400; font-size: 12px; color: #999999; margin: 4px 0;">
                      <span style="display: inline-block; min-width: 60px;">Company:</span>
                      ${formData?.company || "company name"}
                    </p>
                    <p style="font-weight: 400; font-size: 12px; color: #999999; margin: 4px 0;">
                      <span style="display: inline-block; min-width: 60px;">Address:</span>
                      ${userDetails?.address || ""} ${userDetails?.country || ""}
                    </p>
                  </td>
                </tr>

                <tr>
                  <td colspan="2" style="padding-top: 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="text-align: left;">
                          <table cellpadding="0" cellspacing="0" style="width: auto; display: inline-block;">
                            <tr>
                              ${buttonsHtml}
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
`



    },
  ]


  const findSelectedTemplate = templatesArr?.filter((item) => item.id == (location?.state?.type == "edit" ? getSelectedTemplateID : location?.state?.templatesId?.id));
  const html = `
  <table width="100%" cellpadding="0" cellspacing="0"
  style="font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;; background-color: #f0f0f0; padding: 20px;border:1px solid red ">
  <tr>
    <td align="center">
    
     ${findSelectedTemplate[0]?.html}
    
      </table>
    </td>
  </tr>

</table>
`


  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex w-full min-h-screen bg-[#001430] font-sans">
        <MainSidebar
          open={sidebarOpen}
          onOpenChange={setSidebarOpen}
          onCollapseChange={setSidebarCollapsed}
        />
        <div
          className="flex flex-col flex-1 transition-all duration-300 ease-in-out"
          style={{
            width: "100%",
            marginLeft: isMobile ? 0 : sidebarCollapsed ? '70px' : '230px',
            paddingBottom: isMobile ? '80px' : '0'
          }}
        >
          <Header onMenuClick={handleMenuClick} />

























          <div className="p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
                className="mr-2 text-white border mb-3"
              >
                <ArrowLeft size={16} className="mr-1" /> Back
              </Button>
              <h1 className="text-white text-xl md:text-2xl font-semibold">Signature Editor</h1>
              <p className="text-gray-400 text-sm">Customizing template: Creative Bold</p>
            </div>
            <div className="flex mt-2 md:mt-0">
              <Button variant="ghost" className="text-white mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              </Button>
            </div>
          </div>

          <div className="px-4 md:px-6 pb-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-[3]">
                <div className="bg-[#031123] border border-[#112F59] rounded-lg p-4 h-full">
                  <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="bg-transparent space-x-6 border-b border-[#112F59] w-full justify-start px-0">
                      <TabsTrigger value="personal" className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#01C8A9] rounded-none pb-2">
                        Personal Info
                      </TabsTrigger>
                      <TabsTrigger value="buttons" className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#01C8A9] rounded-none pb-2">
                        Buttons
                      </TabsTrigger>
                      <TabsTrigger value="social_media" className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#01C8A9] rounded-none pb-2">
                        Social Media
                      </TabsTrigger>
                      {/* <TabsTrigger value="background" className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#01C8A9] rounded-none pb-2">
                        Background
                      </TabsTrigger>
                      <TabsTrigger value="style" className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#01C8A9] rounded-none pb-2">
                        Style
                      </TabsTrigger> */}

                    </TabsList>

                    <TabsContent value="personal" className="mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-8">
                          <div className="space-y-4">
                            <label className="text-white text-sm font-medium">Full Name</label>
                            <input
                              type="text"
                              name="fullName"
                              className="w-full bg-[#020e1f] border border-[#112F59] rounded-md p-2 text-white"
                              placeholder="Enter your full name"
                              value={formData.fullName}
                              onChange={handleInputChange}
                            />
                          </div>

                          <div className="space-y-4">
                            <label className="text-white text-sm font-medium">Job Title</label>
                            <input
                              type="text"
                              name="jobTitle"
                              className="w-full bg-[#020e1f] border border-[#112F59] rounded-md p-2 text-white"
                              placeholder="Enter your job title"
                              value={formData.jobTitle}
                              onChange={handleInputChange}
                            />
                          </div>

                          <div className="space-y-4">
                            <label className="text-white text-sm font-medium">Company</label>
                            <input
                              type="text"
                              name="company"
                              className="w-full bg-[#020e1f] border border-[#112F59] rounded-md p-2 text-white"
                              placeholder="Enter your company name"
                              value={formData.company}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        <div className="space-y-8">
                          <div className="space-y-4">
                            <label className="text-white text-sm font-medium">Email</label>
                            <input
                              type="email"
                              name="email"
                              className="w-full bg-[#020e1f] border border-[#112F59] rounded-md p-2 text-white"
                              placeholder="Enter your email address"
                              value={formData.email}
                              onChange={handleInputChange}
                            />
                          </div>

                          <div className="space-y-4">
                            <label className="text-white text-sm font-medium">Phone</label>
                            <input
                              type="tel"
                              name="phone"
                              className="w-full bg-[#020e1f] border border-[#112F59] rounded-md p-2 text-white"
                              placeholder="Enter your phone number"
                              value={formData.phone}
                              onChange={handleInputChange}
                            />
                          </div>

                          <div className="space-y-4">
                            <label className="text-white text-sm font-medium">Website</label>
                            <input
                              type="text"
                              name="website"
                              className="w-full bg-[#020e1f] border border-[#112F59] rounded-md p-2 text-white"
                              placeholder="Enter your website URL"
                              value={formData.website}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        {/* <div className="md:col-span-2">
                          <div className="space-y-4">
                            <label className="text-white text-sm font-medium">Headshot</label>
                            <div className="flex items-start space-x-4">
                              <div className="w-24 h-24 bg-[#020e1f] border border-[#112F59] rounded-md flex items-center justify-center overflow-hidden">
                                {formData.headshot_url ? (
                                  <img src={formData.headshot_url} alt="Headshot" className="w-full h-full object-cover" />
                                ) : (
                                  <Upload className="text-gray-500" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="text-gray-400 text-xs mb-2">Upload a professional headshot (recommended: 400×400px)</p>
                                <label className="cursor-pointer">
                                  <span className="bg-[#020e1f] border border-[#112F59] text-white text-sm px-3 py-2 rounded hover:bg-[#112F59]/30">
                                    Upload Image
                                  </span>
                                  <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleHeadshotUpload}
                                  />
                                </label>
                                <p className="text-gray-400 text-xs mt-2">
                                  1:1 ratio recommended. Max size: 2MB
                                </p>
                              </div>
                            </div>
                          </div>
                        </div> */}










                        <div className="space-y-4 p-6 bg-[#0a1a2f] rounded-lg max-w-md text-white">
                          <label className="text-white text-sm font-medium">Headshot</label>
                          <div className="flex items-start space-x-4">
                            <div className="w-24 h-24 bg-[#020e1f] border border-[#112F59] rounded-full overflow-hidden">
                              {formData.headshot_url ? (
                                <img src={formData.headshot_url} alt="Headshot" className="w-full h-full object-cover" />
                              ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">No Image</div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-400 text-xs mb-2">Upload a professional headshot (400×400px)</p>
                              <label className="cursor-pointer">
                                <span className="bg-[#020e1f] border border-[#112F59] text-white text-sm px-3 py-2 rounded hover:bg-[#112F59]/30">
                                  Upload Image
                                </span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                              </label>
                              <p className="text-gray-400 text-xs mt-2">1:1 ratio recommended. Max size: 2MB</p>
                            </div>
                          </div>

                          {/* Cropper Modal */}
                          {showCropper && cropSrc && (
                            <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex flex-col items-center justify-center">
                              <div className="relative w-full max-w-sm h-96 bg-[#020e1f] rounded-lg overflow-hidden">
                                <Cropper
                                  image={cropSrc}
                                  crop={crop}
                                  zoom={zoom}
                                  aspect={1}
                                  cropShape="round"
                                  showGrid={false}
                                  onCropChange={setCrop}
                                  onZoomChange={setZoom}
                                  onCropComplete={onCropComplete}
                                />
                              </div>
                              <div className="w-full max-w-sm mt-4 space-y-4 px-6">
                                <Slider
                                  value={zoom}
                                  min={1}
                                  max={3}
                                  step={0.1}
                                  onChange={(_, newValue) => setZoom(newValue as number)}
                                />
                                <div className="flex justify-between">
                                  <button
                                    onClick={() => setShowCropper(false)}
                                    className="px-4 py-2 bg-gray-500 text-white rounded"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={handleCropApply}
                                    className="px-4 py-2 bg-blue-600 text-white rounded"
                                  >
                                    Apply
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>


































                      </div>
                    </TabsContent>

                    <TabsContent value="buttons" className="mt-6">
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <h2 className="text-white text-lg">Call-to-Action Buttons</h2>
                            <p className="text-gray-400 text-sm">Add up to 4 buttons to your signature</p>
                          </div>
                          <Button
                            variant="teal"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={handleAddButton}

                          >
                            <Plus size={14} />
                            Add Button
                          </Button>
                        </div>
                        <Tabs value={btnActiveTab} onValueChange={setBtnActiveTab} className="w-full">
                          <TabsList className="flex items-center justify-start bg-[#011025] border border-[#1E2A3A] rounded-full p-1 gap-1">
                            {selectedButtons.map((button) => (
                              <TabsTrigger
                                key={button.id}
                                value={button.id}
                                className={cn(
                                  "flex items-center gap-2 px-4 py-2 rounded-full text-white transition",
                                  btnActiveTab === button.id
                                    ? "bg-white text-[#011025]" // Active tab
                                    : "bg-transparent text-gray-400 hover:bg-[#12263A]"
                                )}
                              >
                                <span>{button.text}</span>
                              </TabsTrigger>
                            ))}
                          </TabsList>
                          {selectedButtons.map((button) => (
                            <TabsContent key={button.id} value={button.id} className="mt-6">
                              <div className="space-y-6">
                                <div className="space-y-4">
                                  <div className="p-4 border border-[#112F59] rounded-lg bg-[#020e1f]">
                                    <div className="flex justify-between items-center mb-4">
                                      <div className="flex items-center">
                                        {/* <Phone size={16} className="text-green-500 mr-2" /> */}
                                        <span className="text-white">{button.text}</span>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-gray-400 hover:text-white"
                                        onClick={() => handleRemoveButton(button.id)}
                                      >
                                        <X size={16} />
                                      </Button>
                                    </div>
                                    <div>
                                      <label className="text-sm text-gray-400 mb-1 block">Button Type</label>
                                      <select
                                        className="w-full bg-[#020e1f] border border-[#112F59] rounded p-2 text-white mb-3"
                                        value={button.type}
                                        onChange={(e) => handleButtonChange(button.id, "type", e.target.value)}
                                      >
                                        <option value="contact_us">Contact Us</option>
                                        <option value="join_meeting">Join Meeting</option>
                                        <option value="visit_website">Visit Website</option>
                                        <option value="book_meeting">Book Meeting</option>
                                        <option value="leave_review">Leave Review</option>
                                      </select>
                                    </div>
                                    {/* <div>
                                      <label className="text-sm text-gray-400 mb-1 block">Button Text</label>
                                      <input
                                        type="text"
                                        className="w-full bg-[#020e1f] border border-[#112F59] rounded p-2 text-white mb-3"
                                        value={button.text}
                                        onChange={(e) => handleButtonChange(button.id, "text", e.target.value)}
                                      />
                                    </div> */}
                                    <div>
                                      <label className="text-sm text-gray-400 mb-1 block">{button.type === "contact_us" ? "Phone Number" : "URL"}</label>
                                      <input
                                        type="text"
                                        className="w-full bg-[#020e1f] border border-[#112F59] rounded p-2 text-white mb-3"
                                        value={button.connect_with}
                                        onChange={(e) => handleButtonChange(button.id, "connect_with", e.target.value)}
                                        placeholder={
                                          button.type === "contact_us"
                                            ? "tel:+1234567890"
                                            : button.type === "email"
                                              ? "mailto:your@email.com"
                                              : "https://yourwebsite.com"
                                        }
                                      />
                                    </div>
                                    <div>
                                      <label className="text-sm text-gray-400 mb-1 block">Button Color</label>
                                      <div className="flex flex-wrap gap-2 mb-3">
                                        {[
                                          "bg-green-500",
                                          "bg-blue-500",
                                          "bg-purple-500",
                                          "bg-red-500",
                                          "bg-orange-500",
                                          "#00BCD4",
                                          '#da4e96',
                                          '#F28C66',
                                          '#867ba1',
                                          "bg-gray-500",
                                        ].map((color) => {
                                          const isHex = color.startsWith("#");
                                          return (
                                            <div
                                              key={color}
                                              className={cn(
                                                "w-6 h-6 rounded-full cursor-pointer",
                                                !isHex && color,
                                                button.color === color ? "border-2 border-white" : ""
                                              )}
                                              style={isHex ? { backgroundColor: color } : {}}
                                              onClick={() => handleButtonChange(button.id, "color", color)}
                                            />
                                          );
                                        })}

                                      </div>
                                    </div>
                                    <div>
                                      <label className="text-sm text-gray-400 mb-1 block">Font Style</label>
                                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                                        {["normal", "italic", "bold", "boldItalic"].map((style) => (
                                          <div
                                            key={style}
                                            className={cn(
                                              "border rounded px-3 py-1 text-center text-white bg-transparent hover:bg-[#112F59]/30 cursor-pointer",
                                              button.fontStyle === style ? "border-[#01C8A9] bg-[#01C8A9]/10" : "border-[#112F59]"
                                            )}
                                            onClick={() => handleButtonChange(button.id, "fontStyle", style)}
                                          >
                                            <span
                                              className={cn({
                                                "italic": style.includes("italic"),
                                                "font-bold": style.includes("bold"),
                                              })}
                                            >
                                              {style.charAt(0).toUpperCase() + style.slice(1)}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    {/* <div>
                                      <label className="text-sm text-gray-400 mb-1 block">Gradient Options</label>
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        <div className="h-8 rounded cursor-pointer bg-gradient-to-r from-green-500 to-blue-500"></div>
                                        <div className="h-8 rounded cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500"></div>
                                        <div className="h-8 rounded cursor-pointer bg-gradient-to-r from-orange-500 to-red-500"></div>
                                        <div className="h-8 rounded cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                                      </div>
                                    </div>*/}

                                  </div>
                                </div>
                              </div>
                            </TabsContent>
                          ))}
                        </Tabs>
                      </div>
                    </TabsContent>

                    <TabsContent value="social_media" className="mt-6">
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <h2 className="text-white text-lg">Social Media</h2>
                            <p className="text-gray-400 text-sm">Add Social media buttons to your signature</p>
                          </div>
                          <Button
                            variant="teal"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={handleAddSocialMedia}
                          >
                            <Plus size={14} />
                            Add Social Media
                          </Button>
                        </div>

                        <Tabs value={socialMediaActiveTab} onValueChange={setSocialMediaActiveTab} className="w-full">
                          <TabsList className="flex items-center justify-start bg-[#011025] border border-[#1E2A3A] rounded-full p-1 gap-1">
                            {selectedSocialMedia.map((items) => (
                              <TabsTrigger
                                key={items.id}
                                value={items.id}
                                className={cn(
                                  "flex items-center gap-2 px-4 py-2 rounded-full text-white transition",
                                  socialMediaActiveTab === items.id
                                    ? "bg-white text-[#011025]" // Active tab
                                    : "bg-transparent text-gray-400 hover:bg-[#12263A]"
                                )}
                              >
                                <span>{items.type}</span>
                              </TabsTrigger>
                            ))}
                          </TabsList>
                          {selectedSocialMedia.map((items) => (
                            <TabsContent key={items.id} value={items.id} className="mt-6">
                              <div className="space-y-6">
                                <div className="space-y-4">
                                  <div className="p-4 border border-[#112F59] rounded-lg bg-[#020e1f]">
                                    <div className="flex justify-between items-center mb-4">
                                      <div className="flex items-center">
                                        <span className="text-white">{items.type}</span>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-gray-400 hover:text-white"
                                        onClick={() => handleRemoveSocialMedia(items.id)}
                                      >
                                        <X size={16} />
                                      </Button>
                                    </div>

                                    <div>
                                      <label className="text-sm text-gray-400 mb-1 block">Social Media Type</label>
                                      <select
                                        className="w-full bg-[#020e1f] border border-[#112F59] rounded p-2 text-white mb-3"
                                        value={items.type}
                                        onChange={(e) => handlSocialMediaChange(items.id, "type", e.target.value)}
                                      >
                                        <option value="Instagram">Instagram</option>
                                        <option value="Facebook">Facebook</option>
                                        <option value="Twitter">Twitter</option>
                                        <option value="Linkedin">Linkedin</option>
                                        <option value="Whatsapp">Whatsapp</option>

                                      </select>
                                    </div>
                                    <div>
                                      <label className="text-sm text-gray-400 mb-1 block">URL</label>
                                      <input
                                        type="text"
                                        className="w-full bg-[#020e1f] border border-[#112F59] rounded p-2 text-white mb-3"
                                        value={items.link}
                                        onChange={(e) => handlSocialMediaChange(items.id, "link", e.target.value)}
                                        placeholder={`Please enter your ${items.type} link`}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </TabsContent>
                          ))}
                        </Tabs>
                      </div>
                    </TabsContent>

                    <TabsContent value="background" className="mt-6">
                      <div className="space-y-6">
                        <h2 className="text-white text-lg">Background Options</h2>
                        <p className="text-gray-400 text-sm">Select a background for your signature</p>

                        <SignatureBackgroundPicker
                          selectedBackground={selectedBackground}
                          onSelectBackground={setSelectedBackground}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="style" className="mt-6">
                      <div className="flex flex-col items-center justify-center py-6">
                        <div className="text-center">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-4 text-yellow-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                          </svg>
                          <h3 className="text-xl font-medium text-white">Advanced styling options coming soon</h3>
                          <p className="text-gray-400 mt-2">Select templates and backgrounds for now</p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
              <div className="flex-[2]">
                <div className="bg-[#031123] border border-[#112F59] rounded-lg p-4 h-full">
                  <h2 className="text-white text-lg mb-4">Preview</h2>
                  <div
                    className="border border-[#112F59] rounded-lg p-4 mb-6 min-h-[200px] "
                    style={{ background: '#f0f0f0', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}  >
                    <div className="flex flex-col items-center justify-center w-full"
                      dangerouslySetInnerHTML={{ __html: findSelectedTemplate[0]?.html }}
                    >
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="teal" onClick={handlePreviewClick} className="text-white"  >
                      Preview Signature
                    </Button>
                    <Button variant="darkOutline" onClick={handleSaveSignature} className="text-white"  >
                      <Save size={16} />
                      Save Signature
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <SignaturePreviewDialog
          open={showPreview}
          onOpenChange={setShowPreview}
          details={getSingleSignatureData?.details}
          previewContent={
            <div
              className="rounded-lg p-4 min-h-[200px] "
              style={{ background: selectedBackground?.background_value || 'white' }}  >
              <div className="flex flex-col items-start"
                dangerouslySetInnerHTML={{ __html: html }}
              >
              </div>
            </div>

          }
        />
      </div>
    </SidebarProvider>
  );
};
export default SignatureEditorPageRedesigned;
