import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { X, SendHorizontal, Circle, CheckCircle2, BanIcon, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { TicketDetailModalProps, Message } from "../../../Utils/AdminIntrface";
import { getPriorityColor, getStatusColor, formatDate, getChatTime } from "../../../Utils/CommonFunctions";
import socket from "@/socket";
import { getChatHistory } from "@/service/employee/ticketService";



const TicketDetailModal: React.FC<TicketDetailModalProps> = ({ open, onOpenChange, ticket, onStatusChange, setchangestatusModal, changeStatusModal, selectedStatus, setSelectedStatus, handleSubmit, employeeName, type, }) => {
  const [isTyping, setIsTyping] = useState(false);
  const [getAllChats, setAllChat] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const UserDetails = JSON.parse(localStorage.getItem('user') || '{}');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isSending, setIsSending] = useState(false);
const handleStatusChange = () => {
    setchangestatusModal(true)
  };
  const chatHistory = async () => {
    const req = { ticketId: ticket?._id };
    try {
      const res = await getChatHistory(req);
      if (res?.status) setAllChat(res.data || []);
      else console.error("Failed to fetch chat history:", res?.message);
    } catch (err) {
      console.error("Error fetching chat history:", err);
    }
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

  useEffect(() => {
    if (ticket) chatHistory();
  }, [ticket]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [getAllChats]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || isSending) return;
    setIsSending(true);

    const userMessage: Message = {
      ticketId: ticket?._id,
      reciverId: type === "user" ? ticket?.assignee : ticket?.userId,
      senderId: UserDetails?._id,
      text: newMessage,
      sender: type,
      timestamp: new Date(),

    };

    setNewMessage('');
    setIsTyping(true);
    socket.emit("support_message", { chatDetails: userMessage });
    setTimeout(() => setIsSending(false), 1000);
  };

  useEffect(() => {
    socket.on("receive_support_message", (supportMessage: Message) => {
      setIsTyping(false);
      const formattedMessage = {
        ...supportMessage,
        timestamp: new Date(supportMessage.timestamp)
      };
      setAllChat(prev => [...prev, formattedMessage]);
    });

    socket.on("typingsuport", ({ senderId }) => {
      if (senderId !== UserDetails?._id) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    });

    socket.on("messages_marked_as_read", ({ ticketId: updatedTicketId, readerType }) => {
      if (updatedTicketId === ticket?._id) {
        setAllChat((prevChats) =>
          prevChats.map((msg) =>
            msg.sender !== readerType ? { ...msg, isRead: true } : msg
          )
        );
      }
    });

    return () => {
      socket.off("receive_support_message");
      socket.off("typingsuport");
      socket.off("messages_marked_as_read");
    };
  }, [ticket?._id]);

  useEffect(() => {
    if (ticket?._id) {
      socket.emit("join_ticket", { ticketId: ticket._id });
    }
  }, [ticket?._id]);

  useEffect(() => {
    if (open && ticket?._id && getAllChats.length > 0 && type) {
      const payload = {
        ticketId: ticket._id,
        readerType: type,
        reciverId: type === "user" ? ticket?.assignee : ticket?.userId,
      };
      socket.emit("mark_as_read", payload);
    }
  }, [open, ticket?._id, type, getAllChats.length]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-[#001430] border-[#112F59] p-0 overflow-hidden sm:max-w-xl">
          <DialogHeader className="p-0">
            <div className="flex items-center justify-between w-full bg-[#001430] p-6 border-b border-[#112F59]">
              <div>
                <h2 className="text-white text-xl font-medium flex items-center gap-2">
                  {getStatusIcon(ticket.status)}
                  <span>Ticket</span>
                </h2>
                <p className="text-[#8B8B8B] text-sm mt-0.5">{ticket.subject}</p>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="text-white hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
          </DialogHeader>
          <div className="flex flex-col">
            <div className="px-6 border-b border-[#112F59]">

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[#8B8B8B]">Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </Badge>
                    {onStatusChange && ticket?.status !== 'Closed' && type == "support" && (
                      <div className="dropdown relative">
                        <Button
                          variant="darkOutline"
                          size="sm"
                          className="h-6 text-xs py-0"
                          onClick={handleStatusChange}
                        >
                          Change
                        </Button>
                        <div className="dropdown-content absolute hidden bg-[#031123] border border-[#112F59] rounded-md p-1 z-10">
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {type == "support" && <div>
                  <p className="text-[#8B8B8B]">Priority</p>
                  <p className={`font-medium ${getPriorityColor(ticket?.priority)}`}>
                    {ticket?.priority?.charAt(0)?.toUpperCase() + ticket?.priority?.slice(1)}
                  </p>
                </div>}
                <div>
                  <p className="text-[#8B8B8B]">Category</p>
                  <p className="text-white">{ticket.category}</p>
                </div>
                <div>
                  <p className="text-[#8B8B8B]">Created</p>
                  <p className="text-white">{formatDate(ticket.createdAt)}</p>
                </div>
                {ticket?.assignee && (
                  <div className="col-span-2">
                    <p className="text-[#8B8B8B]">Assigned To</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-white">{employeeName}</p>
                    </div>
                  </div>
                )}
              </div>
                <div className="mt-4">
                <p className="text-[#8B8B8B] mb-1">Description</p>
                <p className="text-white text-sm">{ticket?.message}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4" ref={chatContainerRef} style={{ maxHeight: "200px" }}>
                {getAllChats.length ? (
                  <>
                    {getAllChats.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${type === "support"
                          ? message.sender === "support" ? "justify-end" : "justify-start"
                          : message.sender === "support" ? "justify-start" : "justify-end"}`}
                      >
                        <div className={`flex gap-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className={message.sender === "user" ? "bg-[#01C8A9] text-white" : "bg-blue-500 text-white"}>
                              {message.sender === "user" ? 'U' : 'S'}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`p-3 rounded-lg ${message.sender === "user" ? "bg-[#01C8A9] text-white" : "bg-[#07234A] text-white border border-[#112F59]"}`}>
                            <p className="text-sm">{message.text}</p>
                            <span className={`text-xs block mt-1 ${message.sender === "user" ? "text-white/70" : "text-gray-400"}`}>
                              {getChatTime(message.timestamp)}
                            </span>
                          </div>
                          {message.senderId === UserDetails?._id && (
                            <span className={`text-xs block mt-1 ${message.isRead ? "text-white/70" : "text-gray-400"}`}>
                              {message.isRead ? "Read" : "Unread"}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className={`flex ${type === "support" ? "justify-start" : "justify-end"} mt-2`}>
                        <div className="flex gap-2 max-w-[80%]">
                          <div className="p-3 rounded-lg bg-[#07234A] border border-[#112F59]">
                            <div className="flex items-center">
                              <span className="typing-dot"></span>
                              <span className="typing-dot"></span>
                              <span className="typing-dot"></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No messages yet. Start the conversation by sending a message.</p>
                  </div>
                )}
              </div>
              {type === "user" && (ticket?.status === "Open" || ticket?.status === "Closed") ? null : (
                <div className="p-4 border-t border-[#112F59]">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => {
                        setNewMessage(e.target.value);
                        socket.emit("typing", { ticketId: ticket?._id, senderId: UserDetails?._id });
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your message..."
                      className="flex-1 bg-[#07234A] border-[#112F59] text-white"
                    />
                    <Button
                      type="button"
                      variant="teal"
                      onClick={handleSendMessage}
                      size="icon"
                      disabled={ticket.status === 'closed'}
                    >
                      <SendHorizontal size={18} />
                    </Button>
                  </div>
                  {ticket.status === 'closed' && (
                    <p className="text-amber-400 text-xs mt-2">This ticket is closed. You cannot send new messages.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {type == "support" && <Dialog open={changeStatusModal} onOpenChange={() => setchangestatusModal(!changeStatusModal)}>
        <DialogContent className="bg-[#001430] border-[#112F59] p-0 overflow-hidden sm:max-w-xl">
          <DialogHeader className="p-0">
            <div className="flex items-center justify-between w-full bg-[#001430] p-6 border-b border-[#112F59]">
              <div>
                <h2 className="text-white text-xl font-medium flex items-center gap-2">Change Status</h2>
              </div>
              <button
                onClick={() => setchangestatusModal(false)}
                className="text-white hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
          </DialogHeader>

          <div className="p-6">
            <div>
              <div className="space-y-4">

                <label className="text-[#8B8B8B]">Change To</label>
                <div>
                  <select
                    className="w-full h-10 rounded-md border border-[#112F59] bg-[#001430] px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#01C8A9] focus:ring-offset-2"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="Open">Open</option>
                    <option value="Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <Button
                  variant="teal"
                  className="w-full my-4"
                  onClick={() => handleSubmit(ticket._id, selectedStatus)}
                >
                  Change
                </Button>

              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>}
    </>
  );
};

export default TicketDetailModal;