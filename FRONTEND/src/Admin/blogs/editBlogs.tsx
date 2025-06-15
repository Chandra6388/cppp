import React, { useState, useRef, useMemo, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/layout/Header";
import MainSidebar from "@/components/layout/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useResponsiveSidebar } from "@/hooks/use-responsive-sidebar";
import MobileNavbar from "@/components/layout/MobileNavbar";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { NotebookPen, UploadCloud, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadImg } from "@/service/auth/auth.service";
import JoditEditor from "jodit-react";
import { sweetAlert } from "../../../Utils/CommonFunctions"
import { updateBlog, getBlogById } from "@/service/admin/blogService"
import { useLocation, useNavigate, Link } from "react-router-dom";

const EditBlogs = () => {
    const isMobile = useIsMobile();
    const location = useLocation()
    const editor = useRef(null);
    const navigate = useNavigate()
    const userdata = JSON.parse(localStorage.getItem('user'))
    const { sidebarOpen, setSidebarOpen, sidebarCollapsed, setSidebarCollapsed } = useResponsiveSidebar();
    const [uploading, setUploading] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [getBlogDetails, setBlogDetails] = useState([])
    const [formData, setFromData] = useState({
        title: "",
        description: "",
    })
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };



    useEffect(() => {
        getSingleBlog()
    }, [])


    const getSingleBlog = async () => {
        const req = { id: location?.state?.id }
        await getBlogById(req)
            .then((res) => {
                if (res.status) {
                    setBlogDetails(res?.data)
                    setUploadedImage(res?.data?.[0]?.image)
                    setFromData((prev) => ({
                        ...prev,
                        title: res?.data?.[0]?.title,
                        description: res?.data?.[0]?.discription
                    }));
                }
                else {
                    setBlogDetails([])

                }
            })
            .catch((error) => {
                console.log("Error in fetching blog data", error)
            })
    }

    const config1 = useMemo(() => ({
        readonly: false,
        placeholder: "",
        buttons:
            "bold,italic,underline,strikethrough,ul,ol,paragraph,fontsize,font,brush,link,image,video,table,align,undo,redo,cut,copy,paste,selectall",
        removeButtons: ["speechRecognize"],
        toolbarSticky: false
    }), []);

    const handleFileUpload = async (file: File) => {
        try {
            setUploading(true);
            if (editor.current && (editor.current as any).editor?.selection?.insertHTML) {
                (editor.current as any).editor.selection.insertHTML(
                    `<p style="color:#888">⏳ Uploading your image. Please wait...</p>`
                );
            }

            const uploadRes = await uploadImg({ file });
            if (uploadRes?.url) {
                setUploadedImage(uploadRes.url);
            } else {
                throw new Error("Upload failed: No URL returned");
            }
        } catch (err) {
            console.error("❌ Image upload failed:", err);
            if (editor.current) {
                (editor.current as any).editor.selection.insertHTML(
                    `<p style="color:red">❌Oops! Image upload failed. Please try again.</p>`
                );
            }
        } finally {
            setUploading(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) handleFileUpload(file);
    };

    const handleBrowse = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFileUpload(file);
    };


    const handleSubmitBlog = async () => {
        if (!formData?.title?.trim()) {
            sweetAlert("Warning!", "Please enter a title for your blog.", "warning", 2000);
        }
        if (!formData?.description?.trim()) {
            sweetAlert("Warning!", "Please write a description for your blog content.", "warning", 2000);
        }

        if (uploadedImage == null || uploadedImage == undefined || !uploadedImage.trim()) {
            sweetAlert("Warning!", "Please upload an image to feature in your blog.", "warning", 2000);
        }

        const req = {
            id: getBlogDetails?.[0]?._id,
            title: formData?.title,
            discription: formData?.description,
            image: uploadedImage
        }
        await updateBlog(req)
            .then((res) => {
                if (res.status) {
                    sweetAlert("success!", "🎉 Your blog has been Updated successfully!", "success", 2000);
                    setFromData({
                        title: "",
                        description: ""
                    })
                    navigate("/admin/all-blog")
                }
                else {
                    sweetAlert("Oops!", res?.message || "An unexpected error occurred.", "error", 2000);

                }
            })
            .catch((error) => {
                console.log("Error in adding new blog", error)
                sweetAlert("error!", "Something went wrong on our end. Please try again later.", "error", 2000);

            })
    }


    return (
        <SidebarProvider defaultOpen={!isMobile}>
            <div className="flex w-full min-h-screen bg-gradient-to-br from-[#001430] to-[#002040] font-sans">
                <MainSidebar
                    open={sidebarOpen}
                    onOpenChange={setSidebarOpen}
                    onCollapseChange={setSidebarCollapsed}
                    onCreateSignature={() => { }}
                />
                <div
                    className="flex flex-col flex-1 transition-all duration-300 ease-in-out"
                    style={{
                        width: "100%",
                        marginLeft: isMobile ? 0 : sidebarCollapsed ? "70px" : "250px",
                        paddingBottom: isMobile ? "80px" : "20px"
                    }}
                >
                    <Header onMenuClick={() => setSidebarOpen(true)} />

                    <div className="flex flex-col p-4 sm:p-6">
                        <Link to="/admin/all-blog" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors duration-300 mb-5"   >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Blog
                        </Link>

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 md:grid-cols-1 gap-6"
                        >
                            <motion.div variants={itemVariants} className="bg-[#031123] border border-[#112F59] rounded-lg p-6 shadow-lg">
                                <div className="flex items-center mb-4">
                                    <div className="w-10 h-10 rounded-full bg-[#01C8A9]/20 flex items-center justify-center mr-3">
                                        <NotebookPen className="text-[#01C8A9] w-5 h-5" />
                                    </div>
                                    <h3 className="text-white font-medium text-lg">Write a new blog</h3>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <Label className="text-gray-400">Title</Label>
                                        <Input name="title" onChange={(e) => setFromData(prev => ({ ...prev, title: e.target.value }))} value={formData?.title} className="bg-[#001430] border-[#112F59] text-white mt-1" />
                                    </div>

                                    <div
                                        onDrop={handleDrop}
                                        onDragOver={(e) => e.preventDefault()}
                                        className="border-2 border-dashed border-gray-400 p-6 rounded-md text-center bg-[#001430] text-white"
                                    >
                                        <div className="flex justify-center mb-2">
                                            {uploading ? (
                                                <div className="w-10 h-10 border-4 border-t-transparent border-[#01C8A9] rounded-full animate-spin" />
                                            ) : (
                                                <UploadCloud className="w-10 h-10 text-gray-300" />
                                            )}
                                        </div>
                                        <p className="text-lg text-gray-300">Drag & Drop files here</p>
                                        <p className="text-sm text-gray-500 mb-4">or</p>

                                        <label
                                            htmlFor="fileInput"
                                            className="inline-block bg-[#01C8A9] hover:bg-[#01a088] text-white font-semibold py-2 px-4 rounded-md cursor-pointer transition"
                                        >
                                            Browse Files
                                            <input
                                                id="fileInput"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleBrowse}
                                                className="hidden"
                                            />
                                        </label>

                                        {uploadedImage && (
                                            <div className="mt-4 flex justify-center">
                                                <div className="relative w-24 h-24 rounded border border-[#112F59] overflow-hidden">
                                                    <img
                                                        src={uploadedImage}
                                                        alt="Preview"
                                                        className="object-cover w-full h-full"
                                                    />
                                                    <button
                                                        onClick={() => setUploadedImage(null)}
                                                        className="absolute top-0 right-0 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-bl hover:bg-opacity-80"
                                                        aria-label="Remove image"
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="rounded-md overflow-hidden">
                                        <div>
                                            <Label htmlFor="message" className="text-gray-400">Description</Label>
                                            <div className="rounded-md overflow-hidden">
                                                <JoditEditor
                                                    ref={editor}
                                                    config={config1}
                                                    tabIndex={1}
                                                    name="description"
                                                    value={formData.description}
                                                    onChange={(newContent) =>
                                                        setFromData(prev => ({ ...prev, description: newContent }))
                                                    }
                                                />

                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handleSubmitBlog}
                                        className="w-full bg-gradient-to-r from-[#01C8A9] to-[#01a088] text-white"
                                    >
                                        Update Blog
                                    </Button>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>

                {isMobile && <MobileNavbar onCreateClick={() => { }} />}
            </div>
        </SidebarProvider>
    );
};

export default EditBlogs;
