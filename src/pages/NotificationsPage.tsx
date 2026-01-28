import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Truck, CheckCircle2, AlertCircle, Bell, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'delivery-started' | 'nearby' | 'delivered' | 'alert' | 'promo';
  title: string;
  message: string;
  time: Date;
  isRead: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'delivery-started',
    title: 'Delivery Started',
    message: 'Ravi has picked up your meal and is on the way!',
    time: new Date(Date.now() - 1000 * 60 * 15),
    isRead: false,
  },
  {
    id: '2',
    type: 'nearby',
    title: 'Almost There!',
    message: 'Your delivery agent is just 2 minutes away.',
    time: new Date(Date.now() - 1000 * 60 * 30),
    isRead: false,
  },
  {
    id: '3',
    type: 'delivered',
    title: 'Order Delivered',
    message: 'Your Grilled Chicken Salad Bowl has been delivered. Enjoy your meal!',
    time: new Date(Date.now() - 1000 * 60 * 60 * 24),
    isRead: true,
  },
  {
    id: '4',
    type: 'alert',
    title: 'Low Wallet Balance',
    message: 'Add money to avoid delivery interruption tomorrow.',
    time: new Date(Date.now() - 1000 * 60 * 60 * 48),
    isRead: true,
  },
  {
    id: '5',
    type: 'promo',
    title: 'New Meals Added!',
    message: 'Check out our new Mediterranean menu. Fresh flavors await!',
    time: new Date(Date.now() - 1000 * 60 * 60 * 72),
    isRead: true,
  },
];

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'delivery-started':
      return Truck;
    case 'nearby':
      return MapPin;
    case 'delivered':
      return CheckCircle2;
    case 'alert':
      return AlertCircle;
    case 'promo':
      return Bell;
  }
};

const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'delivery-started':
      return 'bg-warning/10 text-warning';
    case 'nearby':
      return 'bg-info/10 text-info';
    case 'delivered':
      return 'bg-success/10 text-success';
    case 'alert':
      return 'bg-destructive/10 text-destructive';
    case 'promo':
      return 'bg-accent/10 text-accent';
  }
};

export default function NotificationsPage() {
  const navigate = useNavigate();

  const unreadCount = mockNotifications.filter((n) => !n.isRead).length;

  return (
    <AppLayout>
      <div className="space-y-6 p-4 max-w-lg mx-auto">
        {/* Header */}
        <header className="flex items-center gap-3 pt-2 safe-top">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-muted-foreground">{unreadCount} unread</p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm">
              Mark all read
            </Button>
          )}
        </header>

        {/* Notifications List */}
        <div className="space-y-2">
          {mockNotifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type);
            const colorClass = getNotificationColor(notification.type);

            return (
              <div
                key={notification.id}
                className={cn(
                  'flex gap-3 p-4 rounded-xl transition-smooth',
                  notification.isRead ? 'bg-card' : 'bg-primary/5'
                )}
              >
                <div className={cn('rounded-full p-2 h-fit', colorClass)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={cn(
                        'font-medium',
                        notification.isRead ? 'text-foreground' : 'text-foreground'
                      )}
                    >
                      {notification.title}
                    </p>
                    {!notification.isRead && (
                      <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {format(notification.time, 'MMM d, h:mm a')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {mockNotifications.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Bell className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No notifications yet</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
