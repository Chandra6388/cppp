
import React, { useState } from "react";
import PaymentModal from "../modals/PaymentModal";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface SubscriptionAlertProps {
  expiryDate: string;
  onRemindLater: () => void;
  onPayNow?: () => void;
}

export const SubscriptionAlert: React.FC<SubscriptionAlertProps> = ({
  expiryDate = "23/03/2025",
  onRemindLater = () => { },
  onPayNow,
}) => {
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const { toast } = useToast();

  const handlePayNowClick = () => {
    setPaymentModalOpen(true);
    if (onPayNow) onPayNow();
  };

  const handlePaymentSuccess = () => {
    toast({
      title: "Payment successful",
      description: "Your subscription has been renewed until " + expiryDate,
      variant: "success",
      duration: 1000,
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex h-[54px] items-center bg-[#FF5470] px-6 py-[7px]"
      >
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-[3px]">
            <div
              dangerouslySetInnerHTML={{
                __html:
                  '<svg xmlns="http://www.w3.org/2000/svg" class="w-[24px] h-[24px]" viewBox="0 0 24 24" stroke-width="2" stroke="white" fill="none"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><circle cx="12" cy="12" r="9"></circle><line x1="12" y1="8" x2="12.01" y2="8"></line><polyline points="11 12 12 12 12 16 13 16"></polyline></svg>',
              }}
            />
            <div className="text-white text-xs font-bold leading-[30px]">
              Your subscription will expire on {expiryDate}! Renew now to avoid
              interruptions.
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="h-8 bg-[#001430]/80 hover:bg-[#001430] text-white text-[10px] font-semibold px-4 py-0.5 rounded-full border-[0.5px] border-white/30 transition-colors"
              onClick={onRemindLater}
            >
              Remind Me Later
            </button>
            <button
              className="h-8 bg-white text-black text-[10px] font-semibold px-4 py-0.5 rounded-full hover:bg-white/90 transition-colors"
              onClick={handlePayNowClick}
            >
              Pay Now
            </button>
          </div>
        </div>
      </motion.div>

      <PaymentModal
        open={paymentModalOpen}
        onOpenChange={setPaymentModalOpen}
        onSuccess={handlePaymentSuccess}
        amount="$19.00"
      />
    </>
  );
};

export default SubscriptionAlert;
