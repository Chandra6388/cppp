
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/layout/Header";
import MainSidebar from "@/components/layout/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import MobileNavbar from "@/components/layout/MobileNavbar";
import { getAllTemplates } from '@/service/User/signatureService'
import { SEO } from '../../Utils/Helmet'
import ReactJSXParser from 'react-jsx-parser';
const CreateSignaturePage = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [allTemplatesList, setAllTemplatesList] = useState([])
  const { toast } = useToast();
  const navigate = useNavigate();
  const handleMenuClick = () => {
    setSidebarOpen(true);
  };
  const handleSidebarCollapseChange = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  useEffect(() => {
    getTemplates()
  }, [])

  const getTemplates = async () => {
    const req = {}
    await getAllTemplates(req)
      .then((res) => {
        if (res.status) {
          setAllTemplatesList(res.data)
        }
        else {
          setAllTemplatesList([])
        }
      })
      .catch((error) => {
        console.log("error in fetching templates", error)
      })
  }

  const nextStep = () => {
    if (step === 1 && !name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your signature",
        variant: "destructive",
        duration: 1000,
      });
      return;
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleCreateSignature = (id: number | string, htmlCode: string) => {
    let selectedTemplate = {
      id: id,
      html: htmlCode
    }

    toast({
      title: "Success!",
      description: `Signature "${name}" created successfully!`,
      variant: "success",
      duration: 1000,
    });
    navigate("/user/editor", { state: { signatureName: name, templatesId: selectedTemplate, type: "add" } });
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
  const endpoint = window.location.hash.replace(/^#/, '').split('?')[0];


  return (
    <>
      <SEO title={endpoint.split('/').pop()} description={"createSignature"} />

      <SidebarProvider defaultOpen={!isMobile}>
        <div className="flex w-full min-h-screen bg-[#001430] font-sans">
          <MainSidebar
            open={sidebarOpen}
            onOpenChange={setSidebarOpen}
            onCollapseChange={handleSidebarCollapseChange}
          />

          <div
            className="flex flex-col flex-1 transition-all duration-300 ease-in-out"
            style={{
              width: "100%",
              marginLeft: isMobile ? 0 : sidebarCollapsed ? '70px' : '250px',
              paddingBottom: isMobile ? '80px' : '0'
            }}
          >
            <Header onMenuClick={handleMenuClick} />
            <div className="flex flex-col p-4 sm:p-4 pb-20">
              <div className=" items-center mb-6 gap-4">
                {step > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={prevStep}
                    className="mr-2 text-white border mb-3"
                  >
                    <ArrowLeft size={16} className="mr-1" /> Back
                  </Button>
                )}

                {step == 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/user/signatures')}
                    className="mr-2 text-white border mb-3"
                  >
                    <ArrowLeft size={16} className="mr-1" /> Back
                  </Button>
                )}
                <h1 className="text-white text-xl font-semibold">Create New Signature</h1>
              </div>
              <div className="flex items-center justify-center mb-8">
                <div className={`h-1 w-16 rounded-full ${step === 1 ? 'bg-[#01C8A9]' : 'bg-gray-600'}`}></div>
                <div className={`h-1 w-16 rounded-full ${step === 2 ? 'bg-[#01C8A9]' : 'bg-gray-600'}`}></div>
              </div>
              {step === 1 ? (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="max-w-md mx-auto w-full"
                >
                  <motion.div variants={itemVariants} className="mb-6">
                    <h2 className="text-xl text-white font-medium mb-6 text-center">Name Your Signature</h2>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="signature-name" className="text-white">Enter a name for your signature</Label>
                        <Input
                          id="signature-name"
                          placeholder="e.g. Work Signature, Personal Signature"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="bg-[#031123] border-[#112F59] text-white mt-1"
                        />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="flex justify-center mt-8">
                    <Button
                      onClick={nextStep}
                      className="bg-[#01C8A9] hover:bg-[#01a78f] text-white px-8"
                    >
                      Continue <ArrowRight size={16} className="ml-1" />
                    </Button>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  className="w-full"
                >
                  <motion.div variants={itemVariants} className="mb-6">
                    <h2 className="text-xl text-white font-medium mb-6 text-center">Choose a Template</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
                      {allTemplatesList.map((items, index) => {
                        console.log(items.htmlCode); // Check the content here
                        return (
                          <div
                            key={index}
                            className="overflow-hidden bg-[#031123] border border-transparent rounded-lg cursor-pointer transition-all hover:border-[#01C8A9]/100"
                            onClick={() => handleCreateSignature(items._id, items.htmlCode)}
                          >
                            <div
                              key={items._id}
                              dangerouslySetInnerHTML={{ __html: items.htmlCode }}
                            />
                          </div>
                        );
                      })}

                      
                      

                      {/* <div className="card card-v2">
                        <div className="card-content-v2">
                          <div className="left-v2">
                            <img
                              src="https://loanofficersupport.s3.amazonaws.com/pimgs/18140800618image_6809d9cce7e92.png"
                              alt="Profile"
                              className="profile-img-v2"
                            />
                            <div className="social-icons-v2">
                              <a href="#"><img src="https://los-static.s3.us-east-1.amazonaws.com/tv/s-icon/ic-facebook.png" alt="Facebook" /></a>
                              <a href="#"><img src="https://los-static.s3.us-east-1.amazonaws.com/tv/s-icon/ic-twitter.png" alt="Twitter" /></a>
                              <a href="#"><img src="https://los-static.s3.us-east-1.amazonaws.com/tv/s-icon/ic-skype.png" alt="Skype" /></a>
                              <a href="#"><img src="https://los-static.s3.us-east-1.amazonaws.com/tv/s-icon/ic-whatsapp.png" alt="WhatsApp" /></a>
                              <a href="#"><img src="https://los-static.s3.us-east-1.amazonaws.com/tv/s-icon/ic-linkedin.png" alt="LinkedIn" /></a>
                            </div>
                          </div>

                          <div className="info-v2">
                            <h3 className="profession-v2">Profession</h3>
                            <h1 className="name-v2">Your Name</h1>
                            <p><span>Phone:</span> <a href="tel:1234567891">1234567891</a></p>
                            <p><span>Email:</span> <a href="mailto:xyz@gmail.com">xyz@gmail.com</a></p>
                            <p><span>Website:</span> <a href="https://xyz.com">https://xyz.com</a></p>
                            <p><span>Company:</span> <span className="blue">XYZ</span></p>
                            <p><span>Address:</span> <span className="blue">XYZ</span></p>
                          </div>
                        </div>

                        <div className="buttons-v2">
                          <a href="tel:1234567890" className="btn-v2 purple"><img src="https://los-static.s3.us-east-1.amazonaws.com/tv/s-icon/call-phone.png" /> Contact Us</a>
                          <a href="#" className="btn-v2 blue"><img src="https://los-static.s3.us-east-1.amazonaws.com/tv/s-icon/star.png" /> Join Zoom</a>
                          <a href="#" className="btn-v2 orange"><img src="https://los-static.s3.us-east-1.amazonaws.com/tv/s-icon/star.png" /> Visit Website</a>
                        </div>
                      </div>
                      <div className="card">
                        <div className="card-content">
                          <div className="profile-img">
                            <img src="https://loanofficersupport.s3.amazonaws.com/pimgs/18140800618image_6809d9cce7e92.png" alt="Profile" />
                          </div>

                          <div className="info">
                            <h3 className="profession">Profession</h3>
                            <h1 className="name">Your Name</h1>
                            <p><span>Phone:</span><a href="tel:1234567891">1234567891</a></p>
                            <p><span>Email:</span><a href="mailto:xyz@gmail.com">xyz@gmail.com</a></p>
                            <p><span>Website:</span><a href="https://xyz.com">https://xyz.com</a></p>
                            <p><span>Company:</span><span className="blue">XYZ</span></p>
                            <p><span>Address:</span><span className="blue">XYZ</span></p>
                          </div>

                          <div className="social">
                            <a href="#"><img src="https://los-static.s3.us-east-1.amazonaws.com/tv/s-icon/ic-facebook.png" alt="Facebook" /></a>
                            <a href="#"><img src="https://los-static.s3.us-east-1.amazonaws.com/tv/s-icon/ic-twitter.png" alt="Twitter" /></a>
                            <a href="#"><img src="https://los-static.s3.us-east-1.amazonaws.com/tv/s-icon/ic-skype.png" alt="Skype" /></a>
                            <a href="#"><img src="https://los-static.s3.us-east-1.amazonaws.com/tv/s-icon/ic-whatsapp.png" alt="WhatsApp" /></a>
                            <a href="#"><img src="https://los-static.s3.us-east-1.amazonaws.com/tv/s-icon/ic-linkedin.png" alt="LinkedIn" /></a>
                          </div>
                        </div>

                        <div className="buttons">
                          <a href="tel:1234567890" className="btn purple"><img src="https://los-static.s3.us-east-1.amazonaws.com/tv/s-icon/call-phone.png" />Contact Us</a>
                          <a href="#" className="btn blue"><img src="https://los-static.s3.us-east-1.amazonaws.com/tv/s-icon/star.png" />Join Zoom</a>
                          <a href="#" className="btn orange"><img src="https://los-static.s3.us-east-1.amazonaws.com/tv/s-icon/star.png" />Visit Website</a>
                        </div>
                      </div>
                      <div className="card card-v2">
                        <div className="card-content-v2">
                          <div className="left-v2">
                            <img
                              src="https://loanofficersupport.s3.amazonaws.com/pimgs/18140800618image_6809d9cce7e92.png"
                              alt="Profile"
                              className="profile-img-v2"
                            />
                            <div className="social-icons-v2">
                              <a href="#"><img src="https://los-static.s3.us-east-1.amazonaws.com/tv/s-icon/ic-facebook.png" alt="Facebook" /></a>
                              <a href="#"><img src="https://los-static.s3.us-east-1.amazonaws.com/tv/s-icon/ic-twitter.png" alt="Twitter" /></a>
                              <a href="#"><img src="https://los-static.s3.us-east-1.amazonaws.com/tv/s-icon/ic-skype.png" alt="Skype" /></a>
                              <a href="#"><img src="https://los-static.s3.us-east-1.amazonaws.com/tv/s-icon/ic-whatsapp.png" alt="WhatsApp" /></a>
                              <a href="#"><img src="https://los-static.s3.us-east-1.amazonaws.com/tv/s-icon/ic-linkedin.png" alt="LinkedIn" /></a>
                            </div>
                          </div>

                          <div className="info-v2">
                            <h3 className="profession-v2">Profession</h3>
                            <h1 className="name-v2">Your Name</h1>
                            <p><span>Phone:</span> <a href="tel:1234567891">1234567891</a></p>
                            <p><span>Email:</span> <a href="mailto:xyz@gmail.com">xyz@gmail.com</a></p>
                            <p><span>Website:</span> <a href="https://xyz.com">https://xyz.com</a></p>
                            <p><span>Company:</span> <span className="blue">XYZ</span></p>
                            <p><span>Address:</span> <span className="blue">XYZ</span></p>
                          </div>
                        </div>

                        <div className="buttons-v2">
                          <a href="tel:1234567890" className="btn-v2 purple"><img src="https://los-static.s3.us-east-1.amazonaws.com/tv/s-icon/call-phone.png" /> Contact Us</a>
                          <a href="#" className="btn-v2 blue"><img src="https://los-static.s3.us-east-1.amazonaws.com/tv/s-icon/star.png" /> Join Zoom</a>
                          <a href="#" className="btn-v2 orange"><img src="https://los-static.s3.us-east-1.amazonaws.com/tv/s-icon/star.png" /> Visit Website</a>
                        </div>
                      </div> */}

                    </div>


                  </motion.div>
                </motion.div>
              )}
            </div>
          </div>
          {isMobile && <MobileNavbar />}
        </div>
      </SidebarProvider>
    </>
  );
};

export default CreateSignaturePage;
