export interface EmployeeData {
    total_employee: number;
    total_active_employee: number;
    total_inactive_employee: number;
}

export interface TimeFilterOption {
    label: string;
    value: string;
}

export interface UserData {
    total_user: number;
    total_active_user: number;
    total_inactive_user: number;
}

export interface PercentageChange {
    total_user: number;
    total_active_user: number;
    total_inactive_user: number;
}

export interface User {
    _id: string,
    Username: string;
    Email: string;
    PhoneNo: string;
    country?: string;
    Is_Active: boolean;
    createdAt: string;
    Is_AdminDeleted: boolean;
}

export interface UsersArr {
    currectUserData: UserData;
    percentage_change: PercentageChange;
    data: User[];
}

export interface EmployeeArr {
    currectEmployeeData: EmployeeData;
    percentage_change: EmployeeData;
    data: User[];
}

export interface Employee {
    _id: string;
    Username: string;
}
export interface userGraphData {
    name: string;
    usage: number;
}

export interface EnhancedSignatureUseCardProps {
    title: string;
    subtitle?: string;
    timeFilterOptions: TimeFilterOption[];
    selectedTimeFilter: string;
    onTimeFilterChange: (value: string) => void;
    onApplyDateRange?: (startDate: Date | null, endDate: Date | null) => void;
    signatureSendHistoryGraphData: userGraphData[];
}

export interface AllTickets {
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
    chatHistory?: message[]
    unseenCount?:number
}

export interface message {
    _id: string;
    message: string;
    timestamp: string;
    isUser: string;
}

export interface AssigneTo {
    assigne_to: string,
    category: string;
    priority: string;
}

export interface Ticket {
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
    messages?: message[];
}

export interface TicketDetailModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    ticket: Ticket;
    onStatusChange?: (ticketId: string, status: Ticket["status"]) => void;
    setchangestatusModal: (changeStatusModal: boolean) => void;
    changeStatusModal: boolean;
    selectedStatus: string;
    setSelectedStatus: (selectedStatus: string) => void
    handleSubmit: (status: string, ticketId: string) => Promise<void>;
    employeeName?: string;
    type?: "user" | "support";
}

export interface Message {
    ticketId: string;
    reciverId: string;
    text: string;
    sender: string;
    timestamp: Date;
    senderId: string,
    isRead?:boolean
}


