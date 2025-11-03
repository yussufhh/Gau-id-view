import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  CreditCard, 
  Calendar,
  Download,
  Filter,
  RefreshCw,
  PieChart,
  Activity,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText
} from 'lucide-react';

const ReportsAnalytics = () => {
  const [dateRange, setDateRange] = useState('30');
  const [reportType, setReportType] = useState('overview');
  const [loading, setLoading] = useState(false);

  // Mock data - in real app, this would come from API
  const [analyticsData] = useState({
    totalStudents: 1247,
    activeCards: 1089,
    pendingApplications: 23,
    expiredCards: 67,
    monthlyRegistrations: [
      { month: 'Jan', students: 45, cards: 42 },
      { month: 'Feb', students: 52, cards: 48 },
      { month: 'Mar', students: 38, cards: 35 },
      { month: 'Apr', students: 61, cards: 58 },
      { month: 'May', students: 73, cards: 70 },
      { month: 'Jun', students: 89, cards: 85 },
      { month: 'Jul', students: 95, cards: 91 },
      { month: 'Aug', students: 78, cards: 75 },
      { month: 'Sep', students: 124, cards: 118 },
      { month: 'Oct', students: 156, cards: 145 },
      { month: 'Nov', students: 98, cards: 89 },
      { month: 'Dec', students: 34, cards: 31 }
    ],
    departmentStats: [
      { department: 'Computer Science', students: 234, percentage: 28.5 },
      { department: 'Business', students: 189, percentage: 23.1 },
      { department: 'Engineering', students: 167, percentage: 20.4 },
      { department: 'Education', students: 143, percentage: 17.4 },
      { department: 'Health Sciences', students: 87, percentage: 10.6 }
    ],
    cardStatusBreakdown: [
      { status: 'Active', count: 1089, color: '#10B981' },
      { status: 'Expired', count: 67, color: '#EF4444' },
      { status: 'Pending', count: 23, color: '#F59E0B' },
      { status: 'Lost/Damaged', count: 15, color: '#F97316' }
    ],
    recentActivity: [
      { type: 'application', student: 'John Doe', action: 'Applied for ID', time: '2 minutes ago' },
      { type: 'approval', student: 'Mary Smith', action: 'Application approved', time: '15 minutes ago' },
      { type: 'print', student: 'David Johnson', action: 'Card printed', time: '1 hour ago' },
      { type: 'issue', student: 'Sarah Wilson', action: 'Card issued', time: '2 hours ago' },
      { type: 'renewal', student: 'Mike Brown', action: 'Card renewed', time: '3 hours ago' }
    ]
  });

  const refreshData = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const exportReport = () => {
    const reportData = {
      generated: new Date().toISOString(),
      dateRange: `Last ${dateRange} days`,
      summary: {
        totalStudents: analyticsData.totalStudents,
        activeCards: analyticsData.activeCards,
        pendingApplications: analyticsData.pendingApplications,
        expiredCards: analyticsData.expiredCards
      },
      departmentBreakdown: analyticsData.departmentStats,
      monthlyTrends: analyticsData.monthlyRegistrations
    };

    const csvContent = "data:text/csv;charset=utf-8," + 
      "GAU ID Management System Report\n" +
      `Generated: ${new Date().toLocaleString()}\n` +
      `Period: Last ${dateRange} days\n\n` +
      "Summary Statistics\n" +
      "Metric,Count\n" +
      `Total Students,${analyticsData.totalStudents}\n` +
      `Active Cards,${analyticsData.activeCards}\n` +
      `Pending Applications,${analyticsData.pendingApplications}\n` +
      `Expired Cards,${analyticsData.expiredCards}\n\n` +
      "Department Breakdown\n" +
      "Department,Students,Percentage\n" +
      analyticsData.departmentStats.map(dept => 
        `${dept.department},${dept.students},${dept.percentage}%`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `GAU_ID_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const StatCard = ({ title, value, change, icon: Icon, color = 'blue' }) => {
    const colorClasses = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      red: 'bg-red-100 text-red-600'
    };

    return (
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-800">{value.toLocaleString()}</p>
            {change && (
              <div className="flex items-center mt-2">
                {change > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(change)}% from last month
                </span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-8 h-8" />
          </div>
        </div>
      </div>
    );
  };

  const BarChart = ({ data, title }) => {
    const maxValue = Math.max(...data.map(d => d.students));
    
    return (
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">{title}</h3>
        <div className="space-y-4">
          {data.slice(-6).map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-12 text-sm text-gray-600">{item.month}</div>
              <div className="flex-1 flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#00923F] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(item.students / maxValue) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 w-8">
                  {item.students}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const PieChartComponent = ({ data, title }) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    let currentAngle = 0;

    return (
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">{title}</h3>
        <div className="flex items-center justify-center">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {data.map((item, index) => {
                const percentage = (item.count / total) * 100;
                const angle = (percentage / 100) * 360;
                const startAngle = currentAngle;
                currentAngle += angle;
                
                const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
                const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
                const x2 = 50 + 40 * Math.cos(((startAngle + angle) * Math.PI) / 180);
                const y2 = 50 + 40 * Math.sin(((startAngle + angle) * Math.PI) / 180);
                
                const largeArcFlag = angle > 180 ? 1 : 0;
                
                return (
                  <path
                    key={index}
                    d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                    fill={item.color}
                    className="hover:opacity-80 transition-opacity"
                  />
                );
              })}
            </svg>
          </div>
        </div>
        <div className="mt-6 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">{item.status}</span>
              </div>
              <div className="text-sm font-medium text-gray-800">
                {item.count} ({((item.count / total) * 100).toFixed(1)}%)
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
            <p className="text-gray-600">Comprehensive system analytics and reporting</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={refreshData}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={exportReport}
              className="flex items-center space-x-2 px-4 py-2 bg-[#00923F] text-white rounded-lg hover:bg-[#007A33] transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last year</option>
          </select>

          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
          >
            <option value="overview">Overview Report</option>
            <option value="students">Student Analytics</option>
            <option value="cards">Card Management</option>
            <option value="departments">Department Breakdown</option>
          </select>

          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={analyticsData.totalStudents}
          change={8.5}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Active ID Cards"
          value={analyticsData.activeCards}
          change={12.3}
          icon={CreditCard}
          color="green"
        />
        <StatCard
          title="Pending Applications"
          value={analyticsData.pendingApplications}
          change={-15.2}
          icon={Clock}
          color="yellow"
        />
        <StatCard
          title="Expired Cards"
          value={analyticsData.expiredCards}
          change={-5.8}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart
          data={analyticsData.monthlyRegistrations}
          title="Monthly Student Registrations"
        />
        
        <PieChartComponent
          data={analyticsData.cardStatusBreakdown}
          title="ID Card Status Distribution"
        />
      </div>

      {/* Department Statistics */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Department Statistics</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-sm font-medium text-gray-500">Department</th>
                <th className="text-left py-3 text-sm font-medium text-gray-500">Students</th>
                <th className="text-left py-3 text-sm font-medium text-gray-500">Percentage</th>
                <th className="text-left py-3 text-sm font-medium text-gray-500">Distribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {analyticsData.departmentStats.map((dept, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-4 text-sm font-medium text-gray-800">{dept.department}</td>
                  <td className="py-4 text-sm text-gray-600">{dept.students.toLocaleString()}</td>
                  <td className="py-4 text-sm text-gray-600">{dept.percentage}%</td>
                  <td className="py-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                        <div 
                          className="bg-[#00923F] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${dept.percentage}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {analyticsData.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-[#00923F] rounded-full flex items-center justify-center">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{activity.student}</p>
                  <p className="text-sm text-gray-600">{activity.action}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">System Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-800">System Uptime</span>
              </div>
              <span className="text-sm font-semibold text-green-600">99.9%</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-800">Processing Speed</span>
              </div>
              <span className="text-sm font-semibold text-blue-600">1.2s avg</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="text-sm text-gray-800">Queue Processing</span>
              </div>
              <span className="text-sm font-semibold text-yellow-600">15 min avg</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-purple-600" />
                <span className="text-sm text-gray-800">Storage Used</span>
              </div>
              <span className="text-sm font-semibold text-purple-600">2.4 GB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Export Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-5 h-5 text-blue-600" />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-800">Student Report</p>
              <p className="text-xs text-gray-600">Complete student database</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-5 h-5 text-green-600" />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-800">Card Status Report</p>
              <p className="text-xs text-gray-600">ID card management data</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-5 h-5 text-purple-600" />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-800">Analytics Summary</p>
              <p className="text-xs text-gray-600">Key metrics and trends</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;