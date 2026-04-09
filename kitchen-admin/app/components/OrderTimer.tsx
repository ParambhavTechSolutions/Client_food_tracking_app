import { OrderStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

interface OrderTimerProps {
    createdAt: Date;
    estimatedPrepTime: number;
    status: OrderStatus;
}

export const OrderTimer = ({ createdAt, estimatedPrepTime, status }: OrderTimerProps) => {
    const [elapsedMinutes, setElapsedMinutes] = useState(0);

    useEffect(() => {
        // Initial calc
        const updateTime = () => {
            const diff = Date.now() - new Date(createdAt).getTime();
            setElapsedMinutes(Math.floor(diff / 60000));
        };

        updateTime();

        // Update every minute
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, [createdAt]);

    const isOverdue = elapsedMinutes > estimatedPrepTime;
    const progressPercent = Math.min((elapsedMinutes / estimatedPrepTime) * 100, 100);

    // Don't show urgency for completed/ready orders
    if (status === 'COMPLETED' || status === 'READY' || status === 'CANCELLED') {
        return (
            <div className="flex flex-col items-end">
                <div className="flex items-center gap-1.5 text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                    <Clock className="w-3 h-3" />
                    <span className="font-mono text-xs font-medium">{elapsedMinutes}m</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-end gap-1">
            <div className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors",
                isOverdue ? "bg-destructive/10 text-destructive animate-pulse" : "bg-muted/50 text-muted-foreground"
            )}>
                <Clock className="w-3 h-3" />
                <span className="font-mono text-xs font-medium">{elapsedMinutes}m</span>
            </div>

            {/* Progress bar */}
            <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                <div
                    className={cn(
                        "h-full transition-all duration-300 rounded-full",
                        isOverdue ? "bg-destructive" : "bg-primary"
                    )}
                    style={{ width: `${progressPercent}%` }}
                />
            </div>
        </div>
    );
};
