import React, { useState, useEffect } from 'react';
import { 
  Home, 
  CreditCard, 
  FileText, 
  Bell, 
  User, 
  HelpCircle, 
  LogOut,
  Menu,
  X,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import logo from '../assets/logo.png';
import IDApplicationForm from '../components/IDApplicationForm';
import ApplicationTracking from '../components/ApplicationTracking';
import DigitalIDCard from '../components/DigitalIDCard';
import NotificationsCenter from '../components/NotificationsCenter';
import ProfileManagement from '../components/ProfileManagement';
import SupportCenter from '../components/SupportCenter';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [studentData, setStudentData] = useState({
    name: 'John Doe',
    admissionNumber: 'S110/2099/23',
    department: 'Computer Science',
    course: 'Bachelor of Computer Science',
    year: 'Year 3',
    email: 'john.doe@student.gau.ac.ke',
    phone: '+254 712 345 678'
  });

  const [dashboardStats, setDashboardStats] = useState({
    applicationStatus: 'Under Review',
    notificationCount: 3,
    idValidity: 'Active',
    lastUpdated: '2 hours ago'
  });

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'apply', label: 'Apply for ID', icon: CreditCard },
    { id: 'tracking', label: 'Track Application', icon: Clock },
    { id: 'my-id', label: 'My ID', icon: FileText },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: notifications },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'support', label: 'Support', icon: HelpCircle }
  ];

  const handleLogout = () => {
    // Clear localStorage and redirect to login
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const StatCard = ({ title, value, status, icon: Icon, color }) => (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
          {status && (
            <p className={`text-sm mt-1 ${color || 'text-gray-500'}`}>{status}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color === 'text-green-600' ? 'bg-green-100' : 
          color === 'text-blue-600' ? 'bg-blue-100' : 
          color === 'text-yellow-600' ? 'bg-yellow-100' : 'bg-gray-100'}`}>
          <Icon className={`w-6 h-6 ${color || 'text-gray-600'}`} />
        </div>
      </div>
    </div>
  );

  const DashboardContent = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#00923F] to-[#007A33] text-white rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {studentData.name}!</h1>
        <p className="text-green-100 text-lg">
          Manage your digital student ID and track your applications easily.
        </p>
        <div className="mt-4 inline-flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-lg">
          <span className="text-sm font-medium">{studentData.admissionNumber}</span>
          <span className="text-green-200">•</span>
          <span className="text-sm">{studentData.course}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Application Status"
          value={dashboardStats.applicationStatus}
          icon={Clock}
          color="text-yellow-600"
        />
        <StatCard
          title="Notifications"
          value={dashboardStats.notificationCount}
          status="New messages"
          icon={Bell}
          color="text-blue-600"
        />
        <StatCard
          title="ID Status"
          value={dashboardStats.idValidity}
          status="Valid until Dec 2025"
          icon={CheckCircle}
          color="text-green-600"
        />
        <StatCard
          title="Last Updated"
          value={dashboardStats.lastUpdated}
          icon={Calendar}
          color="text-gray-600"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">ID Application Submitted</p>
              <p className="text-sm text-gray-600">Your application has been received and is under review</p>
            </div>
            <span className="text-sm text-gray-500">2 hours ago</span>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">Profile Updated</p>
              <p className="text-sm text-gray-600">Contact information has been successfully updated</p>
            </div>
            <span className="text-sm text-gray-500">1 day ago</span>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">Document Verification</p>
              <p className="text-sm text-gray-600">Please upload your national ID copy</p>
            </div>
            <span className="text-sm text-gray-500">2 days ago</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => setActiveTab('apply')}
            className="flex items-center space-x-3 p-4 bg-[#00923F] text-white rounded-lg hover:bg-[#007A33] transition-colors"
          >
            <CreditCard className="w-5 h-5" />
            <span>Apply for New ID</span>
          </button>
          <button 
            onClick={() => setActiveTab('tracking')}
            className="flex items-center space-x-3 p-4 border-2 border-[#00923F] text-[#00923F] rounded-lg hover:bg-[#00923F] hover:text-white transition-colors"
          >
            <Clock className="w-5 h-5" />
            <span>Track Application</span>
          </button>
          <button 
            onClick={() => setActiveTab('support')}
            className="flex items-center space-x-3 p-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
            <span>Get Support</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'apply':
        return <IDApplicationForm />;
      case 'tracking':
        return <ApplicationTracking />;
      case 'my-id':
        return <DigitalIDCard />;
      case 'notifications':
        return <NotificationsCenter />;
      case 'profile':
        return <ProfileManagement />;
      case 'support':
        return <SupportCenter />;
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
              <p className="text-xs text-gray-600">Student Portal</p>
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
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
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
                    {studentData.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="font-medium text-gray-800">{studentData.name}</p>
                  <p className="text-sm text-gray-600">{studentData.admissionNumber}</p>
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

export default StudentDashboard;