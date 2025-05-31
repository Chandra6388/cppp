import React, { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/layout/Header";
import MainSidebar from "@/components/layout/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Circle, CheckCircle2, BanIcon, Clock, TicketPlus, Search, Plus, Filter } from "lucide-react";
import CreateTicketModal from "@/components/modals/CreateTicketModal";
import TicketDetailModal from "@/components/modals/TicketDetailModal";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  category: string;
  createdAt: string;
  messages?: {
    text: string;
    isUser: boolean;
    time: string;
  }[];
  assignee?: string;
}

const TicketsPage = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [createTicketModalOpen, setCreateTicketModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Load tickets from localStorage on component mount
    const storedTickets = localStorage.getItem("tickets");
    if (storedTickets) {
      setTickets(JSON.parse(storedTickets));
    } else {
      // Example data if no tickets exist
      const exampleTickets: Ticket[] = [
        {
          id: "ticket1",
          title: "Need help with configuring my email signature",
          description: "I'm trying to add my company logo to my signature but it doesn't show up correctly in Outlook.",
          status: "open",
          priority: "medium",
          category: "Technical Support",
          createdAt: new Date().toISOString(),
          messages: [
            {
              text: "Hello, I'm having trouble with my logo not displaying correctly in Outlook. Can someone help me?",
              isUser: true,
              time: "10:30 AM"
            }
          ]
        },
        {
          id: "ticket2",
          title: "Billing question about subscription",
          description: "I was charged twice for my monthly subscription and need a refund for the duplicate payment.",
          status: "in-progress",
          priority: "high",
          category: "Billing",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          assignee: "Sarah Thompson",
          messages: [
            {
              text: "I noticed I was charged twice this month for my subscription. Could you please investigate?",
              isUser: true,
              time: "Yesterday, 3:45 PM"
            },
            {
              text: "I've looked into your account and confirmed the duplicate charge. I'll process a refund right away.",
              isUser: false,
              time: "Yesterday, 4:30 PM"
            },
            {
              text: "Thank you! How long will the refund take to process?",
              isUser: true,
              time: "Yesterday, 4:45 PM"
            }
          ]
        },
        {
          id: "ticket3",
          title: "Feature request: Add social media icons",
          description: "I would like to request a new feature where we can add custom social media icons to our signatures.",
          status: "resolved",
          priority: "low",
          category: "Feature Request",
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          messages: [
            {
              text: "Hi, I would love to see a feature that allows us to add custom social media icons to our signatures.",
              isUser: true,
              time: "2 days ago"
            },
            {
              text: "Thanks for your suggestion! We've added this to our feature request list and our product team is reviewing it.",
              isUser: false,
              time: "2 days ago"
            },
            {
              text: "Great news! This feature has been approved and will be included in our next update.",
              isUser: false,
              time: "Today, 9:15 AM"
            }
          ]
        }
      ];
      setTickets(exampleTickets);
      localStorage.setItem("tickets", JSON.stringify(exampleTickets));
    }
  }, []);

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleCreateTicket = (ticket: Ticket) => {
    const newTickets = [...tickets, ticket];
    setTickets(newTickets);

    // Save to localStorage
    localStorage.setItem("tickets", JSON.stringify(newTickets));

    toast({
      title: "Ticket created",
      description: `Ticket #${ticket.id.slice(0, 5)} has been created successfully.`,
      variant: "success",
      duration: 1000,
    });
  };

  const handleOpenTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setDetailModalOpen(true);
  };

  const handleSendTicketMessage = (ticketId: string, message: string) => {
    if (!message.trim()) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === ticketId) {
        const updatedTicket = { ...ticket };
        if (!updatedTicket.messages) {
          updatedTicket.messages = [];
        }
        updatedTicket.messages = [
          ...updatedTicket.messages,
          { text: message, isUser: true, time: currentTime }
        ];

        // Simulate support response after a delay
        setTimeout(() => {
          const supportResponses = [
            "Thank you for your message. I'll look into this issue and get back to you shortly.",
            "I'm checking your ticket details. Please allow me some time to investigate.",
            "I understand your concern. Let me check our system and provide you with an update.",
            "Thanks for reaching out. I'm reviewing your ticket and will update you soon."
          ];
          const randomResponse = supportResponses[Math.floor(Math.random() * supportResponses.length)];

          setTickets(prevTickets => {
            const newTickets = prevTickets.map(t => {
              if (t.id === ticketId) {
                return {
                  ...t,
                  messages: [
                    ...(t.messages || []),
                    { text: randomResponse, isUser: false, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
                  ]
                };
              }
              return t;
            });

            // Update local storage
            localStorage.setItem("tickets", JSON.stringify(newTickets));

            return newTickets;
          });
        }, 1500);

        return updatedTicket;
      }
      return ticket;
    });

    setTickets(updatedTickets);
    localStorage.setItem("tickets", JSON.stringify(updatedTickets));
  };

  const handleStatusChange = (ticketId: string, newStatus: Ticket["status"]) => {
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === ticketId) {
        // Add a system message about status change
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
            ...(ticket.messages || []),
            statusMessage
          ]
        };
      }
      return ticket;
    });

    setTickets(updatedTickets);
    localStorage.setItem("tickets", JSON.stringify(updatedTickets));

    // Update the selected ticket if it's currently being viewed
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket(updatedTickets.find(t => t.id === ticketId) || null);
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
      case 'open':
        return <Circle className="h-4 w-4 text-blue-400" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-amber-400" />;
      case 'resolved':
        return <CheckCircle2 className="h-4 w-4 text-green-400" />;
      case 'closed':
        return <BanIcon className="h-4 w-4 text-gray-400" />;
      default:
        return <Circle className="h-4 w-4 text-blue-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return "bg-blue-500/20 text-blue-300";
      case 'in-progress':
        return "bg-amber-500/20 text-amber-300";
      case 'resolved':
        return "bg-green-500/20 text-green-300";
      case 'closed':
        return "bg-gray-500/20 text-gray-300";
      default:
        return "bg-blue-500/20 text-blue-300";
    }
  };

  // Filter tickets based on search query and active tab
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    return matchesSearch && ticket.status === activeTab;
  });

  const handleSidebarCollapseChange = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
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
            marginLeft: isMobile ? 0 : sidebarCollapsed ? '70px' : '230px'
          }}
        >
          <Header
            onMenuClick={handleMenuClick}

          />

          <div className="flex flex-col p-4 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <h1 className="text-white text-xl font-semibold">My Support Tickets</h1>
                <p className="text-gray-400 text-sm">Manage and track your support requests</p>
              </div>

              <Button
                variant="teal"
                className="flex items-center gap-2"
                onClick={() => setCreateTicketModalOpen(true)}
              >
                <Plus size={18} />
                Create New Ticket
              </Button>
            </div>

            <div className="bg-[#031123] border border-[#112F59] rounded-lg overflow-hidden">
              <div className="p-4 border-b border-[#112F59]">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <Input
                      placeholder="Search tickets..."
                      className="pl-9 bg-[#07234A] border-[#112F59] text-white w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="darkOutline" className="md:w-auto flex items-center gap-2">
                    <Filter size={16} />
                    Filter
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <div className="px-4">
                  <TabsList className="bg-[#07234A] mt-4">
                    <TabsTrigger value="all">All Tickets</TabsTrigger>
                    <TabsTrigger value="open">Open</TabsTrigger>
                    <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                    <TabsTrigger value="resolved">Resolved</TabsTrigger>
                    <TabsTrigger value="closed">Closed</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value={activeTab} className="p-4">
                  {filteredTickets.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400 mb-4">No tickets found matching your criteria.</p>
                      <Button
                        variant="teal"
                        onClick={() => setCreateTicketModalOpen(true)}
                        className="flex items-center gap-2"
                      >
                        <TicketPlus size={16} />
                        Create a New Ticket
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredTickets.map((ticket) => (
                        <div
                          key={ticket.id}
                          className="border border-[#112F59] rounded-lg p-4 cursor-pointer hover:border-[#01C8A9] transition-colors"
                          onClick={() => handleOpenTicket(ticket)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(ticket.status)}
                              <h3 className="text-white font-medium">{ticket.title}</h3>
                            </div>
                            <Badge className={getStatusColor(ticket.status)}>
                              {ticket.status.replace('-', ' ').split(' ').map(word =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                              ).join(' ')}
                            </Badge>
                          </div>

                          <p className="text-gray-400 text-sm mt-2 line-clamp-2">{ticket.description}</p>

                          <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                            <span>ID: #{ticket.id.slice(0, 5)}</span>
                            <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                            <span className={`
                              ${ticket.priority === 'low' ? 'text-green-400' :
                                ticket.priority === 'medium' ? 'text-yellow-400' :
                                  'text-red-400'}
                            `}>
                              {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)} Priority
                            </span>
                            <span className="bg-[#07234A] px-2 py-0.5 rounded">{ticket.category}</span>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {ticket.messages && (
                                <span className="text-xs text-gray-400">
                                  {ticket.messages.length} {ticket.messages.length === 1 ? 'message' : 'messages'}
                                </span>
                              )}
                            </div>
                            {ticket.assignee && (
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-400">Assigned to:</span>
                                <span className="text-xs text-white">{ticket.assignee}</span>
                              </div>
                            )}
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

      {/* Create Ticket Modal */}
      <CreateTicketModal
        open={createTicketModalOpen}
        onOpenChange={setCreateTicketModalOpen}
        onSubmit={handleCreateTicket}
      />

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <TicketDetailModal
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
          ticket={selectedTicket}
          onSendMessage={handleSendTicketMessage}
          onStatusChange={handleStatusChange}
        />
      )}
    </SidebarProvider>
  );
};

export default TicketsPage;
