import React, { Suspense, lazy, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "../../components/Dashboard/Layout";
import * as Components from "../../components/all";
import { getAnalytics } from "../../features/lms/getAnalytics";

const DataCard = lazy(() => import("../../components/DataCard"));
const Chart = lazy(() => import("../../components/Chart"));

const Analytics = (props) => {
  const { currentUser } = props;
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("12months");

  // Real revenue/sales totals from the new purchases collection.
  // No teacherId -> admin-wide aggregate across all courses.
  const { data: analytics = { totalRevenue: 0, totalSales: 0, data: [] } } =
    useQuery({
      queryKey: ["analytics", "admin"],
      queryFn: () => getAnalytics(),
      enabled: !!currentUser?.isAdmin,
      staleTime: 60 * 1000,
    });

  // Mock data - replace with actual API calls
  const [analyticsData, setAnalyticsData] = useState({
    totalRevenue: 15750.50,
    totalSales: 234,
    totalInvoices: 89,
    avgInvoiceValue: 176.97,
    monthlyData: [
      { name: "Jan", sales: 1200, revenue: 2100.50 },
      { name: "Feb", sales: 1350, revenue: 2350.75 },
      { name: "Mar", sales: 980, revenue: 1890.25 },
      { name: "Apr", sales: 1580, revenue: 2780.90 },
      { name: "May", sales: 1890, revenue: 3250.80 },
      { name: "Jun", sales: 1650, revenue: 2890.60 },
      { name: "Jul", sales: 2100, revenue: 3650.25 },
      { name: "Aug", sales: 1750, revenue: 3100.40 },
      { name: "Sep", sales: 1920, revenue: 3380.75 },
      { name: "Oct", sales: 2250, revenue: 3950.90 },
      { name: "Nov", sales: 2080, revenue: 3680.85 },
      { name: "Dec", sales: 2340, revenue: 4200.25 },
    ]
  });

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Calculate growth metrics
  const calculateGrowth = (data, field) => {
    if (data.length < 2) return 0;
    const current = data[data.length - 1][field];
    const previous = data[data.length - 2][field];
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const revenueGrowth = calculateGrowth(analyticsData.monthlyData, 'revenue');
  const salesGrowth = calculateGrowth(analyticsData.monthlyData, 'sales');

  if (!currentUser) {
    return (
      <Layout>
        <div className="p-4 flex-1 flex flex-col h-full overflow-auto">
          <div className="relative flex bg-white py-8 px-8 items-center justify-center rounded-md shadow">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F38315] mx-auto mb-4"></div>
              <Components.SubHeading className="!text-2xl">Loading...</Components.SubHeading>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!currentUser.isAdmin) {
    return (
      <Layout>
        <div className="p-4 flex-1 flex flex-col h-full overflow-auto">
          <div className="relative flex bg-white py-8 px-8 items-center justify-center rounded-md shadow">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <Components.SubHeading className="!text-2xl text-gray-500 mb-2">
                Access Denied
              </Components.SubHeading>
              <Components.Paragraph className="text-gray-400">
                You need admin privileges to view analytics.
              </Components.Paragraph>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 flex-1 flex flex-col h-full overflow-auto">
        {/* Header Section */}
        <div className="relative flex bg-white py-6 px-8 items-center rounded-md shadow mb-6">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col items-start">
              <Components.SubHeading className="!text-3xl mb-2">
                Business <span className="text-[#F38315]">Analytics</span>
              </Components.SubHeading>
              <Components.Paragraph className="!font-[Grandstander] text-gray-600">
                Track your business performance and revenue trends
              </Components.Paragraph>
            </div>

            {/* Timeframe Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">View:</span>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F38315] focus:border-transparent text-sm"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="3months">Last 3 Months</option>
                <option value="12months">Last 12 Months</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Analytics Content */}
        <div className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Suspense fallback={
              <div className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-3"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            }>
              <DataCard
                label="Total Revenue"
                value={analytics.totalRevenue}
                shouldFormat
                growth={null}
                icon="💰"
                trend="up"
              />
              <DataCard
                label="Total Sales"
                value={analytics.totalSales}
                growth={null}
                icon="📊"
                trend="up"
              />
              <DataCard 
                label="Total Invoices" 
                value={analyticsData.totalInvoices} 
                growth="12.5"
                icon="🧾"
                trend="up"
              />
              <DataCard 
                label="Avg Invoice Value" 
                value={analyticsData.avgInvoiceValue} 
                shouldFormat
                growth="-2.1"
                icon="📈"
                trend="down"
              />
            </Suspense>
          </div>

          {/* Revenue Trends Section */}
          <div className="bg-white rounded-md shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <Components.SubHeading className="!text-xl mb-1">
                    Revenue Trends
                  </Components.SubHeading>
                  <Components.Paragraph className="text-gray-600">
                    Monthly revenue and sales performance over time
                  </Components.Paragraph>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#F38315] rounded-full mr-2"></div>
                    Revenue
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    Sales
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F38315] mx-auto mb-4"></div>
                    <Components.Paragraph>Loading chart data...</Components.Paragraph>
                  </div>
                </div>
              ) : (
                <Suspense fallback={
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F38315] mx-auto mb-4"></div>
                      <Components.Paragraph>Loading chart...</Components.Paragraph>
                    </div>
                  </div>
                }>
                  <Chart data={analyticsData.monthlyData} />
                </Suspense>
              )}
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Performing Month */}
            <div className="bg-white rounded-md shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <Components.SubHeading className="!text-lg">
                  Top Month
                </Components.SubHeading>
                <svg className="w-6 h-6 text-[#F38315]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-[#F38315]">December</div>
                <div className="text-sm text-gray-600">$4,200.25 revenue</div>
                <div className="text-xs text-green-600">+12% vs previous month</div>
              </div>
            </div>

            {/* Revenue Goal Progress */}
            <div className="bg-white rounded-md shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <Components.SubHeading className="!text-lg">
                  Annual Goal
                </Components.SubHeading>
                <svg className="w-6 h-6 text-[#F38315]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">78.8%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#F38315] h-2 rounded-full" style={{ width: '78.8%' }}></div>
                </div>
                <div className="text-xs text-gray-600">$15,750 of $20,000 goal</div>
              </div>
            </div>

            {/* Average Transaction */}
            <div className="bg-white rounded-md shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <Components.SubHeading className="!text-lg">
                  Avg Transaction
                </Components.SubHeading>
                <svg className="w-6 h-6 text-[#F38315]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-[#F38315]">$176.97</div>
                <div className="text-sm text-gray-600">Per invoice</div>
                <div className="text-xs text-red-600">-2.1% vs last month</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;