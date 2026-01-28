import { PauseCircle, Calendar, MapPin, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const actions = [
  {
    icon: PauseCircle,
    label: 'Pause',
    path: '/pause',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  {
    icon: Calendar,
    label: 'Schedule',
    path: '/subscription',
    color: 'text-info',
    bgColor: 'bg-info/10',
  },
  {
    icon: MapPin,
    label: 'Address',
    path: '/address',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Headphones,
    label: 'Support',
    path: '/support',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link
            key={action.path}
            to={action.path}
            className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-card transition-smooth hover:shadow-soft active:scale-95"
          >
            <div className={cn('rounded-xl p-3', action.bgColor)}>
              <Icon className={cn('h-5 w-5', action.color)} />
            </div>
            <span className="text-xs font-medium text-foreground">{action.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
