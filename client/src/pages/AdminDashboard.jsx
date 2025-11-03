import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  CreditCard, 
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  UserPlus,
  Filter,
  Download,
  Printer
} from 'lucide-react';
import logo from '../assets/logo.png';

// Import admin components
import ApplicationManagement from '../components/admin/ApplicationManagement';
import StudentManagement from '../components/admin/StudentManagement';
import IDCardManagement from '../components/admin/IDCardManagement';
import ReportsAnalytics from '../components/admin/ReportsAnalytics';
import SystemSettings from '../components/admin/SystemSettings';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(5);
  const [adminData, setAdminData] = useState({
    name: 'Sarah Wanjiku',
    role: 'System Administrator',
    department: 'Student Services',
    email: 'sarah.wanjiku@gau.ac.ke',
    lastLogin: '2024-11-03T08:30:00'
  });

  const [dashboardStats, setDashboardStats] = useState({
    totalStudents: 2547,
    pendingApplications: 23,
    activeCards: 2489,
    expiredCards: 35,
    todayApplications: 8,
    weeklyGrowth: 12,
    systemUptime: '99.8%',
    avgProcessingTime: '2.3 days'
  });

  const [recentApplications, setRecentApplications] = useState([
    {
      id: 'APP-2024-156',
      studentName: 'John Kamau Doe',
      admissionNumber: 'S110/2099/23',
      submittedDate: '2024-11-03T10:30:00',
      status: 'pending',
      priority: 'normal'
    },
    {
      id: 'APP-2024-155',
      studentName: 'Mary Njeri Mwangi',
      admissionNumber: 'S110/2088/23',
      submittedDate: '2024-11-03T09:15:00',
      status: 'reviewing',
      priority: 'high'
    },
    {
      id: 'APP-2024-154',
      studentName: 'David Ochieng Otieno',
      admissionNumber: 'S110/2077/23',
      submittedDate: '2024-11-02T16:45:00',
      status: 'approved',
      priority: 'normal'
    }
  ]);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'applications', label: 'Applications', icon: FileText, badge: dashboardStats.pendingApplications },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'cards', label: 'ID Cards', icon: CreditCard },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    window.location.href = '/';
  };

  const StatCard = ({ title, value, change, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm font-medium">{title}</p>
            <div className={`p-2 rounded-lg ${
              color === 'blue' ? 'bg-blue-100' :
              color === 'green' ? 'bg-green-100' :
              color === 'yellow' ? 'bg-yellow-100' :
              color === 'red' ? 'bg-red-100' : 'bg-gray-100'
            }`}>
              <Icon className={`w-5 h-5 ${
                color === 'blue' ? 'text-blue-600' :
                color === 'green' ? 'text-green-600' :
                color === 'yellow' ? 'text-yellow-600' :
                color === 'red' ? 'text-red-600' : 'text-gray-600'
              }`} />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          {change && (
            <p className={`text-sm mt-2 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '↗' : '↘'} {Math.abs(change)}% from last week
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const QuickActionCard = ({ title, description, icon: Icon, color, onClick }) => (
    <button
      onClick={onClick}
      className="w-full bg-white border border-gray-200 rounded-xl p-6 text-left hover:shadow-md transition-shadow group"
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-lg ${
          color === 'blue' ? 'bg-blue-100 group-hover:bg-blue-200' :
          color === 'green' ? 'bg-green-100 group-hover:bg-green-200' :
          color === 'purple' ? 'bg-purple-100 group-hover:bg-purple-200' :
          'bg-gray-100 group-hover:bg-gray-200'
        } transition-colors`}>
          <Icon className={`w-6 h-6 ${
            color === 'blue' ? 'text-blue-600' :
            color === 'green' ? 'text-green-600' :
            color === 'purple' ? 'text-purple-600' :
            'text-gray-600'
          }`} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 group-hover:text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </button>
  );

  const ApplicationRow = ({ application }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'reviewing': return 'bg-blue-100 text-blue-800';
        case 'approved': return 'bg-green-100 text-green-800';
        case 'rejected': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <tr className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">{application.id}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{application.studentName}</div>
          <div className="text-sm text-gray-500">{application.admissionNumber}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(application.status)}`}>
            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {new Date(application.submittedDate).toLocaleDateString()}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <button className="text-[#00923F] hover:text-[#007A33] text-sm font-medium">
            Review
          </button>
        </td>
      </tr>
    );
  };

  const DashboardContent = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#00923F] to-[#007A33] text-white rounded-2xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {adminData.name}!</h1>
            <p className="text-green-100 text-lg">
              Manage student ID applications and system administration
            </p>
            <div className="mt-4 inline-flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-lg">
              <span className="text-sm font-medium">{adminData.role}</span>
              <span className="text-green-200">•</span>
              <span className="text-sm">{adminData.department}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-green-100 text-sm">System Status</p>
            <p className="text-2xl font-bold">Online</p>
            <p className="text-green-200 text-sm">{dashboardStats.systemUptime} uptime</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={dashboardStats.totalStudents.toLocaleString()}
          change={dashboardStats.weeklyGrowth}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Pending Applications"
          value={dashboardStats.pendingApplications}
          icon={Clock}
          color="yellow"
          subtitle="Needs review"
        />
        <StatCard
          title="Active Cards"
          value={dashboardStats.activeCards.toLocaleString()}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Processing Time"
          value={dashboardStats.avgProcessingTime}
          icon={BarChart3}
          color="blue"
          subtitle="Average"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickActionCard
            title="Review Applications"
            description="Process pending student applications"
            icon={FileText}
            color="blue"
            onClick={() => setActiveTab('applications')}
          />
          <QuickActionCard
            title="Generate Reports"
            description="Create system usage reports"
            icon={BarChart3}
            color="green"
            onClick={() => setActiveTab('reports')}
          />
          <QuickActionCard
            title="Manage Students"
            description="View and edit student records"
            icon={Users}
            color="purple"
            onClick={() => setActiveTab('students')}
          />
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Recent Applications</h2>
            <button 
              onClick={() => setActiveTab('applications')}
              className="text-[#00923F] hover:text-[#007A33] text-sm font-medium"
            >
              View All
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Application ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentApplications.map((application) => (
                <ApplicationRow key={application.id} application={application} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <UserPlus className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">New Applications</span>
              </div>
              <span className="font-semibold text-blue-600">{dashboardStats.todayApplications}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Cards Approved</span>
              </div>
              <span className="font-semibold text-green-600">12</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Printer className="w-5 h-5 text-purple-600" />
                <span className="text-gray-700">Cards Printed</span>
              </div>
              <span className="font-semibold text-purple-600">8</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">System Alerts</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Printer Maintenance</p>
                <p className="text-xs text-yellow-700">ID card printer needs maintenance check</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">Pending Reviews</p>
                <p className="text-xs text-blue-700">23 applications waiting for review</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'applications':
        return <ApplicationManagement />;
      case 'students':
        return <StudentManagement />;
      case 'cards':
        return <IDCardManagement />;
      case 'reports':
        return <ReportsAnalytics />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="GAU Logo" className="w-8 h-8" />
            <div>
              <h2 className="text-lg font-bold text-[#00923F]">GAU-ID-View</h2>
              <p className="text-xs text-gray-600">Admin Portal</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-[#00923F] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      activeTab === item.id 
                        ? 'bg-white text-[#00923F]' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-6 left-3 right-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students, applications..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                    <Bell className="w-6 h-6 text-gray-600" />
                    {notifications > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {notifications}
                      </span>
                    )}
                  </button>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#00923F] rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {adminData.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="hidden md:block">
                    <p className="font-medium text-gray-800">{adminData.name}</p>
                    <p className="text-sm text-gray-600">{adminData.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {renderContent()}
        </main>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;