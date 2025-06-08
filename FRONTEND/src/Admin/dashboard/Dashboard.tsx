
import React, { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import MainSidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useIsMobile } from "@/hooks/use-mobile";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import EnhancedStatisticsGrid from "@/components/dashboard/EnhancedStatisticsGrid";
import TrendingSignaturePopup from "@/components/signature/TrendingSignaturePopup";
import { getAllUser, updateUserStatus, deleteUserByAdmin, getAllEmployee, userCreateAnalytics,  } from '@/service/auth/auth.service'
import { ConvertDate } from '../../../Utils/CommonFunctions'
import { sweetAlert } from '../../../Utils/CommonFunctions'
import { Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { userGraphData, UsersArr, EmployeeArr, TimeFilterOption } from '../../../Utils/AdminIntrface'
import EnhancedSignatureUseCard from "@/components/dashboard/EnhancedSignatureUseCard";




const Dashboard = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const UserDetails = JSON.parse(localStorage.getItem("user"))
  const [selectedTimeFilter, setSelectedTimeFilter] = React.useState("this_week");
  const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear().toString());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [userCreateGraphData, setUserCreateGraphData] = useState<userGraphData[]>([]);
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

  const [employeeArr, setEmployeeArr] = useState<EmployeeArr>({
    currectEmployeeData: {
      total_employee: 0,
      total_active_employee: 0,
      total_inactive_employee: 0,
    },
    percentage_change: {
      total_employee: 0,
      total_active_employee: 0,
      total_inactive_employee: 0,
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
    getEmployees()
    getAllUserGraphData()
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

  const getEmployees = async () => {
    const req = { filter_type: selectedTimeFilter, start_date: startDate, end_date: endDate }
    await getAllEmployee(req)
      .then((res) => {
        if (res.status) {
          setEmployeeArr({
            currectEmployeeData: res.current,
            percentage_change: res.percentage_change,
            data: res.data
          })
        }
        else {
          setEmployeeArr({
            currectEmployeeData: {
              total_employee: 0,
              total_active_employee: 0,
              total_inactive_employee: 0,
            },
            percentage_change: {
              total_employee: 0,
              total_active_employee: 0,
              total_inactive_employee: 0,
            },
            data: []
          })
        }
      })
      .catch((error) => {
        console.log("error in fetching the user details", error)
      })
  }

  const getAllUserGraphData = async () => {
    const req = { filter_type: selectedTimeFilter, start_date: startDate, end_date: endDate }
    await userCreateAnalytics(req)
      .then((res) => {
        if (res.status) {
          setUserCreateGraphData(res.data);
        }
        else {
          setUserCreateGraphData([]);
        }
      })
      .catch((error) => {
        console.log("error in fetching the user details", error)
      })
  }



  const statsData = {
    day: [
      { title: "Total User", value: usersArr?.currectUserData?.total_user, change: usersArr?.percentage_change?.total_user, isPositive: Number(usersArr?.percentage_change?.total_user) >= 0 ? true : false },
      { title: "Total Active User", value: usersArr?.currectUserData?.total_active_user, change: usersArr?.percentage_change?.total_active_user, isPositive: Number(usersArr?.percentage_change?.total_active_user) >= 0 ? true : false },
      { title: "Total InActive User", value: usersArr?.currectUserData?.total_inactive_user, change: usersArr?.percentage_change?.total_inactive_user, isPositive: Number(usersArr?.percentage_change?.total_inactive_user) >= 0 ? true : false },
      { title: "Subscribers", value: 0, change: 0, isPositive: false },
    ]
  };

  const EmployeeData = {
    day: [
      { title: "Total Employees", value: employeeArr?.currectEmployeeData?.total_employee, change: employeeArr.percentage_change.total_employee, isPositive: Number(employeeArr.percentage_change.total_employee) >= 0 ? true : false },
      { title: "Total Active Employees", value: employeeArr?.currectEmployeeData?.total_active_employee, change: employeeArr.percentage_change.total_active_employee, isPositive: Number(employeeArr.percentage_change.total_active_employee) >= 0 ? true : false },
      { title: "Total InActive Employees", value: employeeArr.currectEmployeeData.total_inactive_employee, change: employeeArr.percentage_change.total_inactive_employee, isPositive: Number(employeeArr.percentage_change.total_inactive_employee) >= 0 ? true : false },

    ]
  };
  const handleDateRangeApply = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
    getUsers()
  }

  const handleStatusChange = async (userId: string, status: boolean, role: string) => {
    const req = { userId: userId, status: !status };
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${status ? "deactivate" : "activate"} this ${role}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#01c8a7",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${status ? "deactivate" : "activate"} it!`
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await updateUserStatus(req);
          if (res.status) {
            sweetAlert("Success", `User has been ${status ? "deactivated" : "activated"} successfully`, "success",)
            getUsers();
          } else {
            sweetAlert("Error", res.message || `Failed to change ${role} status`, "error");
          }
        } catch (error) {
          console.error(`Error in changing ${role} status:`, error);
          sweetAlert("Error", `An error occurred while changing ${role} status`, "error");
        }
      }
    });
  };

  const handleDeleteUser = async (userId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#01c8a7",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteUserByAdmin({ userId, status: false });
          if (res.status) {
            sweetAlert("Success", "User has been deleted successfully", "success");
            getUsers();
          } else {
            sweetAlert("Error", res.message || "Failed to delete user", "error");
          }
        } catch (error) {
          console.error("Error in deleting user:", error);
          sweetAlert("Error", "An error occurred while deleting user", "error");
        }
      }
    });
  };


  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex w-full min-h-screen bg-gradient-to-br from-[#001430] to-[#031a3d] font-sans">
        <MainSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
        <div
          className="flex flex-col flex-1 transition-all duration-300 ease-in-out"
          style={{
            width: "100%",
            marginLeft: isMobile ? 0 : '230px',
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
              <EnhancedStatisticsGrid statsData={EmployeeData} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <EnhancedSignatureUseCard
                title="User Creation Trend"
                subtitle="Track the trend of user creation over time"
                timeFilterOptions={timeFilterOptions}
                selectedTimeFilter={selectedTimeFilter}
                onTimeFilterChange={setSelectedTimeFilter}
                onApplyDateRange={handleDateRangeApply}
                signatureSendHistoryGraphData={userCreateGraphData}
              />
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
                        <th className="py-3 px-4 text-center text-white">Action</th>
                        <th className="py-3 px-4 text-center text-white">Create Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersArr.data.map((item, index) => (
                        <tr key={index} className="border-b border-[#112F59] hover:bg-[#051b37]">
                          <td className="py-4 px-4 text-white flex items-center">{item?.Username}</td>
                          <td className="py-4 px-4 text-center text-white">{item?.Email}</td>
                          <td className="py-4 px-4 text-center text-white">{item?.PhoneNo}</td>
                          <td className="py-4 px-4 text-center text-white">{item?.country || "N/A"}</td>
                          <td className="py-4 px-4 text-center text-white">
                            <>
                              <label className="inline-flex items-center cursor-pointer">
                                <input type="checkbox" value="" className="sr-only peer" />
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={item?.Is_Active}
                                    onClick={() => handleStatusChange(item?._id, item?.Is_Active, "User")}
                                  />
                                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#01c8a7] after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white  after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white">
                                  </div>
                                </label>
                              </label>
                            </></td>
                          <td className="py-4 px-4 text-white">
                            {item?.Is_AdminDeleted ? <div className="flex justify-center items-center border border-red-700 bg-red-100 text-red-800 px-2 py-2 rounded">
                              User is deleted
                            </div>
                              : <div className="flex justify-center items-center">
                                <Trash2 onClick={() => handleDeleteUser(item?._id)} />
                              </div>}
                          </td>

                          <td className="py-4 px-4 text-center text-white">{ConvertDate(item?.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="bg-[#031123] border border-[#112F59] rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Employees</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-[#112F59]">
                      <tr>
                        <th className="py-3 px-4 text-left text-white">User Name</th>
                        <th className="py-3 px-4 text-center text-white">Email</th>
                        <th className="py-3 px-4 text-center text-white">PhoneNo</th>
                        <th className="py-3 px-4 text-center text-white">country</th>
                        <th className="py-3 px-4 text-center text-white">Status</th>
                        <th className="py-3 px-4 text-center text-white">Action</th>
                        <th className="py-3 px-4 text-center text-white">Create Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employeeArr.data.map((item, index) => (
                        <tr key={index} className="border-b border-[#112F59] hover:bg-[#051b37]">
                          <td className="py-4 px-4 text-white flex items-center">{item?.Username}</td>
                          <td className="py-4 px-4 text-center text-white">{item?.Email}</td>
                          <td className="py-4 px-4 text-center text-white">{item?.PhoneNo}</td>
                          <td className="py-4 px-4 text-center text-white">{item?.country || "N/A"}</td>
                          <td className="py-4 px-4 text-center text-white">
                            <>
                              <label className="inline-flex items-center cursor-pointer">
                                <input type="checkbox" value="" className="sr-only peer" />
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={item?.Is_Active}
                                    onClick={() => handleStatusChange(item?._id, item?.Is_Active, "Employee")}
                                  />
                                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#01c8a7] after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white  after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white">
                                  </div>
                                </label>
                              </label>
                            </></td>
                          <td className="py-4 px-4 text-white">
                            {item?.Is_AdminDeleted ? <div className="flex justify-center items-center border border-red-700 bg-red-100 text-red-800 px-2 py-2 rounded">
                              User is deleted
                            </div>
                              : <div className="flex justify-center items-center">
                                <Trash2 onClick={() => handleDeleteUser(item?._id)} />
                              </div>}
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

      {/* Trending Signature Popup */}
      {/* <TrendingSignaturePopup /> */}
    </SidebarProvider>
  );
};

export default Dashboard;
