
import React, { useState, useEffect, useMemo } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import MainSidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useIsMobile } from "@/hooks/use-mobile";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import EnhancedStatisticsGrid from "@/components/dashboard/EnhancedStatisticsGrid";
import EnhancedAudienceOverviewCard from "@/components/dashboard/EnhancedAudienceOverviewCard";
import EnhancedButtonClickTrackingCard from "@/components/dashboard/EnhancedButtonClickTrackingCard";
import EnhancedSignatureOverviewCard from "@/components/dashboard/EnhancedSignatureOverviewCard";
import EnhancedSignatureUseCard from "@/components/dashboard/EnhancedSignatureUseCard";
import SignatureGrid from "@/components/dashboard/SignatureGrid";
import TrendingSignaturePopup from "@/components/signature/TrendingSignaturePopup";
import {ConvertDate} from "../../Utils/CommonFunctions"
import { dashboardSummary, btnClickedGraphData, audienceOverviewGraphData, signatureSendGraphData, sigantureUseAnalytics } from '@/service/User/signatureDashbaord'




interface TimeFilterOption {
  label: string;
  value: string;
}
interface SignatureItem {
  id: string;
  title: string;
  date: string;
  status: "active" | "pending" | "expired";
  details?: {
    name: string;
    jobTitle: string;
    company: string;
    email: string;
    phone?: string;
    website?: string;
    layout: string;
  };
}
interface UserData {
  totalSignatures: number;
  totalSignatureViews: number;
  totalLinkClicks: number;
  conversionRate: number,

}


interface UsersArr {
  currectUserData: UserData;
  percentage_change: PercentageChange;

}

interface PercentageChange {
  totalSignatures: number;
  totalSignatureViews: number;
  totalLinkClicks: number;
  conversionRate: number;

}
const dashboardSampleSignatures: SignatureItem[] = [
  {
    id: "sig-1",
    title: "Business Signature",
    date: "Jan 15, 2025",
    status: "active",
    details: {
      name: "Renato Rodic",
      jobTitle: "Mortgage Loan Officer",
      company: "NEXA Mortgage",
      email: "info@nexamortgage.com",
      phone: "(480) 307-4107",
      website: "https://renatarodic.com/",
      layout: "standard"
    }
  },
  {
    id: "sig-2",
    title: "Personal Signature",
    date: "Jan 20, 2025",
    status: "active",
    details: {
      name: "Renato Rodic",
      jobTitle: "Mortgage Loan Officer",
      company: "NEXA Mortgage",
      email: "info@nexamortgage.com",
      phone: "(480) 307-4107",
      website: "https://renatarodic.com/",
      layout: "modern"
    }
  },
  {
    id: "sig-3",
    title: "Marketing Signature",
    date: "Feb 5, 2025",
    status: "pending",
    details: {
      name: "Renato Rodic",
      jobTitle: "Mortgage Loan Officer",
      company: "NEXA Mortgage",
      email: "info@nexamortgage.com",
      phone: "(480) 307-4107",
      website: "https://renatarodic.com/",
      layout: "compact"
    }
  },
  {
    id: "sig-4",
    title: "Conference Signature",
    date: "Feb 10, 2025",
    status: "active",
    details: {
      name: "Renato Rodic",
      jobTitle: "Mortgage Loan Officer",
      company: "NEXA Mortgage",
      email: "info@nexamortgage.com",
      phone: "(480) 307-4107",
      website: "https://renatarodic.com/",
      layout: "standard"
    }
  },
];

interface Signature {
  _id: string;
  SignatureName: string;
  usageCount: string,
  buttonClicks: string,
  socialClicks: string,
  totalViews: string,
  lastUsed:string
}

const timeFilterOptions: TimeFilterOption[] = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "this_week" },
  { label: "This Month", value: "this_month" },
  { label: "This Year", value: "this_year" },
];

