import { DayPlan } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { format, isToday, isTomorrow } from 'date-fns';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UpcomingDeliveriesProps {
  plans: DayPlan[];
}

function formatDateLabel(date: Date): string {
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  return format(date, 'EEE, MMM d');
}

export function UpcomingDeliveries({ plans }: UpcomingDeliveriesProps) {
  // Show next 3 days after today
  const upcoming = plans.slice(1, 4);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Upcoming</h2>
        <Link
          to="/subscription"
          className="flex items-center gap-1 text-sm font-medium text-primary"
        >
          View All
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="space-y-2">
        {upcoming.map((plan, idx) => (
          <Link
            key={idx}
            to="/subscription"
            className="flex items-center gap-3 p-3 rounded-xl bg-card transition-smooth hover:shadow-soft active:scale-[0.99]"
          >
            {/* Date */}
            <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-secondary">
              <span className="text-xs font-medium text-muted-foreground uppercase">
                {format(plan.date, 'EEE')}
              </span>
              <span className="text-lg font-bold text-foreground">
                {format(plan.date, 'd')}
              </span>
            </div>

            {/* Meal Info */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">
                {plan.meal?.name || 'No meal'}
              </p>
              <p className="text-sm text-muted-foreground">
                {plan.deliveryTime || 'Not scheduled'}
              </p>
            </div>

            {/* Status */}
            <StatusBadge status={plan.status} size="sm" showIcon={false} />
          </Link>
        ))}
      </div>
    </div>
  );
}
