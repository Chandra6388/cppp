
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Check, CreditCard, Calendar, Info, Lock, CheckCircle, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  amount?: string;
}

// Payment form schema
const paymentFormSchema = z.object({
  cardName: z.string().min(2, "Name is required"),
  cardNumber: z.string().min(16, "Card number must be 16 digits").max(19),
  expiryDate: z.string().min(5, "Expiry date is required"),
  cvc: z.string().min(3, "CVC is required").max(4),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

const PaymentModal: React.FC<PaymentModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
  amount = "$19.00"
}) => {
  const [paymentMethod, setPaymentMethod] = useState<string>("credit");
  const [processing, setProcessing] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);
  const [showCardForm, setShowCardForm] = useState<boolean>(false);
  const { toast } = useToast();

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      cardName: "",
      cardNumber: "",
      expiryDate: "",
      cvc: "",
    },
  });

  const handlePaymentSubmit = (values: PaymentFormValues) => {
    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setCompleted(true);

      // Show success message inside modal first
      setTimeout(() => {
        setCompleted(false);
        setShowCardForm(false);
        onOpenChange(false);

        toast({
          title: "Payment successful",
          description: "Your subscription has been renewed.",
          variant: "success",
          duration: 1000,
        });

        if (onSuccess) {
          onSuccess();
        }
      }, 2000);
    }, 1500);
  };

  // Reset state when modal is closed
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setCompleted(false);
      setProcessing(false);
      setShowCardForm(false);
      form.reset();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-[#031123] border border-[#112F59] text-white sm:max-w-[500px]">
        {!completed ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Complete Payment</DialogTitle>
              <DialogDescription className="text-gray-400">
                Renew your subscription to continue using all features.
              </DialogDescription>
            </DialogHeader>

            {!showCardForm ? (
              <div className="space-y-6 pt-4">
                <div className="bg-[#07234A] p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-300">Amount due</p>
                    <p className="text-xl font-bold">{amount}</p>
                  </div>
                  <div className="bg-[#01C8A9]/20 px-3 py-1.5 rounded-full">
                    <p className="text-sm text-[#01C8A9] font-medium">Pro Plan</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4 text-[#01C8A9]" />
                    <span>Select payment method</span>
                  </h3>

                  <div className="grid grid-cols-1 gap-3">
                    <Card
                      className={`bg-transparent cursor-pointer ${paymentMethod === "credit"
                          ? "border-[#01C8A9] ring-1 ring-[#01C8A9]"
                          : "border-[#112F59] hover:border-[#01C8A9]/50"
                        } transition-all duration-200`}
                      onClick={() => setPaymentMethod("credit")}
                    >
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="bg-[#07234A] p-2 rounded-md">
                          <CreditCard className="h-5 w-5 text-[#01C8A9]" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium">Credit Card</h4>
                          <p className="text-xs text-gray-400">Visa ending in 4242</p>
                        </div>
                        {paymentMethod === "credit" && (
                          <Check className="h-5 w-5 text-[#01C8A9]" />
                        )}
                      </CardContent>
                    </Card>

                    <Card
                      className={`bg-transparent cursor-pointer ${paymentMethod === "new"
                          ? "border-[#01C8A9] ring-1 ring-[#01C8A9]"
                          : "border-[#112F59] hover:border-[#01C8A9]/50"
                        } transition-all duration-200`}
                      onClick={() => setPaymentMethod("new")}
                    >
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="bg-[#07234A] p-2 rounded-md">
                          <Calendar className="h-5 w-5 text-[#01C8A9]" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium">Add New Payment Method</h4>
                          <p className="text-xs text-gray-400">Securely add a new card</p>
                        </div>
                        {paymentMethod === "new" && (
                          <Check className="h-5 w-5 text-[#01C8A9]" />
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="bg-[#07234A]/50 p-3 rounded-lg flex items-start gap-2 text-xs">
                  <Info className="h-4 w-4 text-[#01C8A9] mt-0.5 flex-shrink-0" />
                  <p className="text-gray-300">
                    Your subscription renews automatically. Cancel anytime from your account settings.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 pt-4">
                <div className="bg-[#07234A] p-4 rounded-lg flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-300">Amount due</p>
                    <p className="text-xl font-bold">{amount}</p>
                  </div>
                  <div className="bg-[#01C8A9]/20 px-3 py-1.5 rounded-full">
                    <p className="text-sm text-[#01C8A9] font-medium">Pro Plan</p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-[#01C8A9] text-white text-xs py-1 px-3 rounded-full">
                    Secure Payment
                  </div>
                  <div className="border border-[#112F59] rounded-lg p-5 bg-[#07234A]/30">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handlePaymentSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="cardName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Name on Card</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                  <Input
                                    placeholder="John Smith"
                                    className="pl-9 bg-[#031123] border-[#112F59]"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="cardNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Card Number</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                  <Input
                                    placeholder="1234 5678 9012 3456"
                                    className="pl-9 bg-[#031123] border-[#112F59]"
                                    {...field}
                                    onChange={(e) => {
                                      // Format card number with spaces
                                      let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                                      if (value.length > 16) value = value.slice(0, 16);
                                      const parts = [];
                                      for (let i = 0; i < value.length; i += 4) {
                                        parts.push(value.slice(i, i + 4));
                                      }
                                      field.onChange(parts.join(' ').trim());
                                    }}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="expiryDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Expiry Date</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                      placeholder="MM/YY"
                                      className="pl-9 bg-[#031123] border-[#112F59]"
                                      {...field}
                                      onChange={(e) => {
                                        let value = e.target.value.replace(/[^0-9]/g, '');
                                        if (value.length > 4) value = value.slice(0, 4);
                                        if (value.length > 2) {
                                          value = value.slice(0, 2) + '/' + value.slice(2);
                                        }
                                        field.onChange(value);
                                      }}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage className="text-red-400" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="cvc"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">CVC</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                      placeholder="123"
                                      className="pl-9 bg-[#031123] border-[#112F59]"
                                      type="password"
                                      maxLength={4}
                                      {...field}
                                      onChange={(e) => {
                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                        if (value.length <= 4) {
                                          field.onChange(value);
                                        }
                                      }}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage className="text-red-400" />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="flex items-center justify-center mt-4">
                          <img
                            src="/lovable-uploads/59006ca4-1c74-41d7-862c-d35da0219f2e.png"
                            alt="Payment methods"
                            className="h-6 opacity-70"
                          />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                          <Button
                            type="button"
                            variant="darkOutline"
                            onClick={() => setShowCardForm(false)}
                          >
                            Back
                          </Button>
                          <Button
                            type="submit"
                            variant="teal"
                            disabled={processing}
                            className="relative overflow-hidden"
                          >
                            {processing ? (
                              <>
                                <span className="animate-pulse">Processing...</span>
                                <span className="absolute inset-0 bg-gradient-to-r from-[#01C8A9]/0 via-[#01C8A9]/30 to-[#01C8A9]/0 animate-shimmer"></span>
                              </>
                            ) : (
                              <>
                                <Lock className="h-4 w-4" />
                                Pay {amount}
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                </div>
              </div>
            )}

            {!showCardForm && (
              <CardFooter className="flex justify-end gap-3 px-0 pt-4">
                <Button
                  variant="darkOutline"
                  onClick={() => onOpenChange(false)}
                  disabled={processing}
                >
                  Cancel
                </Button>
                <Button
                  variant="teal"
                  onClick={() => setShowCardForm(true)}
                  disabled={processing}
                >
                  Continue to Payment
                </Button>
              </CardFooter>
            )}
          </>
        ) : (
          <div className="py-10 flex flex-col items-center justify-center">
            <div className="h-16 w-16 rounded-full bg-[#01C8A9]/20 flex items-center justify-center mb-4 animate-pulse">
              <CheckCircle className="h-8 w-8 text-[#01C8A9]" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Payment Successful!</h2>
            <p className="text-gray-400 text-center mb-6">Your subscription has been renewed successfully.</p>
            <Button variant="teal" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
