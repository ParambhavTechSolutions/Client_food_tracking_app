import { AppLayout } from '@/components/layout/AppLayout';
import { mockUser, mockAddresses, mockDeliverySlots } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import {
  User,
  MapPin,
  Clock,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Phone,
  Shield,
  FileText,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    icon: MapPin,
    label: 'Saved Addresses',
    description: `${mockAddresses.length} addresses`,
    path: '/address',
  },
  {
    icon: Clock,
    label: 'Delivery Slot',
    description: mockDeliverySlots.find((s) => s.isAvailable)?.timeRange || 'Not set',
    path: '/slots',
  },
  {
    icon: Bell,
    label: 'Notifications',
    description: 'Manage alerts',
    path: '/notifications',
  },
  {
    icon: HelpCircle,
    label: 'Help & Support',
    description: 'FAQ, contact us',
    path: '/support',
  },
  {
    icon: Shield,
    label: 'Privacy & Security',
    description: 'Data preferences',
    path: '/privacy',
  },
  {
    icon: FileText,
    label: 'Terms & Policies',
    description: 'Legal information',
    path: '/terms',
  },
];

export default function AccountPage() {
  return (
    <AppLayout>
      <div className="space-y-6 p-4 max-w-lg mx-auto">
        {/* Header */}
        <header className="pt-2 safe-top">
          <h1 className="text-2xl font-bold text-foreground">Account</h1>
        </header>

        {/* Profile Card */}
        <div className="card-elevated p-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {mockUser.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground">{mockUser.name}</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{mockUser.phone}</span>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </div>
        </div>

        {/* Default Address */}
        <div className="card-subtle p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Default Delivery Address</p>
              <p className="font-medium text-foreground">
                {mockAddresses.find((a) => a.isDefault)?.label}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {mockAddresses.find((a) => a.isDefault)?.fullAddress}
              </p>
            </div>
            <Link to="/address">
              <Button variant="ghost" size="sm">
                Change
              </Button>
            </Link>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-secondary transition-smooth"
              >
                <div className="rounded-lg bg-secondary p-2">
                  <Icon className="h-5 w-5 text-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            );
          })}
        </div>

        {/* Logout */}
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-5 w-5" />
          Log Out
        </Button>
      </div>
    </AppLayout>
  );
}
