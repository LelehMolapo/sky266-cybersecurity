import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { User, Mail, Building, Shield, Bell, Lock, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileSettingsProps {
  user: {
    email: string;
    name: string;
    role: 'driver' | 'manager' | 'booking-agent';
  };
  onBack: () => void;
  onUpdateProfile: (name: string, email: string) => void;
}

export default function ProfileSettings({ user, onBack, onUpdateProfile }: ProfileSettingsProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [department, setDepartment] = useState(
    user.role === 'driver' ? 'Fleet Operations' :
    user.role === 'booking-agent' ? 'Customer Service' :
    'Operations Management'
  );
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [trainingReminders, setTrainingReminders] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSaveProfile = () => {
    onUpdateProfile(name, email);
    toast.success('Profile Updated', {
      description: 'Your profile information has been saved successfully',
    });
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Error', {
        description: 'Please fill in all password fields',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Error', {
        description: 'New passwords do not match',
      });
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Error', {
        description: 'Password must be at least 8 characters long',
      });
      return;
    }

    toast.success('Password Changed', {
      description: 'Your password has been updated successfully',
    });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSaveNotifications = () => {
    toast.success('Preferences Saved', {
      description: 'Your notification preferences have been updated',
    });
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="text-gray-400 hover:text-white hover:bg-gray-800"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 border border-blue-500/20 shadow-xl shadow-blue-900/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h2 className="text-white mb-2">Profile Settings</h2>
          <p className="text-blue-100">
            Manage your account information and preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview Sidebar */}
        <Card className="bg-gray-900 border-gray-800 lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="w-24 h-24 border-4 border-blue-600">
                <AvatarFallback className={`${
                  user.role === 'manager' ? 'bg-purple-600' : 
                  user.role === 'driver' ? 'bg-blue-600' : 
                  'bg-green-600'
                } text-white text-2xl`}>
                  {getInitials(name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-white mb-1">{name}</h3>
                <p className="text-gray-400 text-sm mb-2">{email}</p>
                <Badge className={
                  user.role === 'manager' ? 'bg-purple-600' : 
                  user.role === 'driver' ? 'bg-blue-600' : 
                  'bg-green-600'
                }>
                  {user.role === 'manager' ? 'Manager' : 
                   user.role === 'driver' ? 'Driver' : 
                   'Booking Agent'}
                </Badge>
              </div>
              <Separator className="bg-gray-800" />
              <div className="w-full space-y-3 text-left">
                <div className="flex items-center gap-3 text-gray-300">
                  <Building className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">{department}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-sm">Account Active</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-5 h-5 text-blue-400" />
                Personal Information
              </CardTitle>
              <CardDescription className="text-gray-400">
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department" className="text-gray-300">Department</Label>
                <Input
                  id="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleSaveProfile}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-400" />
                Security & Password
              </CardTitle>
              <CardDescription className="text-gray-400">
                Change your password and manage security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-gray-300">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Enter current password"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-gray-300">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Enter new password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-gray-300">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              <div className="bg-blue-950/30 border border-blue-600/30 rounded-lg p-4">
                <p className="text-blue-200 text-sm">
                  <Shield className="w-4 h-4 inline mr-2" />
                  Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.
                </p>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleChangePassword}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-400" />
                Notification Preferences
              </CardTitle>
              <CardDescription className="text-gray-400">
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="email-notifications" className="text-gray-300">Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive training updates via email</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <Separator className="bg-gray-800" />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="security-alerts" className="text-gray-300">Security Alerts</Label>
                  <p className="text-sm text-gray-500">Critical security notifications</p>
                </div>
                <Switch
                  id="security-alerts"
                  checked={securityAlerts}
                  onCheckedChange={setSecurityAlerts}
                />
              </div>
              <Separator className="bg-gray-800" />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="training-reminders" className="text-gray-300">Training Reminders</Label>
                  <p className="text-sm text-gray-500">Reminders for pending courses</p>
                </div>
                <Switch
                  id="training-reminders"
                  checked={trainingReminders}
                  onCheckedChange={setTrainingReminders}
                />
              </div>
              <Separator className="bg-gray-800" />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="weekly-digest" className="text-gray-300">Weekly Progress Digest</Label>
                  <p className="text-sm text-gray-500">Weekly summary of your progress</p>
                </div>
                <Switch
                  id="weekly-digest"
                  checked={weeklyDigest}
                  onCheckedChange={setWeeklyDigest}
                />
              </div>
              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleSaveNotifications}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
