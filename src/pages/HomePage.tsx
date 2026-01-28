import { AppLayout } from '@/components/layout/AppLayout';
import { WalletCard } from '@/components/home/WalletCard';
import { TodaysMealCard } from '@/components/home/TodaysMealCard';
import { QuickActions } from '@/components/home/QuickActions';
import { UpcomingDeliveries } from '@/components/home/UpcomingDeliveries';
import { mockUser, mockWeekPlan, mockSubscription } from '@/data/mockData';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const navigate = useNavigate();
  const todaysPlan = mockWeekPlan[0];
  const isLowBalance = mockUser.walletBalance < 300;

  return (
    <AppLayout>
      <div className="space-y-6 p-4 max-w-lg mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between pt-2 safe-top">
          <div>
            <p className="text-sm text-muted-foreground">Good morning,</p>
            <h1 className="text-2xl font-bold text-foreground">{mockUser.name} 👋</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => navigate('/notifications')}
          >
            <Bell className="h-6 w-6" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-accent" />
          </Button>
        </header>

        {/* Wallet Card */}
        <WalletCard balance={mockUser.walletBalance} isLow={isLowBalance} />

        {/* Today's Delivery */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Today's Delivery</h2>
          <TodaysMealCard
            meal={todaysPlan.meal}
            status={todaysPlan.status}
            deliveryTime={todaysPlan.deliveryTime}
            onChangeMeal={() => navigate('/customize')}
            onTrackDelivery={() => navigate('/tracking')}
          />
        </section>

        {/* Quick Actions */}
        <section>
          <QuickActions />
        </section>

        {/* Upcoming Deliveries */}
        <section>
          <UpcomingDeliveries plans={mockWeekPlan} />
        </section>

        {/* Subscription Status */}
        <section className="card-subtle p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Subscription</span>
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
              Active
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-foreground">{mockSubscription.planName}</span>
            <span className="text-sm text-muted-foreground">
              {mockSubscription.remainingDays} days left
            </span>
          </div>
          {/* Progress bar */}
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{
                width: `${((mockSubscription.totalDays - mockSubscription.remainingDays) / mockSubscription.totalDays) * 100}%`,
              }}
            />
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
