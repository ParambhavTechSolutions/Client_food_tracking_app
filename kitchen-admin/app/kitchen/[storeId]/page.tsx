'use client';

import { MOCK_KITCHEN_ORDERS, generateRandomOrder } from '@/lib/mock-kitchen-data';
import { Order, OrderStatus } from '@/lib/types';
import { ChefHat, Volume2, VolumeX, Zap, ZapOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { OrderColumn } from '@/app/components/OrderColumn';

export default function KitchenDashboard({ params }: { params: { storeId: string } }) {
    const [orders, setOrders] = useState<Order[]>(MOCK_KITCHEN_ORDERS);
    const [isMuted, setIsMuted] = useState(false);
    const [autoGenerate, setAutoGenerate] = useState(true);

    // Filter helper
    const getOrdersByStatus = (status: OrderStatus) => {
        // Map simplified statuses to real statuses
        if (status === 'PENDING') return orders.filter(o => o.status === 'PAID' || o.status === 'PENDING');
        return orders.filter(o => o.status === status);
    };

    const updateOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
        setOrders((prev) =>
            prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
        );
        // Here you would play a sound if !isMuted
    };

    const canTransitionTo = (order: Order, targetStatus: OrderStatus) => {
        return true; // Simplified logic, allow all transitions for demo
    };

    // Auto-generate new orders for demo
    useEffect(() => {
        if (!autoGenerate) return;

        const interval = setInterval(() => {
            const newOrder = generateRandomOrder();
            setOrders(prev => [newOrder, ...prev]);

            // Play notification sound if not muted
            if (!isMuted) {
                // You could add: new Audio('/notification.mp3').play();
            }
        }, Math.random() * 7000 + 8000); // Random interval between 8-15 seconds

        return () => clearInterval(interval);
    }, [autoGenerate, isMuted]);

    const columns = [
        { title: 'New Orders', status: 'PENDING' as OrderStatus },
        { title: 'In Preparation', status: 'PREPARING' as OrderStatus },
        { title: 'Ready for Pickup', status: 'READY' as OrderStatus },
        { title: 'Completed', status: 'COMPLETED' as OrderStatus },
    ];

    return (
        <div className="flex flex-col h-screen bg-background font-sans">
            {/* Header */}
            <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm px-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <ChefHat className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold leading-tight">KitchenOS</h1>
                        <p className="text-xs text-muted-foreground">Store: {params.storeId}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
                    >
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <div className="h-8 w-px bg-border mx-2" />
                    <div className="text-right">
                        <p className="text-sm font-semibold">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        <p className="text-xs text-muted-foreground">{new Date().toLocaleDateString()}</p>
                    </div>
                </div>
            </header>

            {/* Dashboard Content */}
            <main className="flex-1 overflow-hidden p-6 relative">
                <div className="absolute inset-0 bg-dotted-pattern opacity-[0.03] pointer-events-none" />

                <div className="flex gap-6 h-full overflow-x-auto pb-4 scrollbar-thin">
                    {columns.map(column => (
                        <OrderColumn
                            key={column.status}
                            title={column.title}
                            status={column.status}
                            orders={getOrdersByStatus(column.status)}
                            onStatusChange={updateOrderStatus}
                            canTransitionTo={canTransitionTo}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}
