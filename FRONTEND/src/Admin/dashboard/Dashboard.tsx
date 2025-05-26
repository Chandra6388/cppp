
import React, { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import MainSidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useIsMobile } from "@/hooks/use-mobile";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import EnhancedStatisticsGrid from "@/components/dashboard/EnhancedStatisticsGrid";
import TrendingSignaturePopup from "@/components/signature/TrendingSignaturePopup";
import { getAllUser } from '@/service/auth/auth.service'
import { ConvertDate } from '../../../Utils/CommonFunctions'
interface TimeFilterOption {
  label: string;
  value: string;
}


interface UserData {
  total_user: number;
  total_active_user: number;
  total_inactive_user: number;
}

interface PercentageChange {
  total_user: number;
  total_active_user: number;
  total_inactive_user: number;
}

interface User {
  Username: string;
  Email: string;
  PhoneNo: string;
  country?: string;
  Is_Active: number;
  createdAt: string;
}

interface UsersArr {
  currectUserData: UserData;
  percentage_change: PercentageChange;
  data: User[];
}


const Dashboard = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [selectedTimeFilter, setSelectedTimeFilter] = React.useState("this_week");
  const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear().toString());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [usersArr, setUserArr] = useState<UsersArr>({
    currectUserData: {
      total_user: 0,
      total_active_user: 0,
      total_inactive_user: 0,
    },
    percentage_change: {
      total_user: 0,
      total_active_user: 0,
      total_inactive_user: 0,
    },
    data: [],
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
    const req = { filter_type: selectedTimeFilter, start_date: startDate, end_date: endDate }
    await getAllUser(req)
      .then((res) => {
        if (res.status) {
          setUserArr({
            currectUserData: res.current,
            percentage_change: res.percentage_change,
            data: res.data
          })
        }
        else {
          setUserArr({
            currectUserData: {
              total_user: 0,
              total_active_user: 0,
              total_inactive_user: 0,
            },
            percentage_change: {
              total_user: 0,
              total_active_user: 0,
              total_inactive_user: 0,
            },
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
      { title: "Total User", value: usersArr?.currectUserData?.total_user, change: usersArr.percentage_change.total_user, isPositive: Number(usersArr.percentage_change.total_user) >= 0 ? true : false },
      { title: "Total Active User", value: usersArr?.currectUserData?.total_active_user, change: usersArr.percentage_change.total_active_user, isPositive: Number(usersArr.percentage_change.total_active_user) >= 0 ? true : false },
      { title: "Total InActive User", value: usersArr.currectUserData.total_inactive_user, change: usersArr.percentage_change.total_inactive_user, isPositive: Number(usersArr.percentage_change.total_inactive_user) >= 0 ? true : false },
      { title: "Subscribers", value: 0, change: 0, isPositive: false },
    ]
  };

  const handleDateRangeApply = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
    getUsers()
  }


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
          <Header
            onMenuClick={handleMenuClick}
          />

          <div className="p-6">
            <DashboardHeader
              title="Dashboard"
              subtitle="Welcome back, Chandra"
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
                <h2 className="text-xl font-semibold text-white mb-4">Users</h2>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-[#112F59]">
                      <tr>
                        <th className="py-3 px-4 text-left text-white">User Name</th>
                        <th className="py-3 px-4 text-center text-white">Email</th>
                        <th className="py-3 px-4 text-center text-white">PhoneNo</th>
                        <th className="py-3 px-4 text-center text-white">country</th>
                        <th className="py-3 px-4 text-center text-white">Status</th>
                        <th className="py-3 px-4 text-center text-white">Create Date</th>

                      </tr>
                    </thead>
                    <tbody>
                      {usersArr.data.map((item, index) => (
                        <tr key={index} className="border-b border-[#112F59] hover:bg-[#051b37]">
                          <td className="py-4 px-4 text-white flex items-center">{item.Username}</td>
                          <td className="py-4 px-4 text-center text-white">{item.Email}</td>
                          <td className="py-4 px-4 text-center text-white">{item.PhoneNo}</td>
                          <td className="py-4 px-4 text-center text-white">{item?.country || "N/A"}</td>
                          <td className="py-4 px-4 text-center text-white">{item?.Is_Active == 1 ? "Active" : "Inactive"}</td>
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

      {/* Trending Signature Popup */}
      {/* <TrendingSignaturePopup /> */}
    </SidebarProvider>
  );
};

export default Dashboard;
