
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface AssigneTo {
  assigne_to:string,
  category: string;
  priority: string;
}

interface CreateTicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (ticket: AssigneTo) => void;
}

const formSchema = z.object({
  assigne_to: z.string().min(1, "Please select a support"),
  category: z.string().min(1, "Please select a category"),
  priority: z.enum(["low", "medium", "high"]),
});

const CreateTicketModal: React.FC<CreateTicketModalProps> = ({ open, onOpenChange, onSubmit }) => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assigne_to: "",
      category: "general",
      priority: "medium",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
 
    const newTicket: AssigneTo = {
      assigne_to : values.assigne_to,
      priority: values.priority,
      category: values.category, 
    };
    onSubmit(newTicket);
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#001430] border-[#112F59] p-0 overflow-hidden max-w-md">
        <DialogHeader className="p-0">
          <div className="flex items-center justify-between w-full bg-[#001430] p-6 border-b border-[#112F59]">
            <h2 className="text-white text-xl font-medium">Assigne To Support</h2>
            <button
              onClick={() => onOpenChange(false)}
              className="text-white hover:text-gray-300"
            >
              <X size={20} />
            </button>
          </div>
        </DialogHeader>

        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="assigne_to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#8B8B8B]">Assigne To</FormLabel>
                    <FormControl>
                      <select
                        className="w-full h-10 rounded-md border border-[#112F59] bg-[#001430] px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#01C8A9] focus:ring-offset-2"
                        {...field}
                      >
                        <option value="user1">User 1</option>
                        <option value="user2">User 2</option>
                        <option value="user3">User 3</option>
                        <option value="user4">User 4</option>
                        <option value="user5">User 5</option>
                        <option value="user6">User 6</option>
                        <option value="user7">User 7</option>
                        <option value="user8">User 8</option>
                      </select>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#8B8B8B]">Category</FormLabel>
                      <FormControl>
                        <select
                          className="w-full h-10 rounded-md border border-[#112F59] bg-[#001430] px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#01C8A9] focus:ring-offset-2"
                          {...field}
                        >
                          <option value="general">General</option>
                          <option value="technical">Technical</option>
                          <option value="billing">Billing</option>
                          <option value="feature">Feature Request</option>
                        </select>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#8B8B8B]">Priority</FormLabel>
                      <FormControl>
                        <select
                          className="w-full h-10 rounded-md border border-[#112F59] bg-[#001430] px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#01C8A9] focus:ring-offset-2"
                          {...field}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="submit"
                variant="teal"
                className="w-full"
              >
                Assigne
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.33398 8H12.6673" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8.33398 3.33337L13.0007 8.00004L8.33398 12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTicketModal;
