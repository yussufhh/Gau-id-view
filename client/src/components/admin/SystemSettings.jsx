import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  Shield, 
  Bell, 
  Database,
  Mail,
  Printer,
  Users,
  Lock,
  Eye,
  EyeOff,
  Upload,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    general: {
      institutionName: 'Garissa University',
      institutionCode: 'GAU',
      academicYear: '2024/2025',
      cardValidityPeriod: 365,
      defaultCardType: 'student',
      logoUrl: '/gau-logo.png'
    },
    security: {
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialChars: true
      },
      sessionTimeout: 30,
      twoFactorEnabled: true,
      loginAttempts: 3,
      autoLockout: 15
    },
    notifications: {
      emailEnabled: true,
      smsEnabled: false,
      applicationAlerts: true,
      expiryReminders: true,
      systemAlerts: true,
      reminderDaysBefore: 30
    },
    email: {
      smtpServer: 'mail.gau.ac.ke',
      smtpPort: 587,
      username: 'id-system@gau.ac.ke',
      password: '',
      encryption: 'tls',
      fromName: 'GAU ID Management System'
    },
    printing: {
      defaultPrinter: 'GAU-CardPrinter-01',
      printQuality: 'high',
      autoProcess: false,
      batchSize: 50,
      colorProfile: 'standard'
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'daily',
      retentionDays: 30,
      lastBackup: '2024-11-03T02:00:00Z'
    }
  });

  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    setUnsavedChanges(true);
  };

  const updateNestedSetting = (category, parentKey, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [parentKey]: {
          ...prev[category][parentKey],
          [key]: value
        }
      }
    }));
    setUnsavedChanges(true);
  };

  const saveSettings = () => {
    // Simulate API call
    setTimeout(() => {
      setUnsavedChanges(false);
      alert('Settings saved successfully!');
    }, 1000);
  };

  const resetToDefaults = () => {
    if (confirm('Are you sure you want to reset all settings to defaults? This action cannot be undone.')) {
      // Reset logic here
      alert('Settings reset to defaults.');
    }
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `gau-id-system-settings-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const backupNow = () => {
    alert('Backup initiated. You will be notified when complete.');
  };

  const testEmailConfig = () => {
    alert('Test email sent to system administrator.');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'printing', label: 'Printing', icon: Printer },
    { id: 'backup', label: 'Backup', icon: Database }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">System Settings</h1>
            <p className="text-gray-600">Configure system preferences and security settings</p>
          </div>
          <div className="flex items-center space-x-2">
            {unsavedChanges && (
              <div className="flex items-center space-x-2 text-yellow-600 bg-yellow-50 px-3 py-2 rounded-lg">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">Unsaved changes</span>
              </div>
            )}
            <button
              onClick={exportSettings}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button
              onClick={saveSettings}
              disabled={!unsavedChanges}
              className="flex items-center space-x-2 px-4 py-2 bg-[#00923F] text-white rounded-lg hover:bg-[#007A33] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-[#00923F] text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">General Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Institution Name
                    </label>
                    <input
                      type="text"
                      value={settings.general.institutionName}
                      onChange={(e) => updateSetting('general', 'institutionName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Institution Code
                    </label>
                    <input
                      type="text"
                      value={settings.general.institutionCode}
                      onChange={(e) => updateSetting('general', 'institutionCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Academic Year
                    </label>
                    <input
                      type="text"
                      value={settings.general.academicYear}
                      onChange={(e) => updateSetting('general', 'academicYear', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Validity Period (days)
                    </label>
                    <input
                      type="number"
                      value={settings.general.cardValidityPeriod}
                      onChange={(e) => updateSetting('general', 'cardValidityPeriod', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Institution Logo
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <img src="/gau-logo.png" alt="Logo" className="w-12 h-12 object-contain" />
                    </div>
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>Change Logo</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">Security Settings</h2>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <p className="text-sm text-red-800 font-medium">
                      Changes to security settings will affect all users immediately.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800">Password Policy</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Password Length
                      </label>
                      <input
                        type="number"
                        min="6"
                        max="50"
                        value={settings.security.passwordPolicy.minLength}
                        onChange={(e) => updateNestedSetting('security', 'passwordPolicy', 'minLength', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Session Timeout (minutes)
                      </label>
                      <input
                        type="number"
                        min="5"
                        max="120"
                        value={settings.security.sessionTimeout}
                        onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.security.passwordPolicy.requireUppercase}
                        onChange={(e) => updateNestedSetting('security', 'passwordPolicy', 'requireUppercase', e.target.checked)}
                        className="rounded border-gray-300 text-[#00923F] focus:ring-[#00923F]"
                      />
                      <span className="ml-2 text-sm text-gray-700">Require uppercase letters</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.security.passwordPolicy.requireNumbers}
                        onChange={(e) => updateNestedSetting('security', 'passwordPolicy', 'requireNumbers', e.target.checked)}
                        className="rounded border-gray-300 text-[#00923F] focus:ring-[#00923F]"
                      />
                      <span className="ml-2 text-sm text-gray-700">Require numbers</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.security.passwordPolicy.requireSpecialChars}
                        onChange={(e) => updateNestedSetting('security', 'passwordPolicy', 'requireSpecialChars', e.target.checked)}
                        className="rounded border-gray-300 text-[#00923F] focus:ring-[#00923F]"
                      />
                      <span className="ml-2 text-sm text-gray-700">Require special characters</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.security.twoFactorEnabled}
                        onChange={(e) => updateSetting('security', 'twoFactorEnabled', e.target.checked)}
                        className="rounded border-gray-300 text-[#00923F] focus:ring-[#00923F]"
                      />
                      <span className="ml-2 text-sm text-gray-700">Enable two-factor authentication</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">Notification Settings</h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-3">Notification Channels</h3>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.notifications.emailEnabled}
                            onChange={(e) => updateSetting('notifications', 'emailEnabled', e.target.checked)}
                            className="rounded border-gray-300 text-[#00923F] focus:ring-[#00923F]"
                          />
                          <span className="ml-2 text-sm text-gray-700">Email notifications</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.notifications.smsEnabled}
                            onChange={(e) => updateSetting('notifications', 'smsEnabled', e.target.checked)}
                            className="rounded border-gray-300 text-[#00923F] focus:ring-[#00923F]"
                          />
                          <span className="ml-2 text-sm text-gray-700">SMS notifications</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-3">Alert Types</h3>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.notifications.applicationAlerts}
                            onChange={(e) => updateSetting('notifications', 'applicationAlerts', e.target.checked)}
                            className="rounded border-gray-300 text-[#00923F] focus:ring-[#00923F]"
                          />
                          <span className="ml-2 text-sm text-gray-700">New application alerts</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.notifications.expiryReminders}
                            onChange={(e) => updateSetting('notifications', 'expiryReminders', e.target.checked)}
                            className="rounded border-gray-300 text-[#00923F] focus:ring-[#00923F]"
                          />
                          <span className="ml-2 text-sm text-gray-700">Card expiry reminders</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.notifications.systemAlerts}
                            onChange={(e) => updateSetting('notifications', 'systemAlerts', e.target.checked)}
                            className="rounded border-gray-300 text-[#00923F] focus:ring-[#00923F]"
                          />
                          <span className="ml-2 text-sm text-gray-700">System alerts</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reminder Days Before Expiry
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="365"
                      value={settings.notifications.reminderDaysBefore}
                      onChange={(e) => updateSetting('notifications', 'reminderDaysBefore', parseInt(e.target.value))}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Email Settings */}
            {activeTab === 'email' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">Email Configuration</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SMTP Server
                    </label>
                    <input
                      type="text"
                      value={settings.email.smtpServer}
                      onChange={(e) => updateSetting('email', 'smtpServer', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SMTP Port
                    </label>
                    <input
                      type="number"
                      value={settings.email.smtpPort}
                      onChange={(e) => updateSetting('email', 'smtpPort', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="email"
                      value={settings.email.username}
                      onChange={(e) => updateSetting('email', 'username', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={settings.email.password}
                        onChange={(e) => updateSetting('email', 'password', e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={testEmailConfig}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Test Configuration</span>
                  </button>
                </div>
              </div>
            )}

            {/* Printing Settings */}
            {activeTab === 'printing' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">Printing Configuration</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Printer
                    </label>
                    <select
                      value={settings.printing.defaultPrinter}
                      onChange={(e) => updateSetting('printing', 'defaultPrinter', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                    >
                      <option value="GAU-CardPrinter-01">GAU-CardPrinter-01</option>
                      <option value="GAU-CardPrinter-02">GAU-CardPrinter-02</option>
                      <option value="GAU-CardPrinter-03">GAU-CardPrinter-03</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Print Quality
                    </label>
                    <select
                      value={settings.printing.printQuality}
                      onChange={(e) => updateSetting('printing', 'printQuality', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                    >
                      <option value="draft">Draft</option>
                      <option value="standard">Standard</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Batch Size
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={settings.printing.batchSize}
                      onChange={(e) => updateSetting('printing', 'batchSize', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="flex items-center mt-6">
                      <input
                        type="checkbox"
                        checked={settings.printing.autoProcess}
                        onChange={(e) => updateSetting('printing', 'autoProcess', e.target.checked)}
                        className="rounded border-gray-300 text-[#00923F] focus:ring-[#00923F]"
                      />
                      <span className="ml-2 text-sm text-gray-700">Auto-process print queue</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Backup Settings */}
            {activeTab === 'backup' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">Backup Configuration</h2>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Info className="w-5 h-5 text-blue-600" />
                    <p className="text-sm text-blue-800">
                      Last backup: {new Date(settings.backup.lastBackup).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.backup.autoBackup}
                          onChange={(e) => updateSetting('backup', 'autoBackup', e.target.checked)}
                          className="rounded border-gray-300 text-[#00923F] focus:ring-[#00923F]"
                        />
                        <span className="ml-2 text-sm text-gray-700">Enable automatic backups</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Backup Frequency
                      </label>
                      <select
                        value={settings.backup.backupFrequency}
                        onChange={(e) => updateSetting('backup', 'backupFrequency', e.target.value)}
                        disabled={!settings.backup.autoBackup}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent disabled:opacity-50"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Retention Period (days)
                      </label>
                      <input
                        type="number"
                        min="7"
                        max="365"
                        value={settings.backup.retentionDays}
                        onChange={(e) => updateSetting('backup', 'retentionDays', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <button
                      onClick={backupNow}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Database className="w-4 h-4" />
                      <span>Backup Now</span>
                    </button>
                    
                    <button
                      onClick={resetToDefaults}
                      className="flex items-center space-x-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Reset to Defaults</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;