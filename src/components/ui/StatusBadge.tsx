import { cn } from '@/lib/utils';
import { DeliveryStatus } from '@/types';
import { Clock, Truck, CheckCircle2, PauseCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: DeliveryStatus;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

const statusConfig: Record<DeliveryStatus, { label: string; icon: typeof Clock; className: string }> = {
  scheduled: {
    label: 'Scheduled',
    icon: Clock,
    className: 'bg-info/10 text-info',
  },
  'out-for-delivery': {
    label: 'Out for Delivery',
    icon: Truck,
    className: 'bg-warning/10 text-warning',
  },
  delivered: {
    label: 'Delivered',
    icon: CheckCircle2,
    className: 'bg-success/10 text-success',
  },
  paused: {
    label: 'Paused',
    icon: PauseCircle,
    className: 'bg-muted text-muted-foreground',
  },
};

export function StatusBadge({ status, size = 'md', showIcon = true }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        config.className,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      )}
    >
      {showIcon && <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />}
      {config.label}
    </span>
  );
}
