import { Order, OrderStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
    UtensilsCrossed,
    ShoppingBag,
    Truck,
    CreditCard,
    Banknote,
    Smartphone,
    ChefHat,
    CheckCircle2,
    Clock
} from 'lucide-react';
import { OrderTimer } from './OrderTimer';

interface OrderCardProps {
    order: Order;
    onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
    canTransitionTo: (order: Order, targetStatus: OrderStatus) => boolean;
}

const orderTypeConfig: any = {
    'dine-in': { icon: UtensilsCrossed, label: 'Dine-in', className: 'type-dinein' },
    'takeaway': { icon: ShoppingBag, label: 'Takeaway', className: 'type-takeaway' },
    'delivery': { icon: Truck, label: 'Delivery', className: 'type-delivery' },
};

// Fallback for undefined types
const defaultTypeConfig = { icon: UtensilsCrossed, label: 'Dine-in', className: 'type-dinein' };

const paymentConfig: any = {
    paid: { icon: CreditCard, label: 'Paid' },
    cod: { icon: Banknote, label: 'COD' },
    online: { icon: Smartphone, label: 'Online' },
};

// Fallback for payment
const defaultPaymentConfig = { icon: CreditCard, label: 'Paid' };

const statusConfig: Record<string, { label: string; className: string }> = {
    PAID: { label: 'Pending', className: 'status-pending' },
    PENDING: { label: 'Pending', className: 'status-pending' },
    PREPARING: { label: 'Preparing', className: 'status-preparation' },
    READY: { label: 'Ready', className: 'status-ready' },
    COMPLETED: { label: 'Completed', className: 'status-completed' },
    CANCELLED: { label: 'Cancelled', className: 'bg-red-500/10 text-red-500' },
};

export const OrderCard = ({ order, onStatusChange, canTransitionTo }: OrderCardProps) => {
    // Use order properties or defaults if they don't exist in existing type
    const orderType = (order as any).orderType || 'dine-in';
    const paymentStatus = 'paid'; // Defaulting to paid for now
    const customerName = (order as any).customerName || `Table ${order.tableId}`;
    const tokenNumber = (order as any).tokenNumber || order.id.split('_')[1];
    const estimatedPrepTime = (order as any).estimatedPrepTime || 15;

    const TypeConfig = orderTypeConfig[orderType] || defaultTypeConfig;
    const TypeIcon = TypeConfig.icon;

    const PaymentConfig = paymentConfig[paymentStatus] || defaultPaymentConfig;
    const PaymentIcon = PaymentConfig.icon;

    const StatusConfig = statusConfig[order.status] || statusConfig.PENDING;

    const getNextAction = () => {
        switch (order.status) {
            case 'PAID':
            case 'PENDING':
                return { label: 'Start Cooking', status: 'PREPARING' as OrderStatus, className: 'action-accept' };
            case 'PREPARING':
                return { label: 'Mark Ready', status: 'READY' as OrderStatus, className: 'action-ready' };
            case 'READY':
                return { label: 'Complete', status: 'COMPLETED' as OrderStatus, className: 'action-complete' };
            default:
                return null;
        }
    };

    const nextAction = getNextAction();
    const isPending = order.status === 'PAID' || order.status === 'PENDING';

    return (
        <div className={cn('order-card fade-in', isPending && 'pulse-new')}>
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-lg font-bold text-foreground">
                            #{tokenNumber}
                        </span>
                        <span className={cn('status-badge', StatusConfig.className)}>
                            {StatusConfig.label}
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground font-semibold">
                        {customerName}
                    </p>
                </div>
                <OrderTimer
                    createdAt={order.createdAt}
                    estimatedPrepTime={estimatedPrepTime}
                    status={order.status}
                />
            </div>

            {/* Meta badges */}
            <div className="flex items-center gap-2 mb-4">
                <span className={cn('type-badge', TypeConfig.className)}>
                    <TypeIcon className="h-3 w-3" />
                    {TypeConfig.label}
                </span>
                <span className="type-badge bg-muted text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {estimatedPrepTime}m
                </span>
                <span className="text-xs text-muted-foreground ml-auto font-mono">
                    {order.items.length} items
                </span>
            </div>

            {/* Items */}
            <div className="space-y-2 mb-4 bg-muted/30 p-2 rounded-lg">
                {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                        <span className="flex-shrink-0 w-5 h-5 rounded bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
                            {item.quantity}
                        </span>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                                {item.menuItem.name}
                            </p>
                            {item.specialInstructions && (
                                <p className="text-xs text-orange-400 italic">
                                    Note: {item.specialInstructions}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Action Button */}
            {nextAction && isPending && (
                <button
                    onClick={() => onStatusChange(order.id, nextAction.status)}
                    className={cn('action-button flex items-center justify-center gap-2', nextAction.className)}
                >
                    <ChefHat className="h-4 w-4" />
                    {nextAction.label}
                </button>
            )}

            {nextAction && order.status === 'PREPARING' && (
                <button
                    onClick={() => onStatusChange(order.id, nextAction.status)}
                    className={cn('action-button flex items-center justify-center gap-2', nextAction.className)}
                >
                    <CheckCircle2 className="h-4 w-4" />
                    {nextAction.label}
                </button>
            )}

            {nextAction && order.status === 'READY' && (
                <button
                    onClick={() => onStatusChange(order.id, nextAction.status)}
                    className={cn('action-button flex items-center justify-center gap-2', nextAction.className)}
                >
                    <CheckCircle2 className="h-4 w-4" />
                    {nextAction.label}
                </button>
            )}
        </div>
    );
};
