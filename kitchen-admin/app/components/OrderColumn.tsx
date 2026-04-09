import { Order, OrderStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { 
  Hourglass, 
  ChefHat, 
  CheckCircle2, 
  Archive 
} from 'lucide-react';
import { OrderCard } from './OrderCard';

interface OrderColumnProps {
  title: string;
  status: OrderStatus;
  orders: Order[];
  onStatusChange: (orderId: string, nextStatus: OrderStatus) => void;
  canTransitionTo: (order: Order, targetStatus: OrderStatus) => boolean;
}

const columnConfig = {
  PENDING: { 
    icon: Hourglass, 
    headerClass: 'column-pending',
    accentClass: 'text-status-pending'
  },
  PREPARING: { 
    icon: ChefHat, 
    headerClass: 'column-preparation',
    accentClass: 'text-status-preparation'
  },
  READY: { 
    icon: CheckCircle2, 
    headerClass: 'column-ready',
    accentClass: 'text-status-ready'
  },
  COMPLETED: { 
    icon: Archive, 
    headerClass: 'column-completed',
    accentClass: 'text-status-completed'
  },
  PAID: { // Mapping PAID to PENDING visual style
    icon: Hourglass,
    headerClass: 'column-pending',
    accentClass: 'text-status-pending'
  },
  CANCELLED: { // Mapping CANCELLED to COMPLETED style
    icon: Archive,
    headerClass: 'column-completed',
    accentClass: 'text-status-completed'
  }
};

export const OrderColumn = ({ 
  title, 
  status, 
  orders, 
  onStatusChange, 
  canTransitionTo 
}: OrderColumnProps) => {
  const config = columnConfig[status] || columnConfig.PENDING;
  const Icon = config.icon;

  return (
    <div className="flex flex-col h-full min-w-[320px] max-w-[380px]">
      {/* Column Header */}
      <div className={cn('column-header mb-4', config.headerClass)}>
        <Icon className={cn('h-5 w-5', config.accentClass)} />
        <span className="text-foreground">{title}</span>
        <span className={cn(
          'ml-auto flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold',
          'bg-background/50',
          config.accentClass
        )}>
          {orders.length}
        </span>
      </div>

      {/* Orders List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Icon className="h-8 w-8 mb-2 opacity-30" />
            <p className="text-sm">No orders</p>
          </div>
        ) : (
          orders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusChange={onStatusChange}
              canTransitionTo={canTransitionTo}
            />
          ))
        )}
      </div>
    </div>
  );
};
