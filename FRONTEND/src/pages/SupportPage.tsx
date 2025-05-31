import React, { useState, useRef, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/layout/Header";
import MainSidebar from "@/components/layout/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useResponsiveSidebar } from "@/hooks/use-responsive-sidebar";
import MobileNavbar from "@/components/layout/MobileNavbar";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send, HelpCircle, BookOpen, MessageCircle, Phone, Mail, Star, Clock, ChevronDown, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import socket from "@/socket";
import { getChatMessage } from "@/service/User/supportChatService";
import { getChatTime } from "../../Utils/CommonFunctions";
import { format, isToday, isYesterday } from "date-fns";
import { Faq } from "../../Utils/faq";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { createSupportTicket } from "@/service/User/supportChatService"
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'support';
  timestamp: Date;
}
interface FAQItem {
  id: string;
  question: string;
  answer: string;
  isOpen: boolean;
}

interface Supportform {
  userName: string,
  subject: string,
  issue: string,
}

const SupportPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const UserDetails = JSON.parse(localStorage.getItem("user") || '{}');
  const { sidebarOpen, setSidebarOpen, sidebarCollapsed, setSidebarCollapsed } = useResponsiveSidebar();
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [getAllChats, setAllChat] = useState<Message[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [faqItems, setFaqItems] = useState<FAQItem[]>(Faq);
  const [supportInput, setSupportInput] = useState<Supportform>({ userName: "", subject: "", issue: "" })

  const mockUserContext = {
    userId: UserDetails._id,
    name: UserDetails.Username,
    subscriptionExpiryDate: "2025-07-15",
    isPro: true,
    signatureCount: 3,
    lastSignature: {
      name: "Business Professional",
      createdAt: "2025-04-20"
    }
  };

  useEffect(() => {
    const allChatMessage = async () => {
      const req = { userId: UserDetails._id };
      try {
        const res = await getChatMessage(req);
        if (res.status) {
          const formatted = res.data.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          setAllChat(formatted);
        }
      } catch (err) {
        console.log("error in fetching the chats", err);
      }
    };
    allChatMessage();
  }, []);

  useEffect(() => {
    socket.on("typing", () => setIsTyping(true));
    socket.on("receive_message", (supportMessage: Message) => {
      setIsTyping(false);
      const formattedMessage = {
        ...supportMessage,
        timestamp: new Date(supportMessage.timestamp)
      };
      setAllChat(prev => [...prev, formattedMessage]);
    });
    return () => {
      socket.off("typing");
      socket.off("receive_message");
    };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [getAllChats]);

  const handleSendMessage = () => {
    if (messageInput.trim() === '') return;
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageInput,
      sender: 'user',
      timestamp: new Date(),
    };
    setAllChat(prev => [...prev, userMessage]);
    setMessageInput('');
    setIsTyping(true);
    socket.emit("send_message", {
      message: messageInput,
      userContext: mockUserContext,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "dd MMM yyyy");
  };

  const groupedMessages = getAllChats.reduce((acc: Record<string, Message[]>, message) => {
    const dateKey = new Date(message.timestamp).toDateString(); // e.g. "Thu May 23 2025"
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(message);
    return acc;
  }, {});

  const handleChange = (e: any) => {
    const { name, value } = e?.target;
    setSupportInput((prev: any) => ({
      ...prev,
      [name]: value,
    }));
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

  const toggleFAQ = (id: string) => {
    setFaqItems(items => items.map(item =>
      item.id === id ? { ...item, isOpen: !item.isOpen } : item
    ));
  };

  const handleSubmitTicket = async () => {
    const { subject, userName, issue } = supportInput;

    if (!subject.trim()) {
      toast({
        title: "Missing Subject",
        description: "Please enter a subject for your support ticket.",
        variant: "destructive",
        duration: 1000,
      });
      return;
    }

    if (!userName.trim()) {
      toast({
        title: "Missing Username",
        description: "Please enter your name so we can identify you.",
        variant: "destructive",
      });
      return;
    }

    if (!issue.trim()) {
      toast({
        title: "Missing Issue Description",
        description: "Please describe the issue you're facing.",
        variant: "destructive",
      });
      return;
    }

    const req = { userId: UserDetails?._id, userName: userName, subject: subject, message: issue }
    await createSupportTicket(req)
      .then((res) => {
        if (res.status) {
          toast({
            title: "Message sent",
            description: res?.message,
            variant: "success",
            duration: 1000,
          });
          setSupportInput({ userName: "", subject: "", issue: "" })
        }
        else {
          toast({
            title: "error",
            description: res?.message,
            variant: "destructive",
            duration: 1000,
          });
        }
      })
      .catch((error) => {
        console.log("error in creating new ticket", error)
      })
  };

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
            marginLeft: isMobile ? 0 : sidebarCollapsed ? '70px' : '230px',
            paddingBottom: isMobile ? '80px' : '20px'
          }}
        >
          <Header onMenuClick={() => setSidebarOpen(true)} />

          <div className="flex flex-col p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-6">
              <HelpCircle className="text-[#01C8A9] w-6 h-6" />
              <h1 className="text-white text-xl font-semibold">Help & Support</h1>
            </div>

            <Tabs defaultValue="chat" className="w-full">
              <TabsList className="bg-[#031123]/80 border border-[#112F59] mb-6">
                <TabsTrigger value="chat" className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>Live Chat</span>
                </TabsTrigger>
                <TabsTrigger value="faq" className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>FAQs</span>
                </TabsTrigger>
                <TabsTrigger value="contact" className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <span>Contact</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chat">
                <div className="bg-[#031123] border border-[#112F59] rounded-lg shadow-lg overflow-hidden h-[600px] flex flex-col">
                  <div className="bg-gradient-to-r from-[#01C8A9]/30 to-[#3B82F6]/30 p-4 border-b border-[#112F59]">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-[#01C8A9]/20 flex items-center justify-center mr-3">
                        <MessageCircle className="text-[#01C8A9] w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">Support Chat</h3>
                        <p className="text-xs text-gray-400 flex items-center">
                          <span className="w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse"></span>
                          Support Agent Online
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#031123]"
                  >
                    {Object.entries(groupedMessages).map(([date, messages]) => (
                      <div key={date}>
                        <div className="text-center text-sm text-gray-400 mb-2">
                          {getDateLabel(new Date(date))}
                        </div>
                        {messages.map((message) => (
                          <div key={message.id} className={`flex mb-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}   >
                            <div
                              className={`max-w-[80%] p-3 rounded-lg ${message.sender === 'user'
                                ? 'bg-[#01C8A9]/20 text-white ml-auto'
                                : 'bg-[#112F59]/50 text-white mr-auto'
                                }`}
                            >
                              <p>{message.content}</p>
                              <p className="text-xs text-gray-400 mt-1 text-right">
                                {getChatTime(message.timestamp)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}


                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-[#112F59]/50 px-4 py-2 rounded-lg text-white max-w-[80%]">
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4 border-t border-[#112F59] bg-[#031123]">
                    <div className="flex items-center">
                      <Input
                        type="text"
                        placeholder="Type your message here..."
                        className="flex-1 bg-[#001430] border-[#112F59] text-white"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                      />
                      <Button
                        onClick={handleSendMessage}
                        className="ml-2 bg-gradient-to-r from-[#01C8A9] to-[#01a088] text-white"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="faq">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6"
                >
                  <motion.div variants={itemVariants} className="bg-[#031123] border border-[#112F59] rounded-lg shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-[#01C8A9]/30 to-[#3B82F6]/30 p-4">
                      <h3 className="text-white font-medium text-lg flex items-center">
                        <BookOpen className="mr-2 text-[#01C8A9] w-5 h-5" />
                        Frequently Asked Questions
                      </h3>
                    </div>

                    <div className="divide-y divide-[#112F59]">
                      {faqItems.map((item) => (
                        <div key={item.id} className="p-4">
                          <button
                            onClick={() => toggleFAQ(item.id)}
                            className="flex justify-between items-center w-full text-left text-white font-medium hover:text-[#01C8A9] transition-colors"
                          >
                            <span>{item.question}</span>
                            {item.isOpen ? (
                              <ChevronDown className="w-5 h-5 text-[#01C8A9]" />
                            ) : (
                              <ChevronRight className="w-5 h-5" />
                            )}
                          </button>

                          {item.isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              transition={{ duration: 0.3 }}
                              className="mt-2 text-gray-400 pl-5 border-l-2 border-[#112F59]"
                            >
                              <p>{item.answer}</p>
                            </motion.div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="bg-gradient-to-br from-[#031123] to-[#051b36] border border-[#112F59] rounded-lg p-6 text-center">
                    <h4 className="text-white font-medium mb-2">Can't find what you're looking for?</h4>
                    <p className="text-gray-400 mb-4">Our support team is ready to assist you with any questions</p>
                    <Button
                      onClick={() => {
                        const tabsElement = document.querySelector('[data-state="inactive"][data-value="chat"]');
                        if (tabsElement) {
                          (tabsElement as HTMLElement).click();
                        }
                      }}
                      className="bg-gradient-to-r from-[#01C8A9] to-[#01a088] text-white hover:opacity-90"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Start a Chat
                    </Button>
                  </motion.div>
                </motion.div>
              </TabsContent>

              <TabsContent value="contact">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <motion.div variants={itemVariants} className="bg-[#031123] border border-[#112F59] rounded-lg p-6 shadow-lg">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-[#01C8A9]/20 flex items-center justify-center mr-3">
                        <Mail className="text-[#01C8A9] w-5 h-5" />
                      </div>
                      <h3 className="text-white font-medium text-lg">Send us a Message</h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name" className="text-gray-400">Your Name</Label>
                        <Input name="userName" className="bg-[#001430] border-[#112F59] text-white mt-1" value={supportInput.userName} onChange={handleChange} />
                      </div>
                      <div>
                        <Label htmlFor="subject" className="text-gray-400">Subject</Label>
                        <Input name="subject" className="bg-[#001430] border-[#112F59] text-white mt-1" value={supportInput.subject} onChange={handleChange} />
                      </div>
                      <div>
                        <Label htmlFor="message" className="text-gray-400">Message</Label>
                        <textarea name="issue" rows={4} className="w-full bg-[#001430] border border-[#112F59] text-white rounded-md p-2 mt-1" value={supportInput.issue} onChange={handleChange}></textarea>
                      </div>
                      <Button
                        type="button"
                        className="w-full bg-gradient-to-r from-[#01C8A9] to-[#01a088] text-white"
                        onClick={handleSubmitTicket}
                      >
                        Send Message
                      </Button>
                    </div>
                  </motion.div>

                  <div className="space-y-6">
                    <motion.div variants={itemVariants} className="bg-[#031123] border border-[#112F59] rounded-lg p-6 shadow-lg">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                          <Mail className="text-blue-400 w-5 h-5" />
                        </div>
                        <h3 className="text-white font-medium text-lg">Email Support</h3>
                      </div>
                      <p className="text-gray-400 mb-2">For general inquiries and support:</p>
                      <a href="mailto:support@example.com" className="text-[#01C8A9] hover:underline text-lg">support@example.com</a>
                    </motion.div>

                    <motion.div variants={itemVariants} className="bg-[#031123] border border-[#112F59] rounded-lg p-6 shadow-lg">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                          <Phone className="text-purple-400 w-5 h-5" />
                        </div>
                        <h3 className="text-white font-medium text-lg">Phone Support</h3>
                      </div>
                      <p className="text-gray-400 mb-2">Call us during business hours:</p>
                      <p className="text-white text-lg">+1 (555) 123-4567</p>
                      <p className="text-gray-400 mt-4 text-sm">
                        Monday - Friday: 9AM - 8PM EST<br />
                        Saturday - Sunday: 10AM - 6PM EST
                      </p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="bg-[#031123] border border-[#112F59] rounded-lg p-6 shadow-lg">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center mr-3">
                          <Star className="text-yellow-400 w-5 h-5" />
                        </div>
                        <h3 className="text-white font-medium text-lg">Premium Support</h3>
                      </div>
                      <p className="text-gray-400 mb-4">Premium subscribers receive priority support with faster response times and dedicated account managers.</p>
                      <Button
                        variant="outline"
                        className="w-full bg-gradient-to-r from-yellow-500/20 to-yellow-500/5 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/20"
                        onClick={() => navigate('/subscription')}
                      >
                        Upgrade to Premium
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {isMobile && <MobileNavbar onCreateClick={() => { }} />}
      </div>
    </SidebarProvider>
  );
};

export default SupportPage;