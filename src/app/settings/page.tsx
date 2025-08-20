"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  User, 
  Bell, 
  Palette, 
  Shield, 
  Key, 
  Mail,
  Smartphone,
  Globe,
  Moon,
  Sun,
  Monitor,
  Save,
  Eye,
  EyeOff,
  Check,
  X
} from "lucide-react";

export default function SettingsPage() {
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark" | "low-stimulus">("dark");
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    weeklyDigest: true,
    achievementAlerts: true,
    communityUpdates: false
  });
  const [accountInfo, setAccountInfo] = useState({
    firstName: "Alex",
    lastName: "Johnson",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    timezone: "America/Los_Angeles",
    language: "English"
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const themes = [
    { id: "light", name: "Light", icon: Sun, description: "Bright and clean interface" },
    { id: "dark", name: "Dark", icon: Moon, description: "Easy on the eyes in low light" },
    { id: "low-stimulus", name: "Low Stimulus", icon: Monitor, description: "Minimal colors and animations" }
  ];

  const timezones = [
    "America/Los_Angeles",
    "America/New_York",
    "Europe/London",
    "Europe/Paris",
    "Asia/Tokyo",
    "Australia/Sydney"
  ];

  const languages = ["English", "Spanish", "French", "German", "Japanese", "Chinese"];

  const handleNotificationToggle = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const handleAccountUpdate = (field: string, value: string) => {
    setAccountInfo(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordUpdate = (field: string, value: string) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
  };

  const saveAccountInfo = () => {
    // Here you would typically save to a database
    console.log("Account info saved:", accountInfo);
  };

  const savePassword = () => {
    if (passwords.new === passwords.confirm && passwords.new.length >= 8) {
      // Here you would typically update the password
      console.log("Password updated");
      setPasswords({ current: "", new: "", confirm: "" });
    }
  };

  const isPasswordValid = passwords.new === passwords.confirm && passwords.new.length >= 8;

  return (
    <div className="container mx-auto px-6 py-8 pt-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Settings</h1>
        <p className="text-gray-300 text-lg">Customize your experience</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Account Information */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <User className="w-5 h-5 text-blue-400" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                <input
                  type="text"
                  value={accountInfo.firstName}
                  onChange={(e) => handleAccountUpdate('firstName', e.target.value)}
                  className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                <input
                  type="text"
                  value={accountInfo.lastName}
                  onChange={(e) => handleAccountUpdate('lastName', e.target.value)}
                  className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={accountInfo.email}
                onChange={(e) => handleAccountUpdate('email', e.target.value)}
                className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
              <input
                type="tel"
                value={accountInfo.phone}
                onChange={(e) => handleAccountUpdate('phone', e.target.value)}
                className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Timezone</label>
                <select
                  value={accountInfo.timezone}
                  onChange={(e) => handleAccountUpdate('timezone', e.target.value)}
                  className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {timezones.map((tz) => (
                    <option key={tz} value={tz}>{tz.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
                <select
                  value={accountInfo.language}
                  onChange={(e) => handleAccountUpdate('language', e.target.value)}
                  className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
            </div>

            <Button onClick={saveAccountInfo} className="w-full bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Bell className="w-5 h-5 text-green-400" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <div className="font-medium text-white capitalize">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </div>
                    <div className="text-sm text-gray-400">
                      {key === "email" && "Receive notifications via email"}
                      {key === "push" && "Get push notifications in your browser"}
                      {key === "sms" && "Receive SMS notifications"}
                      {key === "weeklyDigest" && "Weekly summary of your progress"}
                      {key === "achievementAlerts" && "Get notified when you earn badges"}
                      {key === "communityUpdates" && "Updates from the community"}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleNotificationToggle(key)}
                    className={`p-2 ${
                      value 
                        ? "text-green-400 hover:text-green-300" 
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {value ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Palette className="w-5 h-5 text-purple-400" />
              Theme & Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {themes.map((theme) => {
                const ThemeIcon = theme.icon;
                return (
                  <div
                    key={theme.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      currentTheme === theme.id
                        ? "bg-purple-500/20 border-purple-500/30"
                        : "bg-white/5 border-white/20 hover:bg-white/10"
                    }`}
                    onClick={() => setCurrentTheme(theme.id as any)}
                  >
                    <div className="flex items-center gap-3">
                      <ThemeIcon className="w-5 h-5 text-purple-400" />
                      <div className="flex-1">
                        <div className="font-medium text-white">{theme.name}</div>
                        <div className="text-sm text-gray-300">{theme.description}</div>
                      </div>
                      {currentTheme === theme.id && (
                        <Check className="w-5 h-5 text-purple-400" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="pt-4 border-t border-white/20">
              <p className="text-sm text-gray-300">
                Theme changes will be applied immediately. Choose the one that works best for your environment and preferences.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security & Password */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="w-5 h-5 text-red-400" />
              Security & Password
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwords.current}
                  onChange={(e) => handlePasswordUpdate('current', e.target.value)}
                  className="w-full p-2 pr-10 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter current password"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-auto text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
              <input
                type="password"
                value={passwords.new}
                onChange={(e) => handlePasswordUpdate('new', e.target.value)}
                className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
              <input
                type="password"
                value={passwords.confirm}
                onChange={(e) => handlePasswordUpdate('confirm', e.target.value)}
                className={`w-full p-2 bg-white/10 border rounded-lg text-white focus:outline-none focus:ring-2 ${
                  passwords.confirm && passwords.new !== passwords.confirm
                    ? "border-red-500 focus:ring-red-500"
                    : "border-white/20 focus:ring-blue-500"
                }`}
                placeholder="Confirm new password"
              />
              {passwords.confirm && passwords.new !== passwords.confirm && (
                <p className="text-red-400 text-xs mt-1">Passwords don't match</p>
              )}
            </div>

            <div className="pt-2">
              <p className="text-xs text-gray-400 mb-3">
                Password must be at least 8 characters long
              </p>
              <Button 
                onClick={savePassword} 
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={!isPasswordValid || !passwords.current}
              >
                <Key className="w-4 h-4 mr-2" />
                Update Password
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
