
import React, { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import MainSidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useIsMobile } from "@/hooks/use-mobile";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import EnhancedStatisticsGrid from "@/components/dashboard/EnhancedStatisticsGrid"; 
import { getDashboardData } from '@/service/employee/dashbaordService'
import { Badge } from "@/components/ui/badge";
import { ConvertDate } from '../../../Utils/CommonFunctions'
import { EmployeeDashboard, TimeFilterOption } from '../../../Utils/EmployeeInterface'


const Dashboard = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const UserDetails = JSON.parse(localStorage.getItem("user"))
  const [selectedTimeFilter, setSelectedTimeFilter] = React.useState("this_week");
  const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear().toString());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [dashboardData, setDashboardData] = useState<EmployeeDashboard>({
    totalAssignedTickets: 0,
    totalResolvedTickets: 0,
    totalPendingTickets: 0,
    data: []
  });

  const timeFilterOptions: TimeFilterOption[] = [
    { label: "Today", value: "today" },
    { label: "This Week", value: "this_week" },
    { label: "This Month", value: "this_month" },
    { label: "This Year", value: "this_year" },
  ];

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  useEffect(() => {
    getUsers()
  }, [selectedTimeFilter])

  const getUsers = async () => {
    const req = { userId: UserDetails?._id, filter_type: selectedTimeFilter, start_date: startDate, end_date: endDate }
    await getDashboardData(req)
      .then((res) => {
        if (res.status) {
          setDashboardData({
            totalAssignedTickets: res?.data?.totalAssignedTickets || 0,
            totalResolvedTickets: res?.data?.totalResolvedTickets || 0,
            totalPendingTickets: res?.data?.totalPendingTickets || 0,
            data: res.data?.assignedTickets || []
          })
        }
        else {
          setDashboardData({
            totalAssignedTickets: 0,
            totalResolvedTickets: 0,
            totalPendingTickets: 0,
            data: []
          })
        }
      })
      .catch((error) => {
        console.log("error in fetching the user details", error)
      })
  }

  const statsData = {
    day: [
      { title: "Total Assign Ticket", value: dashboardData?.totalAssignedTickets },
      { title: "Total Resolve Ticket", value: dashboardData?.totalResolvedTickets },
      { title: "Total Pending Ticket", value: dashboardData?.totalPendingTickets, },

    ]
  };

  const handleDateRangeApply = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
    getUsers()
  }

 

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return "bg-blue-500/20 text-blue-300";
      case 'Progress':
        return "bg-amber-500/20 text-amber-300";
      case 'Resolved':
        return "bg-green-500/20 text-green-300";
      case 'Closed':
        return "bg-gray-500/20 text-gray-300";
      default:
        return "bg-blue-500/20 text-blue-300";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case "technical":
        return "bg-blue-500/20 text-blue-300";
      case "billing":
        return "bg-purple-500/20 text-purple-300";
      case "general":
        return "bg-green-500/20 text-green-300";
      case "sales":
        return "bg-pink-500/20 text-pink-300";
      default:
        return "bg-gray-500/20 text-gray-300";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "low":
        return "bg-green-500/20 text-green-300";
      case "medium":
        return "bg-yellow-500/20 text-yellow-300";
      case "high":
        return "bg-red-500/20 text-red-300";
      default:
        return "bg-gray-500/20 text-gray-300";
    }
  };


  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex w-full min-h-screen bg-gradient-to-br from-[#001430] to-[#031a3d] font-sans">
        <MainSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
        <div
          className="flex flex-col flex-1 transition-all duration-300 ease-in-out"
          style={{
            width: "100%",
            marginLeft: isMobile ? 0 : '250px',
            paddingBottom: isMobile ? '80px' : '0'
          }}
        >
          <Header onMenuClick={handleMenuClick} />

          <div className="p-6">
            <DashboardHeader
              title="Dashboard"
              subtitle={`Welcome back, ${UserDetails?.Username}`}
              timeFilterOptions={timeFilterOptions}
              selectedTimeFilter={selectedTimeFilter}
              onTimeFilterChange={setSelectedTimeFilter}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              onApplyDateRange={handleDateRangeApply}
            />

            <div className="mt-6">
              <EnhancedStatisticsGrid statsData={statsData} />
            </div>

            <div className="mt-6">
              <div className="bg-[#031123] border border-[#112F59] rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Tickets</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-[#112F59]">
                      <tr>
                        <th className="py-3 px-4 text-left text-white">Subject</th>
                        <th className="py-3 px-4 text-center text-white">Message</th>
                        <th className="py-3 px-4 text-center text-white">Category</th>
                        <th className="py-3 px-4 text-center text-white">Priority</th>
                        <th className="py-3 px-4 text-center text-white">Status</th>
                        <th className="py-3 px-4 text-center text-white">Create Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.data.map((item, index) => (
                        <tr key={index} className="border-b border-[#112F59] hover:bg-[#051b37]">
                          <td className="py-4 px-4 text-white flex items-center" title={item?.subject}>
                            {item?.subject?.length > 20 ? `${item.subject.slice(0, 20)}...` : item.subject}
                          </td>
                          <td className="py-4 px-4 text-center text-white">
                            {item?.message?.length > 20 ? `${item.message.slice(0, 20)}...` : item.message}
                          </td>
                          <td className="py-4 px-4 text-center text-white">
                            <Badge className={getCategoryColor(item?.category)}>
                              {item?.category
                                ?.replace('-', ' ')
                                .split(' ')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(' ')
                              }
                            </Badge>
                          </td>
                          <td className="py-4 px-4 text-center text-white">
                            <Badge className={getPriorityColor(item?.priority)}>
                              {item?.priority
                                ? item.priority.charAt(0).toUpperCase() + item.priority.slice(1) + " Priority"
                                : ""}
                            </Badge>

                          </td>
                          
                          <td className="py-4 px-4 text-center text-white">
                            {<Badge className={getStatusColor(item?.status)}>
                              {item?.status?.replace('-', ' ').split(' ').map(word => word?.charAt(0)?.toUpperCase() + word?.slice(1)).join(' ')}
                            </Badge>}
                          </td>
                          <td className="py-4 px-4 text-center text-white">{ConvertDate(item?.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </SidebarProvider>
  );
};

export default Dashboard;
