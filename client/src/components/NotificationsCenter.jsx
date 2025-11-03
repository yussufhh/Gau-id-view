import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  MessageSquare,
  Trash2,
  Mail,
  Filter,
  Search,
  Calendar,
  User,
  FileText,
  Shield
} from 'lucide-react';

const NotificationsCenter = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'application',
      title: 'ID Application Update',
      message: 'Your student ID application has been approved and is now being processed.',
      timestamp: '2024-01-20T10:30:00',
      read: false,
      priority: 'high',
      category: 'Application Status'
    },
    {
      id: 2,
      type: 'document',
      title: 'Document Verification Required',
      message: 'Please upload a clearer copy of your national ID. The current image is not legible.',
      timestamp: '2024-01-19T14:15:00',
      read: false,
      priority: 'high',
      category: 'Document Upload'
    },
    {
      id: 3,
      type: 'system',
      title: 'System Maintenance Notice',
      message: 'The GAU-ID system will undergo maintenance on January 25th from 2:00 AM to 6:00 AM.',
      timestamp: '2024-01-18T09:00:00',
      read: true,
      priority: 'medium',
      category: 'System Update'
    },
    {
      id: 4,
      type: 'reminder',
      title: 'ID Card Collection Reminder',
      message: 'Your student ID card is ready for collection at the Student Services Office.',
      timestamp: '2024-01-17T16:45:00',
      read: false,
      priority: 'medium',
      category: 'Collection Notice'
    },
    {
      id: 5,
      type: 'welcome',
      title: 'Welcome to GAU-ID-View',
      message: 'Welcome to the new digital student ID system. Complete your profile to get started.',
      timestamp: '2024-01-15T08:00:00',
      read: true,
      priority: 'low',
      category: 'Welcome Message'
    },
    {
      id: 6,
      type: 'security',
      title: 'Profile Security Update',
      message: 'Your account password was successfully updated on January 14th at 3:22 PM.',
      timestamp: '2024-01-14T15:22:00',
      read: true,
      priority: 'medium',
      category: 'Security Alert'
    }
  ]);

  const [filterBy, setFilterBy] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'application': return CheckCircle;
      case 'document': return FileText;
      case 'system': return Shield;
      case 'reminder': return Clock;
      case 'welcome': return MessageSquare;
      case 'security': return Shield;
      default: return Bell;
    }
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') return 'text-red-600 bg-red-100';
    if (type === 'application') return 'text-green-600 bg-green-100';
    if (type === 'document') return 'text-blue-600 bg-blue-100';
    if (type === 'system') return 'text-purple-600 bg-purple-100';
    if (type === 'reminder') return 'text-yellow-600 bg-yellow-100';
    if (type === 'security') return 'text-orange-600 bg-orange-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInHours = Math.floor((now - notificationTime) / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return notificationTime.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filterBy === 'all' || 
                         (filterBy === 'unread' && !notification.read) ||
                         (filterBy === 'read' && notification.read) ||
                         notification.type === filterBy;
    
    const matchesSearch = searchTerm === '' || 
                         notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAsUnread = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: false }
          : notification
      )
    );
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const toggleNotificationSelection = (notificationId) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const deleteSelectedNotifications = () => {
    setNotifications(prev => prev.filter(n => !selectedNotifications.includes(n.id)));
    setSelectedNotifications([]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Bell className="w-8 h-8 text-[#00923F]" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
              <p className="text-gray-600">
                {unreadCount} unread of {notifications.length} total notifications
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {selectedNotifications.length > 0 && (
              <button
                onClick={deleteSelectedNotifications}
                className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete ({selectedNotifications.length})</span>
              </button>
            )}
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-[#00923F] text-white rounded-lg hover:bg-[#007A33] transition-colors"
            >
              Mark All Read
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
            >
              <option value="all">All Notifications</option>
              <option value="unread">Unread Only</option>
              <option value="read">Read Only</option>
              <option value="application">Application Updates</option>
              <option value="document">Document Requests</option>
              <option value="system">System Notices</option>
              <option value="reminder">Reminders</option>
              <option value="security">Security Alerts</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-12 text-center">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No notifications found</h3>
            <p className="text-gray-500">
              {searchTerm || filterBy !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'You\'re all caught up! New notifications will appear here.'
              }
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type);
            const isSelected = selectedNotifications.includes(notification.id);
            
            return (
              <div
                key={notification.id}
                className={`bg-white rounded-2xl shadow-md border transition-all hover:shadow-lg ${
                  !notification.read 
                    ? 'border-l-4 border-l-[#00923F] border-gray-100' 
                    : 'border-gray-100'
                } ${isSelected ? 'ring-2 ring-[#00923F]' : ''}`}
              >
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleNotificationSelection(notification.id)}
                      className="mt-1 w-4 h-4 text-[#00923F] border-gray-300 rounded focus:ring-[#00923F]"
                    />
                    
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getNotificationColor(notification.type, notification.priority)}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-[#00923F] rounded-full"></span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                            {notification.priority.toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                        </div>
                      </div>
                      
                      <p className={`text-sm mb-3 ${!notification.read ? 'text-gray-800' : 'text-gray-600'}`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                          {notification.category}
                        </span>
                        
                        <div className="flex space-x-2">
                          {!notification.read ? (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-sm text-[#00923F] hover:text-[#007A33] flex items-center space-x-1"
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span>Mark as read</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => markAsUnread(notification.id)}
                              className="text-sm text-gray-600 hover:text-gray-800 flex items-center space-x-1"
                            >
                              <Mail className="w-4 h-4" />
                              <span>Mark as unread</span>
                            </button>
                          )}
                          
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-sm text-red-600 hover:text-red-700 flex items-center space-x-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Notification Preferences</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700">Email Notifications</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-[#00923F] border-gray-300 rounded" />
                <span className="text-sm text-gray-600">Application status updates</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-[#00923F] border-gray-300 rounded" />
                <span className="text-sm text-gray-600">Document verification requests</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="w-4 h-4 text-[#00923F] border-gray-300 rounded" />
                <span className="text-sm text-gray-600">System maintenance notices</span>
              </label>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700">Push Notifications</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-[#00923F] border-gray-300 rounded" />
                <span className="text-sm text-gray-600">ID card ready for collection</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="w-4 h-4 text-[#00923F] border-gray-300 rounded" />
                <span className="text-sm text-gray-600">Security alerts</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="w-4 h-4 text-[#00923F] border-gray-300 rounded" />
                <span className="text-sm text-gray-600">Promotional messages</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button className="px-6 py-3 bg-[#00923F] text-white rounded-lg hover:bg-[#007A33] transition-colors">
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsCenter;