import React, { useState } from "react";
import DatePicker from "../ui/DatePicker";

interface ControlBarProps {
  onCreateSignature: () => void;
  onManageSignatures: () => void;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  onCreateSignature = () => {},
  onManageSignatures = () => {},
}) => {
  const [selectedDate, setSelectedDate] = useState("March 23, 2025");

  return (
    <div className="flex gap-2 ml-auto">
      <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />

      <button
        className="flex w-40 h-11 justify-center items-center gap-2 bg-[#031123] px-[18px] py-[13px] rounded-lg border-[0.7px] border-[#216FFF]"
        onClick={onManageSignatures}
      >
        <div
          dangerouslySetInnerHTML={{
            __html:
              '<svg id="I2:6583;2:74407;2:4431" layer-name="adjustments-horizontal" width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-[18px] h-[18px]"> <path fill-rule="evenodd" clip-rule="evenodd" d="M11.6405 5.28781C11.2154 5.28781 10.8708 5.63239 10.8708 6.05745C10.8708 6.48251 11.2154 6.82709 11.6405 6.82709C12.0655 6.82709 12.4101 6.48251 12.4101 6.05745C12.4101 5.63239 12.0655 5.28781 11.6405 5.28781ZM9.33154 6.05745C9.33154 4.78227 10.3653 3.74854 11.6405 3.74854C12.9156 3.74854 13.9494 4.78227 13.9494 6.05745C13.9494 7.33263 12.9156 8.36637 11.6405 8.36637C10.3653 8.36637 9.33154 7.33263 9.33154 6.05745Z" fill="#216FFF"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M3.17432 6.05772C3.17432 5.63266 3.5189 5.28809 3.94396 5.28809H10.1011C10.5261 5.28809 10.8707 5.63266 10.8707 6.05772C10.8707 6.48278 10.5261 6.82736 10.1011 6.82736H3.94396C3.5189 6.82736 3.17432 6.48278 3.17432 6.05772Z" fill="#216FFF"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M12.4102 6.05772C12.4102 5.63266 12.7547 5.28809 13.1798 5.28809H16.2584C16.6834 5.28809 17.028 5.63266 17.028 6.05772C17.028 6.48278 16.6834 6.82736 16.2584 6.82736H13.1798C12.7547 6.82736 12.4102 6.48278 12.4102 6.05772Z" fill="#216FFF"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M7.02278 9.90598C6.59772 9.90598 6.25314 10.2506 6.25314 10.6756C6.25314 11.1007 6.59772 11.4453 7.02278 11.4453C7.44784 11.4453 7.79242 11.1007 7.79242 10.6756C7.79242 10.2506 7.44784 9.90598 7.02278 9.90598ZM4.71387 10.6756C4.71387 9.40044 5.7476 8.3667 7.02278 8.3667C8.29796 8.3667 9.3317 9.40044 9.3317 10.6756C9.3317 11.9508 8.29796 12.9845 7.02278 12.9845C5.7476 12.9845 4.71387 11.9508 4.71387 10.6756Z" fill="#216FFF"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M3.17432 10.6754C3.17432 10.2503 3.5189 9.90576 3.94396 9.90576H5.48323C5.90829 9.90576 6.25287 10.2503 6.25287 10.6754C6.25287 11.1005 5.90829 11.445 5.48323 11.445H3.94396C3.5189 11.445 3.17432 11.1005 3.17432 10.6754Z" fill="#216FFF"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M7.79199 10.6754C7.79199 10.2503 8.13657 9.90576 8.56163 9.90576H16.258C16.6831 9.90576 17.0277 10.2503 17.0277 10.6754C17.0277 11.1005 16.6831 11.445 16.258 11.445H8.56163C8.13657 11.445 7.79199 11.1005 7.79199 10.6754Z" fill="#216FFF"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M13.9495 14.5237C13.5245 14.5237 13.1799 14.8682 13.1799 15.2933C13.1799 15.7184 13.5245 16.0629 13.9495 16.0629C14.3746 16.0629 14.7192 15.7184 14.7192 15.2933C14.7192 14.8682 14.3746 14.5237 13.9495 14.5237ZM11.6406 15.2933C11.6406 14.0181 12.6744 12.9844 13.9495 12.9844C15.2247 12.9844 16.2585 14.0181 16.2585 15.2933C16.2585 16.5685 15.2247 17.6022 13.9495 17.6022C12.6744 17.6022 11.6406 16.5685 11.6406 15.2933Z" fill="#216FFF"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M3.17432 15.2931C3.17432 14.868 3.5189 14.5234 3.94396 14.5234H12.41C12.835 14.5234 13.1796 14.868 13.1796 15.2931C13.1796 15.7181 12.835 16.0627 12.41 16.0627H3.94396C3.5189 16.0627 3.17432 15.7181 3.17432 15.2931Z" fill="#216FFF"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M14.7188 15.2931C14.7188 14.868 15.0633 14.5234 15.4884 14.5234H16.258C16.6831 14.5234 17.0277 14.868 17.0277 15.2931C17.0277 15.7181 16.6831 16.0627 16.258 16.0627H15.4884C15.0633 16.0627 14.7188 15.7181 14.7188 15.2931Z" fill="#216FFF"></path> </svg>',
          }}
        />
        <span className="text-[#216FFF] text-xs font-bold">
          Manage Signatures
        </span>
      </button>

      <button
        className="w-[140px] h-11 bg-[#01C8A9] text-white text-xs font-bold px-[18px] py-[13px] rounded-lg"
        onClick={onCreateSignature}
      >
        Create Signature
      </button>
    </div>
  );
};

export default ControlBar;
