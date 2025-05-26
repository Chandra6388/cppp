import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { X, SendHorizontal, Circle, CheckCircle2, BanIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useToast } from "@/hooks/use-toast";


interface Ticket {
  _id: string,
  status: string,
  userId: string,
  userName: string,
  subject: string,
  message: string,
  createdAt: string,
  category: string;
  priority: "low" | "medium" | "high" | null;
  assignee?: string;
}

interface TicketDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: Ticket;
  onStatusChange?: (ticketId: string, status: Ticket["status"]) => void;
  setchangestatusModal: (changeStatusModal: boolean) => void;
  changeStatusModal: boolean;
  selectedStatus: string;
  setSelectedStatus: (selectedStatus: string) => void
  handleSubmit: (status: string, ticketId: string) => Promise<void>;


}


const TicketDetailModal: React.FC<TicketDetailModalProps> = ({ open, onOpenChange, ticket, onStatusChange, setchangestatusModal, changeStatusModal, selectedStatus, setSelectedStatus, handleSubmit }) => {

 

  const handleStatusChange = () => {
    setchangestatusModal(true)
  };


  // Format date to readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return "text-green-400";
      case 'medium':
        return "text-yellow-400";
      case 'high':
        return "text-red-400";
      default:
        return "text-gray-400";
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
            <div className="p-6 border-b border-[#112F59]">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[#8B8B8B]">Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </Badge>
                    {onStatusChange && ticket?.status !== 'Closed' && (
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

                <div>
                  <p className="text-[#8B8B8B]">Priority</p>
                  <p className={`font-medium ${getPriorityColor(ticket?.priority)}`}>
                    {ticket?.priority?.charAt(0)?.toUpperCase() + ticket?.priority?.slice(1)}
                  </p>
                </div>
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
                      <p className="text-white">{ticket?.assignee}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <p className="text-[#8B8B8B] mb-1">Description</p>
                <p className="text-white text-sm">{ticket?.message}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={changeStatusModal} onOpenChange={() => setchangestatusModal(!changeStatusModal)}>
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
                  onClick={() => handleSubmit( ticket._id, selectedStatus)}
                >
                  Change
                </Button>

              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TicketDetailModal;