const Index = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [selectedTimeFilter, setSelectedTimeFilter] = React.useState("this_month");
  const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear().toString());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const userData = JSON.parse(localStorage.getItem('user'))
  const [btnClickDataArr, setBtnClickDataArr] = useState([])
  const [audienceViewAndClickDraphData, setAudienceViewAndClickDraphData] = useState([])
  const [signatureSendHistoryGraphData, setSignatureSendHistoryGraphData] = useState([])
  const [signatures, setSignatures] = useState<Signature[]>([]);

  const [signatureOverviewData, setSignatureOverviewData] = useState<UsersArr>({
    currectUserData: {
      totalSignatures: 0,
      totalSignatureViews: 0,
      totalLinkClicks: 0,
      conversionRate: 0,
    },
    percentage_change: {
      totalSignatures: 0,
      totalSignatureViews: 0,
      totalLinkClicks: 0,
      conversionRate: 0,

    },

  });

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const statsData = {
    day: [
      { title: "Total Signatures", value: signatureOverviewData?.currectUserData?.totalSignatures, change: signatureOverviewData?.percentage_change?.totalSignatures, isPositive: Number(signatureOverviewData?.percentage_change?.totalSignatures) >= 0 ? true : false },
      { title: "Total Signature Views", value: signatureOverviewData?.currectUserData?.totalSignatureViews, change: signatureOverviewData?.percentage_change?.totalSignatureViews, isPositive: Number(signatureOverviewData?.percentage_change?.totalSignatureViews) >= 0 ? true : false },
      { title: "Total Link Clicks", value: signatureOverviewData?.currectUserData?.totalLinkClicks, change: signatureOverviewData?.percentage_change?.totalLinkClicks, isPositive: Number(signatureOverviewData?.percentage_change?.totalLinkClicks) >= 0 ? true : false },
      { title: "Conversion Rate", value: signatureOverviewData?.currectUserData?.conversionRate, change: signatureOverviewData?.percentage_change?.conversionRate, isPositive: Number(signatureOverviewData?.percentage_change?.conversionRate) >= 0 ? true : false },
    ]
  };

  const filterPayload = useMemo(() => ({
    userId: userData?._id,
    filter_type: selectedTimeFilter,
    start_date: startDate,
    end_date: endDate
  }), [userData, selectedTimeFilter, startDate, endDate]);
  
  useEffect(() => {
    if (!userData) return;
    getDashboardSummary();
    getBtnClickedGraphData();
    getAudienceOverviewGraphData();
    getSignatureSendGraphData();
    getSignature();
  }, [filterPayload]);

  
  const getDashboardSummary = async () => {
    const req = { userId: userData?._id, filter_type: selectedTimeFilter, start_date: startDate, end_date: endDate }
    await dashboardSummary(req)
      .then((res) => {
        if (res?.status) {
          setSignatureOverviewData({
            currectUserData: res?.current,
            percentage_change: res?.percentage_change,

          })
        }
        else {
          setSignatureOverviewData({
            currectUserData: {
              totalSignatures: 0,
              totalSignatureViews: 0,
              totalLinkClicks: 0,
              conversionRate: 0
            },
            percentage_change: {
              totalSignatures: 0,
              totalSignatureViews: 0,
              totalLinkClicks: 0,
              conversionRate: 0
            },

          })
        }
      })
      .catch((error) => {
        console.log("error in fetching the user details", error)
      })
  }

  const getBtnClickedGraphData = async () => {
    const req = { userId: userData?._id, filter_type: selectedTimeFilter, start_date: startDate, end_date: endDate }
    await btnClickedGraphData(req)
      .then((res) => {
        if (res?.status) {
          setBtnClickDataArr(res?.data)
        }
        else {
          setBtnClickDataArr([])
        }
      }).catch((error) => {
        console.log("error in fetching btn click graph data", error)
      })

  }

  const getAudienceOverviewGraphData = async () => {
    const req = { userId: userData?._id, filter_type: selectedTimeFilter, start_date: startDate, end_date: endDate }
    await audienceOverviewGraphData(req)
      .then((res) => {
        if (res?.status) {
          setAudienceViewAndClickDraphData(res?.data || [])
        }
        else {
          setAudienceViewAndClickDraphData([])
        }
      }).catch((error) => {
        console.log("error in fetching btn click graph data", error)
      })

  }

  const getSignatureSendGraphData = async () => {
    const req = { userId: userData?._id, filter_type: selectedTimeFilter, start_date: startDate, end_date: endDate }
    await signatureSendGraphData(req)
      .then((res) => {
        if (res?.status) {
          setSignatureSendHistoryGraphData(res?.data)
        }
        else {
          setSignatureSendHistoryGraphData([])
        }
      }).catch((error) => {
        console.log("error in fetching btn click graph data", error)
      })

  }


  const getSignature = async () => {
    const req = { userId: userData?._id }
    await sigantureUseAnalytics(req)
      .then((res) => {
        if (res?.status) {
          setSignatures(res?.data)
        }
        else {
          setSignatures([])
        }
      })
      .catch((error) => {
        console.log("Error in fetching the signature", error)
      })
  }

  const handleDateRangeApply = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);

  }
 

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
          <Header
            onMenuClick={handleMenuClick}
          />

          <div className="p-6">
            <DashboardHeader
              title="Dashboard"
              subtitle={`Welcome back, ${userData?.FirstName} ${userData?.LastName}`}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <EnhancedAudienceOverviewCard
                title="Audience Overview"
                subtitle={`Device types used to view your signatures`}
                timeFilterOptions={timeFilterOptions}
                selectedTimeFilter={selectedTimeFilter}
                onTimeFilterChange={setSelectedTimeFilter}
                onApplyDateRange={handleDateRangeApply}
                audienceViewAndClickDraphData={audienceViewAndClickDraphData}
              />

              <EnhancedButtonClickTrackingCard
                title="Button Click Tracking"
                subtitle={`Track which buttons in your signature get the most clicks`}
                timeFilterOptions={timeFilterOptions}
                selectedTimeFilter={selectedTimeFilter}
                onTimeFilterChange={setSelectedTimeFilter}
                onApplyDateRange={handleDateRangeApply}
                GraphData={btnClickDataArr}
              />


            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <EnhancedSignatureOverviewCard />
              <EnhancedSignatureUseCard
                title="Button Click Tracking"
                subtitle={`Track which buttons in your signature get the most clicks`}
                timeFilterOptions={timeFilterOptions}
                selectedTimeFilter={selectedTimeFilter}
                onTimeFilterChange={setSelectedTimeFilter}
                onApplyDateRange={handleDateRangeApply}
                signatureSendHistoryGraphData={signatureSendHistoryGraphData}
              />
            </div>

            {/* <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-xl font-semibold">Trending Signatures</h2>
              </div>
              <SignatureGrid
                items={dashboardSampleSignatures}
              />
            </div> */}

            <div className="mt-6">
              <div className="bg-[#031123] border border-[#112F59] rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Signature Usage Analytics</h2>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-[#112F59]">
                      <tr>
                        <th className="py-3 px-4 text-left text-white">Signature Name</th>
                        <th className="py-3 px-4 text-center text-white">Usage Count</th>
                        <th className="py-3 px-4 text-center text-white">Total Views</th>
                        <th className="py-3 px-4 text-center text-white">Total Clicks</th>
                        <th className="py-3 px-4 text-center text-white">Social Clicks</th>
                        <th className="py-3 px-4 text-center text-white">Button Clicks</th>
                        <th className="py-3 px-4 text-center text-white">Last Used</th>

                      </tr>
                    </thead>
                    <tbody>
                      {signatures?.map((item) => (
                        <tr key={item?._id} className="border-b border-[#112F59] hover:bg-[#051b37]">
                          <td className="py-4 px-4 text-white flex items-center"> <span>{item?.SignatureName}</span> </td>
                          <td className="py-4 px-4 text-center text-white">{item?.usageCount}</td>
                          <td className="py-4 px-4 text-center text-[#01C8A9]">{item?.totalViews}</td>
                          <td className="py-4 px-4 text-center text-white">{item?.buttonClicks + item?.socialClicks}</td>
                          <td className="py-4 px-4 text-center text-gray-400">{item?.socialClicks}</td>
                          <td className="py-4 px-4 text-center text-gray-400">{item?.buttonClicks}</td>
                          <td className="py-4 px-4 text-center text-gray-400">{ConvertDate(item?.lastUsed)}</td>
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
      <TrendingSignaturePopup />
    </SidebarProvider>
  );
};

export default Index;
