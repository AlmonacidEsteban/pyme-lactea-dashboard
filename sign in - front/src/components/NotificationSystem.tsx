import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { 
  Bell, 
  BellRing,
  X, 
  Check, 
  AlertTriangle, 
  Info, 
  CheckCircle,
  Calendar,
  DollarSign,
  Users,
  MessageSquare,
  Settings
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'whatsapp';
  timestamp: Date;
  read: boolean;
  actionRequired?: boolean;
  category: 'project' | 'finance' | 'team' | 'client' | 'whatsapp' | 'system';
}

interface NotificationSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationSystem({ isOpen, onClose }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Project Deadline Approaching',
      message: 'Website Redesign project is due in 2 days',
      type: 'warning',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      read: false,
      actionRequired: true,
      category: 'project'
    },
    {
      id: '2',
      title: 'WhatsApp Message Received',
      message: 'New message from TechCorp Solutions about project requirements',
      type: 'whatsapp',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
      category: 'whatsapp'
    },
    {
      id: '3',
      title: 'Payment Received',
      message: 'Invoice #INV-001 paid by Design Studio Pro - $8,500',
      type: 'success',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      read: false,
      category: 'finance'
    },
    {
      id: '4',
      title: 'Team Meeting Reminder',
      message: 'Weekly standup meeting starts in 15 minutes',
      type: 'info',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
      category: 'team'
    },
    {
      id: '5',
      title: 'Client Feedback Received',
      message: 'RetailCorp Inc has provided feedback on the brand identity draft',
      type: 'info',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      read: true,
      category: 'client'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string, category: string) => {
    if (type === 'whatsapp') return MessageSquare;
    
    switch (category) {
      case 'project':
        return Calendar;
      case 'finance':
        return DollarSign;
      case 'team':
        return Users;
      case 'client':
        return Users;
      default:
        switch (type) {
          case 'warning':
            return AlertTriangle;
          case 'success':
            return CheckCircle;
          case 'error':
            return AlertTriangle;
          default:
            return Info;
        }
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'whatsapp':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Simulate new notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        title: 'New Activity',
        message: 'You have new activity in your workspace',
        type: 'info',
        timestamp: new Date(),
        read: false,
        category: 'system'
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      toast.info('New notification received');
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end pt-16 pr-4">
      <div className="bg-background/80 backdrop-blur-sm absolute inset-0" onClick={onClose} />
      <Card className="w-96 max-h-[600px] relative z-10 shadow-lg border-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <BellRing className="w-5 h-5" />
            <CardTitle>Notifications</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="default" className="bg-[#F005CD] hover:bg-[#F005CD]/90">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                Mark all read
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            <div className="p-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const Icon = getNotificationIcon(notification.type, notification.category);
                  return (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        notification.read
                          ? 'bg-muted/50 border-border'
                          : getNotificationColor(notification.type)
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium">{notification.title}</h4>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-[#F005CD] rounded-full flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs opacity-80">{notification.message}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs opacity-60">
                                {formatTimestamp(notification.timestamp)}
                              </span>
                              {notification.actionRequired && (
                                <Badge variant="outline" className="text-xs">
                                  Action Required
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="h-6 w-6 p-0"
                            >
                              <Check className="w-3 h-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t">
            <Button variant="outline" className="w-full" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Notification Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}