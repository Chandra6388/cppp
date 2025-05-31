import React, { useState } from "react";

interface DatePickerProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onDateChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDatePicker = () => {
    setIsOpen(!isOpen);
  };

  // This would be expanded in a real implementation to show a calendar
  // and handle actual date selection
  const handleDateSelect = (date: string) => {
    onDateChange(date);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        className="flex w-[156px] h-11 items-center justify-between bg-[#031123] px-3.5 py-[9px] rounded-lg border-[0.88px] border-[#8B8B8B]"
        onClick={toggleDatePicker}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-[17px]">
          <div
            dangerouslySetInnerHTML={{
              __html:
                '<svg id="I2:6583;2:74407;2:4422" layer-name="calculator_duo" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-[19px] h-[19px]"> <g clip-path="url(#clip0_2_75447)"> <path fill-rule="evenodd" clip-rule="evenodd" d="M19.6305 6.08213C19.5248 3.95987 19.2091 2.63594 18.2669 1.6938C16.85 0.276855 14.5694 0.276855 10.0084 0.276855C5.44732 0.276855 3.16679 0.276855 1.74985 1.6938C0.807718 2.63594 0.492018 3.95987 0.38623 6.08213H19.6305ZM11.9435 3.42138C11.9435 3.02061 12.2684 2.69572 12.6691 2.69572H15.088C15.4888 2.69572 15.8137 3.02061 15.8137 3.42138C15.8137 3.82215 15.4888 4.14704 15.088 4.14704H12.6691C12.2684 4.14704 11.9435 3.82215 11.9435 3.42138Z" fill="white"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M0.391277 7.92529C0.38623 8.52051 0.38623 9.16385 0.38623 9.86038C0.38623 14.4214 0.38623 16.702 1.80317 18.1189C3.2201 19.5358 5.50063 19.5358 10.0617 19.5358C14.6227 19.5358 16.9033 19.5358 18.3202 18.1189C19.7371 16.702 19.7371 14.4214 19.7371 9.86038C19.7371 9.16385 19.7371 8.52051 19.7321 7.92529H0.391277Z" fill="#354585"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M4.25635 11.1099C4.25635 10.7111 4.58124 10.3877 4.98201 10.3877H6.43333C6.83409 10.3877 7.15899 10.7111 7.15899 11.1099C7.15899 11.5087 6.83409 11.8321 6.43333 11.8321H4.98201C4.58124 11.8321 4.25635 11.5087 4.25635 11.1099ZM8.6103 11.1099C8.6103 10.7111 8.9352 10.3877 9.33596 10.3877H10.7873C11.188 10.3877 11.5129 10.7111 11.5129 11.1099C11.5129 11.5087 11.188 11.8321 10.7873 11.8321H9.33596C8.9352 11.8321 8.6103 11.5087 8.6103 11.1099ZM12.9643 11.1099C12.9643 10.7111 13.2892 10.3877 13.6899 10.3877H15.1412C15.542 10.3877 15.8669 10.7111 15.8669 11.1099C15.8669 11.5087 15.542 11.8321 15.1412 11.8321H13.6899C13.2892 11.8321 12.9643 11.5087 12.9643 11.1099ZM4.25635 14.9617C4.25635 14.5628 4.58124 14.2394 4.98201 14.2394H6.43333C6.83409 14.2394 7.15899 14.5628 7.15899 14.9617C7.15899 15.3605 6.83409 15.6839 6.43333 15.6839H4.98201C4.58124 15.6839 4.25635 15.3605 4.25635 14.9617ZM8.6103 14.9617C8.6103 14.5628 8.9352 14.2394 9.33596 14.2394H10.7873C11.188 14.2394 11.5129 14.5628 11.5129 14.9617C11.5129 15.3605 11.188 15.6839 10.7873 15.6839H9.33596C8.9352 15.6839 8.6103 15.3605 8.6103 14.9617ZM12.9643 14.9617C12.9643 14.5628 13.2892 14.2394 13.6899 14.2394H15.1412C15.542 14.2394 15.8669 14.5628 15.8669 14.9617C15.8669 15.3605 15.542 15.6839 15.1412 15.6839H13.6899C13.2892 15.6839 12.9643 15.3605 12.9643 14.9617Z" fill="white"></path> </g> <defs> <clipPath id="clip0_2_75447"> <rect width="19.3509" height="19.2588" fill="white" transform="translate(0.38623 0.276855)"></rect> </clipPath> </defs> </svg>',
            }}
          />
          <span className="text-white text-xs font-bold">{selectedDate}</span>
        </div>
        <div
          dangerouslySetInnerHTML={{
            __html:
              '<svg id="I2:6583;2:74407;2:4427" layer-name="arrow-ios-downward-fill" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-[19px] h-[19px]"> <path d="M9.73829 13.1309C9.5499 13.1312 9.36733 13.0656 9.22226 12.9454L4.38454 8.91398C4.21988 8.77712 4.11633 8.58046 4.09667 8.36725C4.07702 8.15405 4.14286 7.94177 4.27972 7.77711C4.41658 7.61246 4.61324 7.50891 4.82644 7.48925C5.03965 7.46959 5.25193 7.53544 5.41658 7.6723L9.73829 11.2845L14.06 7.8013C14.1425 7.73433 14.2374 7.68431 14.3392 7.65413C14.4411 7.62395 14.5479 7.6142 14.6536 7.62544C14.7592 7.63668 14.8616 7.66868 14.9548 7.71962C15.0481 7.77056 15.1303 7.83942 15.1969 7.92225C15.2707 8.00515 15.3266 8.10241 15.3611 8.20793C15.3956 8.31345 15.408 8.42496 15.3974 8.53548C15.3868 8.64599 15.3535 8.75312 15.2995 8.85016C15.2456 8.94721 15.1722 9.03207 15.084 9.09943L10.2463 12.9938C10.097 13.095 9.91817 13.1433 9.73829 13.1309Z" fill="white"></path> </svg>',
          }}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-[200px] bg-[#031123] border border-[#112F59] rounded-lg shadow-lg z-10 p-2">
          {/* Simplified calendar UI for demo purposes */}
          <div className="flex flex-col gap-1">
            <button
              className="text-white text-xs hover:bg-[#07234A] p-2 rounded text-left"
              onClick={() => handleDateSelect("March 23, 2025")}
            >
              March 23, 2025
            </button>
            <button
              className="text-white text-xs hover:bg-[#07234A] p-2 rounded text-left"
              onClick={() => handleDateSelect("March 24, 2025")}
            >
              March 24, 2025
            </button>
            <button
              className="text-white text-xs hover:bg-[#07234A] p-2 rounded text-left"
              onClick={() => handleDateSelect("March 25, 2025")}
            >
              March 25, 2025
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
