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

export interface DashboardData {
    _id: string,
    userId: string;
    userName: string;
    subject: string;
    message: string;
    status: string;
    priority: string;
    category: string;
    assignee: string;
    createdAt: string;

}

export interface EmployeeDashboard {
    totalAssignedTickets: number;
    totalResolvedTickets: number;
    totalPendingTickets: number;
    data: DashboardData[];
}
