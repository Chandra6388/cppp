import React, { useState, useEffect, useRef } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/layout/Header";
import MainSidebar from "@/components/layout/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Circle, CheckCircle2, BanIcon, Clock, TicketPlus, Search, Plus, Filter, User } from "lucide-react";
import TicketDetailModal from "@/components/modals/TicketDetailModal";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { changeStatus, } from '@/service/admin/supportTickets.service'
import { getAllSupportTicket } from '@/service/User/supportChatService'
import { AllTickets, } from '../../Utils/AdminIntrface'
import socket from "@/socket";
const TicketsPage = () => {
  const isMobile = useIsMobile();
  const UserDetails = JSON.parse(localStorage.getItem("user"))
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedTicket, setSelectedTicket] = useState<AllTickets | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [allSupportTicket, setAllSupportTicket] = useState<AllTickets[]>([]);
  const [changeStatusModal, setchangestatusModal] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string>("Open");
  useEffect(() => {
    if (selectedTicket?.status) {
      setSelectedStatus(selectedTicket.status);
    }
  }, [selectedTicket]);

  useEffect(() => {
    getTickets()
    if (!detailModalOpen) {
      setSelectedTicket(null);
    }
  }, [detailModalOpen])



  const getTickets = async () => {
    const req = { userId: UserDetails?._id }
    await getAllSupportTicket(req)
      .then((res) => {
        if (res.status) {
          setAllSupportTicket(res.data)
        }
        else {
          setAllSupportTicket([])
        }
      })
      .catch((error) => {
        console.log("error in fatching tickets", error)
      })
  }
  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleOpenTicket = (ticket: AllTickets) => {
    setSelectedTicket(ticket);
    setDetailModalOpen(true);
    socket.emit("mark-seen", { ticketId: ticket._id, userId: UserDetails._id });
    setAllSupportTicket((prev) =>
      prev.map((t) =>
        t._id === ticket._id ? { ...t, unseenCount: 0 } : t
      )
    );
  };

  const handleStatusChange = (ticketId: string, newStatus: AllTickets["status"]) => {
    const updatedTickets = allSupportTicket.map(ticket => {
      if (ticket._id === ticketId) {
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const statusMessage = {
          text: `Ticket status changed from "${ticket.status}" to "${newStatus}"`,
          isUser: false,
          time: currentTime
        };
        return {
          ...ticket,
          status: newStatus,
          messages: [
            ...(ticket.message || ""),
            statusMessage
          ]
        };
      }
      return ticket;
    });

    localStorage.setItem("tickets", JSON.stringify(updatedTickets));

    if (selectedTicket && selectedTicket._id === ticketId) {

    }

    toast({
      title: "Status updated",
      description: `Ticket #${ticketId.slice(0, 5)} status changed to ${newStatus}`,
      variant: "success",
      duration: 1000,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open':
        return <Circle className="h-4 w-4 text-blue-400" />;
      case 'Progress':
        return <Clock className="h-4 w-4 text-amber-400" />;
      case 'Resolved':
        return <CheckCircle2 className="h-4 w-4 text-green-400" />;
      case 'Closed':
        return <BanIcon className="h-4 w-4 text-gray-400" />;
      default:
        return <Circle className="h-4 w-4 text-blue-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return "bg-blue-500/20 text-blue-300";
      case 'Progress':
        return "bg-amber-500/20 text-amber-300";
      case 'Resolved':
        return "bg-green-500/20 text-green-300";
      case 'Closed':
        return "bg-gray-500/20 text-gray-300";
      default:
        return "bg-blue-500/20 text-blue-300";
    }
  };

  const handleSubmit = async (id: string, status: string) => {
    const req = { _id: id, status: status }
    await changeStatus(req)
      .then((res) => {
        if (res.status) {
          toast({
            title: "Success",
            description: res.message,
            variant: "success",
            duration: 1000,
          });
          setchangestatusModal(false)
          getTickets()
          setDetailModalOpen(false);
          setSelectedStatus("")
          setSelectedTicket(null)

        }
        else {
          toast({
            title: "error",
            description: res.message,
            variant: "destructive",
            duration: 1000,
          });
        }
      })
      .catch((error) => {
        console.log("error in change status", error)
      })
  }

  const filteredTickets = allSupportTicket?.filter(ticket => {
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

  useEffect(() => {
    if (!UserDetails?._id) return;
    socket.emit("join-user", UserDetails._id);
    socket.on("unseen-message-count", ({ ticketId, count }) => {
      setAllSupportTicket((prev) =>
        prev.map((ticket) =>
          ticket._id === ticketId
            ? { ...ticket, unreadMessageCount: count }
            : ticket
        )
      );
    });
    return () => {
      socket.off("unseen-message-count");
    };
  }, []);

  console.log("isMsdddobile",  useIsMobile())
  

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex w-full min-h-screen bg-[#001430] font-sans">
        <MainSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} onCollapseChange={handleSidebarCollapseChange} />
        <div
          className="flex flex-col flex-1 transition-all duration-300 ease-in-out"
          style={{ width: "100%", marginLeft: isMobile ? 0 : sidebarCollapsed ? '70px' : '250px' }} >
          <Header onMenuClick={handleMenuClick} />
          <div className="flex flex-col p-4 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <h1 className="text-white text-xl font-semibold">My Support Tickets</h1>
                <p className="text-gray-400 text-sm">Manage and track your support requests</p>
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
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <div className="px-4">
                  <TabsList className="bg-[#07234A] mt-4">
                    <TabsTrigger value="all">All Tickets</TabsTrigger>
                    <TabsTrigger value="Open">Open</TabsTrigger>
                    <TabsTrigger value="Progress">In Progress</TabsTrigger>
                    <TabsTrigger value="Resolved">Resolved</TabsTrigger>
                    <TabsTrigger value="Closed">Closed</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value={activeTab} className="p-4">
                  {filteredTickets?.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400 mb-4">No tickets found matching your criteria.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredTickets?.map((ticket) => (
                        <div
                          key={ticket?._id}
                          className="relative border border-[#112F59] rounded-lg p-4 cursor-pointer hover:border-[#01C8A9] transition-colors"
                          onClick={() => handleOpenTicket(ticket)}
                        >
                          {ticket.unreadMessageCount > 0 && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                              {ticket.unreadMessageCount}
                            </div>
                          )}
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(ticket?.status)}
                              <h3 className="text-white font-medium">{ticket?.subject}</h3>
                            </div>
                            <Badge className={getStatusColor(ticket?.status)}>
                              {ticket?.status?.replace('-', ' ').split(' ').map(word =>
                                word?.charAt(0)?.toUpperCase() + word?.slice(1)
                              ).join(' ')}
                            </Badge>
                          </div>
                          <p className="text-gray-400 text-sm mt-2 line-clamp-2">{ticket?.message}</p>
                          <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                            <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                            {ticket?.category ? <span className="bg-[#07234A] px-2 py-0.5 rounded">{ticket?.category}</span> : ""}
                          </div>
                          <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                            <span>Messages: {ticket?.chatHistory?.length}</span>
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
      {selectedTicket && (
        <TicketDetailModal
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
          ticket={selectedTicket}
          onStatusChange={handleStatusChange}
          changeStatusModal={changeStatusModal}
          setchangestatusModal={setchangestatusModal}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          handleSubmit={handleSubmit}
          employeeName={UserDetails?.Username}
          type="user"
        />
      )}
    </SidebarProvider>
  );
};

export default TicketsPage;
