import React, { useState, useEffect, useRef } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/layout/Header";
import MainSidebar from "@/components/layout/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import { Search, Send } from "lucide-react";
import { Tabs, TabsContent, } from "@/components/ui/tabs";
import { getAllContactUsFrom } from '@/service/admin/ContactUsService'
import { Button } from '@/components/ui/button'
const ContactUs = () => {
    const isMobile = useIsMobile();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<string>("all");
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [allContactUsFrom, setAllContactUsFrom] = useState([]);


    useEffect(() => {
        getAllContactUs()
    }, [])

    const getAllContactUs = async () => {
        const req = {}
        await getAllContactUsFrom(req)
            .then((res) => {
                if (res.status) {
                    setAllContactUsFrom(res.data)
                }
                else {
                    setAllContactUsFrom([])
                }
            })
            .catch((error) => {
                console.log("error in fatching tickets", error)
            })
    }

    const handleMenuClick = () => {
        setSidebarOpen(true);
    };


    const filteredTickets = allContactUsFrom?.filter(ticket => {
        const matchesSearch =
            ticket?.subject?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
            ticket?.message?.toLowerCase()?.includes(searchQuery?.toLowerCase())
        ticket?.category?.toLowerCase()?.includes(searchQuery?.toLowerCase());

        if (activeTab === "all") return matchesSearch;
        return matchesSearch && ticket?.status === activeTab;
    });

    const handleSidebarCollapseChange = (collapsed: boolean) => {
        setSidebarCollapsed(collapsed);
    };

    const anchorRef = useRef(null);

    const handleClick = (email: string) => {
        if (email) {
          const gmailLink = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(email)}`;
          window.open(gmailLink, "_blank");
        } else {
          alert("No email address available.");
        }
      };
      


    return (
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
                        marginLeft: isMobile ? 0 : sidebarCollapsed ? '70px' : '250px'
                    }}
                >
                    <Header onMenuClick={handleMenuClick} />

                    <div className="flex flex-col p-4 sm:p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                            <div>
                                <h1 className="text-white text-xl font-semibold">Contact Us</h1>
                                <p className="text-gray-400 text-sm">Manage and track your contact us requests</p>
                            </div>
                        </div>

                        <div className="bg-[#031123] border border-[#112F59] rounded-lg overflow-hidden">
                            <div className="p-4 border-b border-[#112F59]">
                                <div className="flex flex-col md:flex-row gap-4 justify-end">
                                    <div className="relative w-full md:w-[25%]">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                        <Input
                                            placeholder="Search tickets..."
                                            className="pl-9 bg-[#07234A] border-[#112F59] text-white w-full"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <Tabs defaultValue="all">
                                <TabsContent value={"all"} className="p-4">
                                    {filteredTickets?.length === 0 ? (
                                        <div className="text-center py-8">
                                            <p className="text-gray-400 mb-4">No tickets found matching your criteria.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {filteredTickets?.map((item) => (
                                                <div
                                                    key={item?._id}
                                                    className="border border-[#112F59] rounded-lg p-4 cursor-pointer hover:border-[#01C8A9] transition-colors"

                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="text-white font-medium">{item?.name} | <span>{item?.email}</span></h3>
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-400 text-sm mt-2 line-clamp-2">{item?.message}</p>
                                                    <div className="flex justify-between">
                                                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                                                            <span>Created: {new Date(item.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                        <Button
                                                            onClick={() => handleClick(item?.email)}
                                                            className="bg-gradient-to-r from-[#01C8A9] to-[#01a088] text-white"
                                                        >
                                                            <Send className="mr-2" />
                                                            Send Email
                                                        </Button>

                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>

        </SidebarProvider>
    );
};

export default ContactUs;
