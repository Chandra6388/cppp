import React, { useState, useEffect, useMemo, Suspense } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import MainSidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useIsMobile } from "@/hooks/use-mobile";
import EnhancedStatisticsGrid from "@/components/dashboard/EnhancedStatisticsGrid";
const EnhancedAudienceOverviewCard = React.lazy(() => import("@/components/dashboard/EnhancedAudienceOverviewCard"));
const EnhancedButtonClickTrackingCard = React.lazy(() => import("@/components/dashboard/EnhancedButtonClickTrackingCard"));
import EnhancedSignatureOverviewCard from "@/components/dashboard/EnhancedSignatureOverviewCard";
import EnhancedSignatureUseCard from "@/components/dashboard/EnhancedSignatureUseCard";
import TrendingSignaturePopup from "@/components/signature/TrendingSignaturePopup";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { ConvertDate } from "../../Utils/CommonFunctions";
import { dashboardSummary, btnClickedGraphData, audienceOverviewGraphData, signatureCreatedAnalytics, sigantureUseAnalytics, viewOpratingSystem } from '@/service/User/signatureDashbaord';

const timeFilterOptions = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "this_week" },
  { label: "This Month", value: "this_month" },
  { label: "This Year", value: "this_year" },
];

const Index = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("this_month");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [userData, setUserData] = useState(null);
  const [btnClickDataArr, setBtnClickDataArr] = useState([]);
  const [audienceViewAndClickDraphData, setAudienceViewAndClickDraphData] = useState([]);
  const [signatureSendHistoryGraphData, setSignatureSendHistoryGraphData] = useState([]);
  const [signatures, setSignatures] = useState([]);
  const [operatingSystem, setoOperatingSystem] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [signatureOverviewData, setSignatureOverviewData] = useState({
    currentUserData: { totalSignatures: 0, totalSignatureViews: 0, totalLinkClicks: 0, conversionRate: 0 },
    percentage_change: { totalSignatures: 0, totalSignatureViews: 0, totalLinkClicks: 0, conversionRate: 0 },
  });

  useEffect(() => {
    const data = localStorage.getItem('user');
    if (data) setUserData(JSON.parse(data));
  }, []);

  const filterPayload = useMemo(() => ({
    userId: userData?._id,
    filter_type: selectedTimeFilter,
    start_date: startDate,
    end_date: endDate
  }), [userData, selectedTimeFilter, startDate, endDate]);

  useEffect(() => {
    if (!userData) return;
    fetchAllDashboardData();
  }, [filterPayload]);

  const fetchAllDashboardData = async () => {
    const req = filterPayload;
    try {
      const [summary, btnClicks, audienceData, signatureData, usageData, os] = await Promise.all([
        dashboardSummary(req).catch(() => null),
        btnClickedGraphData(req).catch(() => null),
        audienceOverviewGraphData(req).catch(() => null),
        signatureCreatedAnalytics(req).catch(() => null),
        sigantureUseAnalytics(req).catch(() => null),
        viewOpratingSystem(req).catch(() => null),
      ]);

      if (summary?.status) setSignatureOverviewData({ currentUserData: summary.current, percentage_change: summary.percentage_change });
      else setSignatureOverviewData({ currentUserData: { totalSignatures: 0, totalSignatureViews: 0, totalLinkClicks: 0, conversionRate: 0 }, percentage_change: { totalSignatures: 0, totalSignatureViews: 0, totalLinkClicks: 0, conversionRate: 0 } });

      if (btnClicks?.status) setBtnClickDataArr(btnClicks.data);
      else setBtnClickDataArr([]);

      if (audienceData?.status) setAudienceViewAndClickDraphData(audienceData.data);
      else setAudienceViewAndClickDraphData([]);

      if (signatureData?.status) setSignatureSendHistoryGraphData(signatureData.data);
      else setSignatureSendHistoryGraphData([]);

      if (usageData?.status) setSignatures(usageData.data);
      else setSignatures([]);

      if (os?.status) setoOperatingSystem(os.data);
      else setoOperatingSystem([]);

    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    }
  };

  const handleDateRangeApply = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const statsData = {
    day: [
      { title: "Total Signatures", value: signatureOverviewData?.currentUserData?.totalSignatures, change: signatureOverviewData?.percentage_change?.totalSignatures, isPositive: signatureOverviewData?.percentage_change?.totalSignatures >= 0 },
      { title: "Total Signature Views", value: signatureOverviewData?.currentUserData?.totalSignatureViews, change: signatureOverviewData?.percentage_change?.totalSignatureViews, isPositive: signatureOverviewData?.percentage_change?.totalSignatureViews >= 0 },
      { title: "Total Link Clicks", value: signatureOverviewData?.currentUserData?.totalLinkClicks, change: signatureOverviewData?.percentage_change?.totalLinkClicks, isPositive: signatureOverviewData?.percentage_change?.totalLinkClicks >= 0 },
      { title: "Conversion Rate", value: signatureOverviewData?.currentUserData?.conversionRate, change: signatureOverviewData?.percentage_change?.conversionRate, isPositive: signatureOverviewData?.percentage_change?.conversionRate >= 0 },
    ]
  };

  const handleMenuClick = () => setSidebarOpen(true);

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex w-full min-h-screen bg-gradient-to-br from-[#001430] to-[#031a3d] font-sans">
        
        <MainSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} onCollapseChange={setSidebarCollapsed} />
        <div className="flex flex-col flex-1 transition-all duration-300 ease-in-out" style={{ width: "100%", marginLeft: isMobile ? 0 : sidebarCollapsed ? '70px' : '250px', paddingBottom: isMobile ? '80px' : '0' }}>

          <Header onMenuClick={handleMenuClick} />
          <div className="p-6">
            <DashboardHeader
              title="Dashboard"
              subtitle={`Welcome back, ${userData?.FirstName || ''} ${userData?.LastName || ''}`}
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
              <Suspense fallback={<div>Loading Audience Overview...</div>}>
                <EnhancedAudienceOverviewCard
                  title="Audience Overview"
                  subtitle="Device types used to view your signatures"
                  timeFilterOptions={timeFilterOptions}
                  selectedTimeFilter={selectedTimeFilter}
                  onTimeFilterChange={setSelectedTimeFilter}
                  onApplyDateRange={handleDateRangeApply}
                  audienceViewAndClickDraphData={audienceViewAndClickDraphData}
                />
              </Suspense>

              <Suspense fallback={<div>Loading Button Click Tracking...</div>}>
                <EnhancedButtonClickTrackingCard
                  title="Button Click Tracking"
                  subtitle="Track which buttons in your signature get the most clicks"
                  timeFilterOptions={timeFilterOptions}
                  selectedTimeFilter={selectedTimeFilter}
                  onTimeFilterChange={setSelectedTimeFilter}
                  onApplyDateRange={handleDateRangeApply}
                  GraphData={btnClickDataArr}
                />
              </Suspense>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <EnhancedSignatureOverviewCard
                title="Signature Engagement by Device Type"
                subtitle="Track which platforms are being used to view and sign documents"
                timeFilterOptions={timeFilterOptions}
                selectedTimeFilter={selectedTimeFilter}
                onTimeFilterChange={setSelectedTimeFilter}
                onApplyDateRange={handleDateRangeApply}
                operatingSystem={operatingSystem}
              />
              <EnhancedSignatureUseCard
                title="Signature create"
                subtitle="See the trend of signature creation over selected time periods."
                timeFilterOptions={timeFilterOptions}
                selectedTimeFilter={selectedTimeFilter}
                onTimeFilterChange={setSelectedTimeFilter}
                onApplyDateRange={handleDateRangeApply}
                signatureSendHistoryGraphData={signatureSendHistoryGraphData}
              />
            </div>

            <div className="mt-6">
              <div className="bg-[#031123] border border-[#112F59] rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Signature Usage Analytics</h2>
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-[#112F59] scrollbar-track-transparent">
                  <table className="min-w-[800px] w-full">

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
                      {(signatures || []).map((item) => (
                        <tr key={item._id} className="border-b border-[#112F59] hover:bg-[#051b37]">
                          <td className="py-4 px-4 text-white">{item.SignatureName}</td>
                          <td className="py-4 px-4 text-center text-white">{item.usageCount}</td>
                          <td className="py-4 px-4 text-center text-[#01C8A9]">{item.totalViews}</td>
                          <td className="py-4 px-4 text-center text-white">{+item.buttonClicks + +item.socialClicks}</td>
                          <td className="py-4 px-4 text-center text-gray-400">{item.socialClicks}</td>
                          <td className="py-4 px-4 text-center text-gray-400">{item.buttonClicks}</td>
                          <td className="py-4 px-4 text-center text-gray-400">{ConvertDate(item.lastUsed)}</td>
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
      {/* <TrendingSignaturePopup /> */}
    </SidebarProvider>
  );
};

export default Index;
