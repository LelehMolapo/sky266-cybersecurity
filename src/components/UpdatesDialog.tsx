import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { AlertTriangle, Info, CheckCircle2, Shield } from 'lucide-react';

interface UpdatesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UpdatesDialog({ open, onOpenChange }: UpdatesDialogProps) {
  const securityUpdates = [
    {
      id: 1,
      type: 'critical',
      title: 'Package Fraud Alert',
      description: 'Scammers are impersonating Sky266 drivers to gain access to buildings. Always verify driver identity through the official app before granting access or releasing packages.',
      date: 'Nov 4, 2025',
      time: '10:30 AM',
    },
    {
      id: 2,
      type: 'warning',
      title: 'Phishing Campaign Targeting Drivers',
      description: 'Multiple drivers reported phishing emails claiming to be delivery route updates. These emails contain malicious links. Delete these emails and report to security@sky266.com',
      date: 'Nov 3, 2025',
      time: '2:15 PM',
    },
    {
      id: 3,
      type: 'info',
      title: 'Monthly Security Training Reminder',
      description: 'Complete your monthly security awareness training by November 15th. This month focuses on mobile device security.',
      date: 'Nov 1, 2025',
      time: '9:00 AM',
    },
    {
      id: 4,
      type: 'success',
      title: 'Security Patch Successfully Deployed',
      description: 'Critical security patches have been successfully deployed to all Sky266 systems. No action required from employees.',
      date: 'Oct 30, 2025',
      time: '11:45 AM',
    },
    {
      id: 5,
      type: 'warning',
      title: 'Mobile Device Security Update Required',
      description: 'All driver and booking agent devices must install the latest security update by November 15th. This update includes critical protections for customer data.',
      date: 'Oct 28, 2025',
      time: '3:30 PM',
    },
    {
      id: 6,
      type: 'info',
      title: 'New Password Policy Update',
      description: 'Password requirements have been updated. Passwords must now be at least 12 characters long and include special characters.',
      date: 'Oct 25, 2025',
      time: '1:00 PM',
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getAlertClass = (type: string) => {
    switch (type) {
      case 'critical':
        return 'border-red-600/50 bg-red-950/30';
      case 'warning':
        return 'border-yellow-600/50 bg-yellow-950/30';
      case 'success':
        return 'border-green-600/50 bg-green-950/30';
      default:
        return 'border-blue-600/50 bg-blue-950/30';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      case 'success':
        return 'text-green-500';
      default:
        return 'text-blue-500';
    }
  };

  const getBadgeClass = (type: string) => {
    switch (type) {
      case 'critical':
        return 'bg-red-600 text-white';
      case 'warning':
        return 'bg-yellow-600 text-white';
      case 'success':
        return 'bg-green-600 text-white';
      default:
        return 'bg-blue-600 text-white';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white text-xl">
            <div className="bg-blue-600/20 p-2 rounded-lg">
              <Shield className="w-5 h-5 text-blue-500" />
            </div>
            Security Updates & Alerts
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Stay informed about the latest security updates and threats
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {securityUpdates.map((update) => (
              <Alert key={update.id} className={`${getAlertClass(update.type)} transition-all hover:scale-[1.02] cursor-pointer`}>
                <div className={getIconColor(update.type)}>
                  {getIcon(update.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <AlertTitle className="text-white">{update.title}</AlertTitle>
                    <Badge className={`${getBadgeClass(update.type)} shrink-0`}>
                      {update.type.charAt(0).toUpperCase() + update.type.slice(1)}
                    </Badge>
                  </div>
                  <AlertDescription className="text-gray-300 mb-2">
                    {update.description}
                  </AlertDescription>
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <span>{update.date}</span>
                    <span>•</span>
                    <span>{update.time}</span>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
