'use client';

import { MOCK_CATEGORIES, MOCK_MENU } from '@/lib/mock-data';
import { MenuItem } from '@/lib/types';
import {
    LayoutDashboard, Search, Settings, HelpCircle, LogOut, Grid3x3, Receipt,
    Users, UtensilsCrossed, ClipboardList, TrendingUp, TrendingDown, Clock,
    DollarSign, ShoppingBag, ChevronRight, AlertCircle, Bell, FileText, Plus,
    Filter, ChefHat, CheckCircle2, ArrowRight, Printer, X, Eye, Timer,
    Activity, BarChart3, Zap
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { getOrders } from '@/lib/order-storage';
import { startOrderGenerator, clearAllOrders, addTestOrder } from '@/lib/test-order-generator';

export default function AdminDashboard({ params }: { params: { storeId: string } }) {
    const [menuItems, setMenuItems] = useState<MenuItem[]>(MOCK_MENU);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'tables' | 'dishes' | 'customers' | 'billing'>('dashboard');

    // Mock manager data
    const [manager] = useState({
        name: 'Ibrahim Kadri',
        role: 'Manager',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ibrahim'
    });

    // Orders data
    const [orders, setOrders] = useState<any[]>([]);

    // Order Line filters
    const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
    const [orderTimeFilter, setOrderTimeFilter] = useState<string>('today');

    // Drag and drop state
    const [draggedOrder, setDraggedOrder] = useState<any>(null);

    // Order details modal
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);

    // Sound alerts
    const [soundEnabled, setSoundEnabled] = useState(true);
    const audioContextRef = useRef<AudioContext | null>(null);
    const previousOrderCountRef = useRef(0);

    // Current time for timer calculations
    const [currentTime, setCurrentTime] = useState(new Date());

    // Test order generator
    const [isGeneratorRunning, setIsGeneratorRunning] = useState(false);
    const generatorStopFnRef = useRef<(() => void) | null>(null);

    // Load orders from localStorage and setup auto-refresh
    useEffect(() => {
        setOrders(getOrders());
        const handleUpdate = () => setOrders(getOrders());
        window.addEventListener('ordersUpdated', handleUpdate);
        window.addEventListener('storage', handleUpdate);

        // Auto-refresh every 5 seconds
        const refreshInterval = setInterval(() => {
            const latestOrders = getOrders();
            setOrders(latestOrders);
        }, 5000);

        return () => {
            window.removeEventListener('ordersUpdated', handleUpdate);
            window.removeEventListener('storage', handleUpdate);
            clearInterval(refreshInterval);
        };
    }, []);

    // Update current time every second for timers
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Sound alert for new orders
    useEffect(() => {
        if (orders.length > previousOrderCountRef.current && soundEnabled && previousOrderCountRef.current > 0) {
            playNotificationSound();
        }
        previousOrderCountRef.current = orders.length;
    }, [orders.length, soundEnabled]);

    // Filter items
    const filteredItems = menuItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleAvailability = (id: string) => {
        setMenuItems(prev => prev.map(item =>
            item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
        ));
    };

    // Dashboard metrics calculation
    const getDashboardMetrics = () => {
        const today = new Date().toDateString();
        const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today);
        const activeOrders = orders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED');
        const completedToday = todayOrders.filter(o => o.status === 'COMPLETED');

        const todayRevenue = completedToday.reduce((sum, o) => sum + o.totalAmount, 0);
        const yesterdayRevenue = 4500; // Mock data
        const revenueChange = yesterdayRevenue > 0 ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue * 100).toFixed(1) : '0';

        // Mock table data
        const totalTables = 12;
        const occupiedTables = new Set(activeOrders.map(o => o.tableId)).size;

        // Top selling items
        const itemCounts: { [key: string]: number } = {};
        todayOrders.forEach(order => {
            order.items?.forEach((item: any) => {
                const itemName = item.name || 'Unknown Item';
                itemCounts[itemName] = (itemCounts[itemName] || 0) + (item.quantity || 1);
            });
        });
        const topItems = Object.entries(itemCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([name, count]) => ({ name, count }));

        // Recent orders (last 5)
        const recentOrders = [...todayOrders]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5);

        // Performance metrics
        const avgPrepTime = 15; // Mock
        const tableTurnover = 2.3; // Mock
        const avgOrderValue = todayOrders.length > 0 ? Math.round(todayRevenue / todayOrders.length) : 0;
        const peakHour = '1-2 PM'; // Mock

        // Revenue trend (last 7 days - mock data)
        const revenueTrend = [3200, 2800, 4100, 3600, 4500, 3900, todayRevenue];

        return {
            todayRevenue,
            revenueChange,
            activeOrders: activeOrders.length,
            occupiedTables,
            totalTables,
            totalCustomers: todayOrders.length,
            topItems,
            recentOrders,
            avgPrepTime,
            tableTurnover,
            avgOrderValue,
            peakHour,
            revenueTrend
        };
    };

    const metrics = getDashboardMetrics();

    // Filter orders for Order Line
    const getFilteredOrders = () => {
        let filtered = [...orders];

        // Time filter
        const now = new Date();
        if (orderTimeFilter === 'today') {
            filtered = filtered.filter(o => new Date(o.createdAt).toDateString() === now.toDateString());
        } else if (orderTimeFilter === 'yesterday') {
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            filtered = filtered.filter(o => new Date(o.createdAt).toDateString() === yesterday.toDateString());
        } else if (orderTimeFilter === 'last7days') {
            const sevenDaysAgo = new Date(now);
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            filtered = filtered.filter(o => new Date(o.createdAt) >= sevenDaysAgo);
        }

        // Status filter
        if (orderStatusFilter !== 'all') {
            filtered = filtered.filter(o => o.status.toLowerCase() === orderStatusFilter.toLowerCase());
        }

        return filtered;
    };

    // Group orders by status for Kanban columns
    const ordersByStatus = {
        PENDING: getFilteredOrders().filter(o => o.status === 'PENDING'),
        PREPARING: getFilteredOrders().filter(o => o.status === 'PREPARING'),
        READY: getFilteredOrders().filter(o => o.status === 'READY'),
        COMPLETED: getFilteredOrders().filter(o => o.status === 'COMPLETED')
    };

    // Update order status
    const updateOrderStatus = (orderId: string, newStatus: string) => {
        const updatedOrders = orders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
        localStorage.setItem('cloud_kitchen_orders', JSON.stringify(updatedOrders));
        window.dispatchEvent(new Event('ordersUpdated'));
    };

    // Cancel order
    const cancelOrder = (orderId: string) => {
        if (confirm('Are you sure you want to cancel this order?')) {
            const updatedOrders = orders.map(order =>
                order.id === orderId ? { ...order, status: 'CANCELLED' } : order
            );
            setOrders(updatedOrders);
            localStorage.setItem('cloud_kitchen_orders', JSON.stringify(updatedOrders));
            window.dispatchEvent(new Event('ordersUpdated'));
        }
    };

    // Print KOT (Kitchen Order Ticket)
    const printKOT = (order: any) => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>KOT - ${order.id}</title>
                        <style>
                            body { font-family: monospace; padding: 20px; }
                            h1 { font-size: 18px; text-align: center; }
                            .info { margin: 10px 0; }
                            .items { margin-top: 20px; }
                            .item { margin: 5px 0; }
                            hr { border: 1px dashed #000; }
                        </style>
                    </head>
                    <body>
                        <h1>KITCHEN ORDER TICKET</h1>
                        <hr>
                        <div class="info"><strong>Order ID:</strong> ${order.id}</div>
                        <div class="info"><strong>Table:</strong> ${order.tableId}</div>
                        <div class="info"><strong>Time:</strong> ${new Date(order.createdAt).toLocaleString()}</div>
                        <hr>
                        <div class="items">
                            <strong>ITEMS:</strong>
                            ${order.items?.map((item: any) => `
                                <div class="item">${item.quantity}x ${item.name}</div>
                            `).join('')}
                        </div>
                        <hr>
                        <div class="info"><strong>Total:</strong> ₹${order.totalAmount}</div>
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    };

    // Print Bill (Customer Invoice)
    const printBill = (order: any) => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            const subtotal = order.totalAmount;
            const tax = Math.round(subtotal * 0.05); // 5% GST
            const total = subtotal + tax;

            printWindow.document.write(`
                <html>
                    <head>
                        <title>Bill - ${order.id}</title>
                        <style>
                            body { 
                                font-family: 'Arial', sans-serif; 
                                padding: 30px; 
                                max-width: 400px;
                                margin: 0 auto;
                            }
                            .header { 
                                text-align: center; 
                                margin-bottom: 20px;
                                border-bottom: 2px solid #333;
                                padding-bottom: 15px;
                            }
                            .header h1 { 
                                font-size: 24px; 
                                margin: 0;
                                color: #14b8a6;
                            }
                            .header p { 
                                margin: 5px 0;
                                font-size: 12px;
                                color: #666;
                            }
                            .info { 
                                display: flex;
                                justify-content: space-between;
                                margin: 8px 0;
                                font-size: 14px;
                            }
                            .info strong { color: #333; }
                            .items { 
                                margin: 20px 0;
                                border-top: 1px dashed #999;
                                border-bottom: 1px dashed #999;
                                padding: 15px 0;
                            }
                            .items h3 {
                                margin: 0 0 10px 0;
                                font-size: 16px;
                            }
                            .item { 
                                display: flex;
                                justify-content: space-between;
                                margin: 8px 0;
                                font-size: 14px;
                            }
                            .item-name {
                                flex: 1;
                            }
                            .item-qty {
                                width: 40px;
                                text-align: center;
                                color: #666;
                            }
                            .item-price {
                                width: 80px;
                                text-align: right;
                                font-weight: bold;
                            }
                            .totals {
                                margin-top: 15px;
                            }
                            .total-row {
                                display: flex;
                                justify-content: space-between;
                                margin: 8px 0;
                                font-size: 14px;
                            }
                            .total-row.grand {
                                font-size: 18px;
                                font-weight: bold;
                                border-top: 2px solid #333;
                                padding-top: 10px;
                                margin-top: 10px;
                            }
                            .footer {
                                text-align: center;
                                margin-top: 30px;
                                padding-top: 15px;
                                border-top: 1px solid #ddd;
                                font-size: 12px;
                                color: #666;
                            }
                            @media print {
                                body { padding: 15px; }
                            }
                        </style>
                    </head>
                    <body>
                        <div class="header">
                            <h1>Cloud Kitchen</h1>
                            <p>FitNFlex Restaurant</p>
                            <p>Phone: +91 98765 43210</p>
                            <p>GSTIN: 29ABCDE1234F1Z5</p>
                        </div>
                        
                        <div class="info">
                            <span><strong>Bill No:</strong> ${order.id}</span>
                            <span><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div class="info">
                            <span><strong>Table:</strong> ${order.tableId}</span>
                            <span><strong>Time:</strong> ${new Date(order.createdAt).toLocaleTimeString()}</span>
                        </div>
                        
                        <div class="items">
                            <h3>Order Details</h3>
                            ${order.items?.map((item: any) => `
                                <div class="item">
                                    <span class="item-name">${item.name}</span>
                                    <span class="item-qty">x${item.quantity}</span>
                                    <span class="item-price">₹${item.price * item.quantity}</span>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div class="totals">
                            <div class="total-row">
                                <span>Subtotal:</span>
                                <span>₹${subtotal}</span>
                            </div>
                            <div class="total-row">
                                <span>GST (5%):</span>
                                <span>₹${tax}</span>
                            </div>
                            <div class="total-row grand">
                                <span>TOTAL:</span>
                                <span>₹${total}</span>
                            </div>
                        </div>
                        
                        <div class="footer">
                            <p><strong>Thank you for dining with us!</strong></p>
                            <p>Visit us again soon</p>
                        </div>
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    };

    // Test order generator controls
    const toggleOrderGenerator = () => {
        if (isGeneratorRunning) {
            // Stop generator
            if (generatorStopFnRef.current) {
                generatorStopFnRef.current();
                generatorStopFnRef.current = null;
            }
            setIsGeneratorRunning(false);
        } else {
            // Start generator
            const stopFn = startOrderGenerator(10); // Every 10 seconds
            generatorStopFnRef.current = stopFn;
            setIsGeneratorRunning(true);
        }
    };

    const handleClearAllOrders = () => {
        if (confirm('Are you sure you want to clear all orders? This cannot be undone.')) {
            clearAllOrders();
            setOrders([]);
        }
    };

    const handleAddSingleOrder = () => {
        addTestOrder();
    };

    // Play notification sound
    const playNotificationSound = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const ctx = audioContextRef.current;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.5);
    };

    // Calculate elapsed time
    const getElapsedTime = (createdAt: string) => {
        const diff = currentTime.getTime() - new Date(createdAt).getTime();
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        return { minutes, seconds, total: minutes };
    };

    // Get urgency color based on elapsed time
    const getUrgencyColor = (createdAt: string, status: string) => {
        const elapsed = getElapsedTime(createdAt).total;

        if (status === 'COMPLETED') return 'normal';
        if (elapsed > 30) return 'critical'; // Red
        if (elapsed > 15) return 'warning'; // Orange
        return 'normal'; // Default
    };

    // Drag and drop handlers
    const handleDragStart = (order: any) => {
        setDraggedOrder(order);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (newStatus: string) => {
        if (draggedOrder) {
            updateOrderStatus(draggedOrder.id, newStatus);
            setDraggedOrder(null);
        }
    };

    // Calculate order statistics
    const getOrderStatistics = () => {
        const filtered = getFilteredOrders();
        const pending = filtered.filter(o => o.status === 'PENDING').length;
        const preparing = filtered.filter(o => o.status === 'PREPARING').length;
        const ready = filtered.filter(o => o.status === 'READY').length;
        const completed = filtered.filter(o => o.status === 'COMPLETED').length;

        const preparingOrders = filtered.filter(o => o.status === 'PREPARING');
        const avgPrepTime = preparingOrders.length > 0
            ? Math.round(preparingOrders.reduce((sum, o) => sum + getElapsedTime(o.createdAt).total, 0) / preparingOrders.length)
            : 0;

        const oldestOrder = filtered.length > 0
            ? Math.max(...filtered.map(o => getElapsedTime(o.createdAt).total))
            : 0;

        return {
            total: filtered.length,
            pending,
            preparing,
            ready,
            completed,
            avgPrepTime,
            oldestOrder
        };
    };

    const orderStats = getOrderStatistics();

    // Get tab title
    const getTabTitle = () => {
        switch (activeTab) {
            case 'dashboard': return 'Dashboard';
            case 'orders': return 'Order Line';
            case 'tables': return 'Manage Table';
            case 'dishes': return 'Manage Dishes';
            case 'customers': return 'Customers';
            case 'billing': return 'Table Billing';
            default: return 'Dashboard';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex">
            {/* Left Sidebar - Dark */}
            <aside className="w-64 bg-gray-800 flex flex-col shadow-xl">
                {/* Logo */}
                <div className="p-6 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center">
                            <UtensilsCrossed className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg text-white">Cloud Kitchen</h1>
                            <p className="text-xs text-gray-400">Admin Panel</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'dashboard'
                            ? 'bg-gray-700 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'orders'
                            ? 'bg-gray-700 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                    >
                        <ClipboardList className="w-5 h-5" />
                        Order Line
                    </button>
                    <button
                        onClick={() => setActiveTab('tables')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'tables'
                            ? 'bg-gray-700 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                    >
                        <Grid3x3 className="w-5 h-5" />
                        Manage Table
                    </button>
                    <button
                        onClick={() => setActiveTab('dishes')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'dishes'
                            ? 'bg-gray-700 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                    >
                        <UtensilsCrossed className="w-5 h-5" />
                        Manage Dishes
                    </button>
                    <button
                        onClick={() => setActiveTab('customers')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'customers'
                            ? 'bg-gray-700 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                    >
                        <Users className="w-5 h-5" />
                        Customers
                    </button>
                    <button
                        onClick={() => setActiveTab('billing')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'billing'
                            ? 'bg-gray-700 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                    >
                        <Receipt className="w-5 h-5" />
                        Table Billing
                    </button>
                </nav>

                {/* Bottom Menu */}
                <div className="p-4 border-t border-gray-700 space-y-1">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-all">
                        <Settings className="w-5 h-5" />
                        Settings
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-all">
                        <HelpCircle className="w-5 h-5" />
                        Help Center
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-gray-700 hover:text-red-300 transition-all">
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 bg-gradient-to-br from-teal-50 to-blue-50 overflow-y-auto">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 px-8 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-800">{getTabTitle()}</h1>

                        {/* Manager Profile */}
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-sm font-semibold text-gray-800">{manager.name}</p>
                                <p className="text-xs text-gray-500">{manager.role}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border-2 border-teal-200">
                                <img src={manager.avatar} alt={manager.name} className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    {/* Dashboard Section */}
                    {activeTab === 'dashboard' && (
                        <div className="space-y-6">
                            {/* Top Metrics Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Revenue Card */}
                                <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-6 text-white shadow-lg">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                            <DollarSign className="w-6 h-6" />
                                        </div>
                                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${Number(metrics.revenueChange) >= 0 ? 'bg-green-500/30' : 'bg-red-500/30'
                                            }`}>
                                            {Number(metrics.revenueChange) >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                            {Math.abs(Number(metrics.revenueChange))}%
                                        </div>
                                    </div>
                                    <p className="text-white/80 text-sm mb-1">Today's Revenue</p>
                                    <p className="text-3xl font-bold">₹{metrics.todayRevenue}</p>
                                </div>

                                {/* Active Orders Card */}
                                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                            <ShoppingBag className="w-6 h-6 text-orange-600" />
                                        </div>
                                        {metrics.activeOrders > 0 && (
                                            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                                        )}
                                    </div>
                                    <p className="text-gray-500 text-sm mb-1">Active Orders</p>
                                    <p className="text-3xl font-bold text-gray-900">{metrics.activeOrders}</p>
                                    <p className="text-gray-400 text-xs mt-2">Currently being prepared</p>
                                </div>

                                {/* Tables Occupied Card */}
                                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <Grid3x3 className="w-6 h-6 text-blue-600" />
                                        </div>
                                    </div>
                                    <p className="text-gray-500 text-sm mb-1">Tables Occupied</p>
                                    <p className="text-3xl font-bold text-gray-900">{metrics.occupiedTables}/{metrics.totalTables}</p>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                                        <div
                                            className="bg-blue-500 h-2 rounded-full transition-all"
                                            style={{ width: `${(metrics.occupiedTables / metrics.totalTables) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Total Customers Card */}
                                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <Users className="w-6 h-6 text-purple-600" />
                                        </div>
                                    </div>
                                    <p className="text-gray-500 text-sm mb-1">Total Customers</p>
                                    <p className="text-3xl font-bold text-gray-900">{metrics.totalCustomers}</p>
                                    <p className="text-gray-400 text-xs mt-2">Today's count</p>
                                </div>
                            </div>

                            {/* Charts and Lists Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Revenue Trend Chart */}
                                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">Revenue Trend (Last 7 Days)</h3>
                                    <div className="h-64 flex items-end justify-between gap-2">
                                        {metrics.revenueTrend.map((value, index) => (
                                            <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                                <div className="text-xs text-gray-500 font-medium">₹{value}</div>
                                                <div
                                                    className="w-full bg-gradient-to-t from-teal-500 to-teal-400 rounded-t-lg transition-all hover:from-teal-600 hover:to-teal-500 cursor-pointer"
                                                    style={{ height: `${(value / 5000) * 100}%` }}
                                                ></div>
                                                <span className="text-xs text-gray-500">
                                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'][index]}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Top Selling Items */}
                                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">Top Selling Items Today</h3>
                                    <div className="space-y-3">
                                        {metrics.topItems.length > 0 ? (
                                            metrics.topItems.map((item, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-700 font-bold text-sm">
                                                            #{index + 1}
                                                        </div>
                                                        <span className="font-medium text-gray-800 text-sm">{item.name}</span>
                                                    </div>
                                                    <span className="text-teal-600 font-bold">{item.count}x</span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8 text-gray-400">
                                                <p className="text-sm">No orders yet today</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Recent Orders and Quick Actions Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Recent Orders Timeline */}
                                <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Orders</h3>
                                    <div className="space-y-3">
                                        {metrics.recentOrders.length > 0 ? (
                                            metrics.recentOrders.map((order: any) => (
                                                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                                                            <Receipt className="w-5 h-5 text-teal-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900 text-sm">#{order.id.slice(-6)}</p>
                                                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                                <Clock className="w-3 h-3" />
                                                                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                <span>•</span>
                                                                <span>{order.tableId}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-gray-900">₹{order.totalAmount}</p>
                                                        <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                            order.status === 'PREPARING' ? 'bg-blue-100 text-blue-700' :
                                                                'bg-yellow-100 text-yellow-700'
                                                            }`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8 text-gray-400">
                                                <p className="text-sm">No recent orders</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Quick Actions Panel */}
                                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => setActiveTab('orders')}
                                            className="w-full flex items-center justify-between p-3 bg-teal-50 hover:bg-teal-100 rounded-xl transition-all group"
                                        >
                                            <span className="text-sm font-medium text-teal-700">View All Orders</span>
                                            <ChevronRight className="w-4 h-4 text-teal-600 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('tables')}
                                            className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all group"
                                        >
                                            <span className="text-sm font-medium text-gray-700">Manage Tables</span>
                                            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                        <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all group">
                                            <span className="text-sm font-medium text-gray-700">Generate Report</span>
                                            <FileText className="w-4 h-4 text-gray-600" />
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('dishes')}
                                            className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all group"
                                        >
                                            <span className="text-sm font-medium text-gray-700">Add New Dish</span>
                                            <Plus className="w-4 h-4 text-gray-600" />
                                        </button>
                                    </div>

                                    {/* Alerts */}
                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                            <Bell className="w-4 h-4" />
                                            Alerts
                                        </h4>
                                        <div className="space-y-2">
                                            {metrics.activeOrders > 5 && (
                                                <div className="flex items-start gap-2 p-2 bg-orange-50 rounded-lg">
                                                    <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5" />
                                                    <p className="text-xs text-orange-700">High order volume</p>
                                                </div>
                                            )}
                                            <div className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg">
                                                <Bell className="w-4 h-4 text-blue-600 mt-0.5" />
                                                <p className="text-xs text-blue-700">2 new reservations</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Performance Metrics Row */}
                            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                                <h3 className="text-lg font-bold mb-6">Performance Metrics</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Clock className="w-5 h-5 opacity-80" />
                                            <p className="text-white/80 text-sm">Avg. Prep Time</p>
                                        </div>
                                        <p className="text-3xl font-bold">{metrics.avgPrepTime} min</p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <TrendingUp className="w-5 h-5 opacity-80" />
                                            <p className="text-white/80 text-sm">Table Turnover</p>
                                        </div>
                                        <p className="text-3xl font-bold">{metrics.tableTurnover}x</p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <DollarSign className="w-5 h-5 opacity-80" />
                                            <p className="text-white/80 text-sm">Avg. Order Value</p>
                                        </div>
                                        <p className="text-3xl font-bold">₹{metrics.avgOrderValue}</p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Clock className="w-5 h-5 opacity-80" />
                                            <p className="text-white/80 text-sm">Peak Hour</p>
                                        </div>
                                        <p className="text-3xl font-bold">{metrics.peakHour}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Manage Dishes Section */}
                    {activeTab === 'dishes' && (
                        <div className="space-y-6">
                            {/* Search Bar */}
                            <div className="flex items-center gap-4">
                                <div className="flex-1 relative">
                                    <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search dishes..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                                    />
                                </div>
                            </div>

                            {/* Dishes Table */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Item Details</th>
                                            <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                                            <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Price (₹)</th>
                                            <th className="text-center px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredItems.map(item => (
                                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                                            {item.imageUrl && <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                                                            <p className="text-xs text-gray-500 line-clamp-1 max-w-[300px]">{item.description}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200">
                                                        {MOCK_CATEGORIES.find(c => c.id === item.categoryId)?.name || 'Unknown'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-mono font-semibold text-gray-700">
                                                    ₹{item.price}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() => toggleAvailability(item.id)}
                                                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${item.isAvailable ? 'bg-teal-500' : 'bg-gray-300'
                                                            }`}
                                                    >
                                                        <span
                                                            className={`${item.isAvailable ? 'translate-x-5' : 'translate-x-0'
                                                                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                                                        />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Order Line Section */}
                    {activeTab === 'orders' && (
                        <div className="space-y-6">
                            {/* Order Statistics Dashboard */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <Activity className="w-8 h-8 opacity-80" />
                                        <span className="text-2xl font-bold">{orderStats.total}</span>
                                    </div>
                                    <p className="text-sm opacity-90">Total Orders</p>
                                    <p className="text-xs opacity-75 mt-1">
                                        {orderStats.pending}P • {orderStats.preparing}Pr • {orderStats.ready}R • {orderStats.completed}C
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <Timer className="w-8 h-8 opacity-80" />
                                        <span className="text-2xl font-bold">{orderStats.avgPrepTime}</span>
                                    </div>
                                    <p className="text-sm opacity-90">Avg Prep Time</p>
                                    <p className="text-xs opacity-75 mt-1">Minutes per order</p>
                                </div>

                                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white shadow-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <AlertCircle className="w-8 h-8 opacity-80" />
                                        <span className="text-2xl font-bold">{orderStats.oldestOrder}</span>
                                    </div>
                                    <p className="text-sm opacity-90">Oldest Order</p>
                                    <p className="text-xs opacity-75 mt-1">Minutes waiting</p>
                                </div>

                                <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-4 text-white shadow-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <Zap className="w-8 h-8 opacity-80" />
                                        <button
                                            onClick={() => setSoundEnabled(!soundEnabled)}
                                            className="text-2xl font-bold hover:scale-110 transition-transform"
                                        >
                                            {soundEnabled ? '🔔' : '🔕'}
                                        </button>
                                    </div>
                                    <p className="text-sm opacity-90">Sound Alerts</p>
                                    <p className="text-xs opacity-75 mt-1">{soundEnabled ? 'Enabled' : 'Disabled'}</p>
                                </div>
                            </div>

                            {/* Test Order Generator Control Panel */}
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                            <Activity className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white">Test Order Generator</h3>
                                            <p className="text-xs text-white/80">Auto-create orders every 10 seconds for testing</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={handleAddSingleOrder}
                                            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                                        >
                                            <Plus className="w-4 h-4" /> Add One
                                        </button>
                                        <button
                                            onClick={toggleOrderGenerator}
                                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${isGeneratorRunning
                                                    ? 'bg-red-500 hover:bg-red-600 text-white'
                                                    : 'bg-white hover:bg-gray-100 text-indigo-600'
                                                }`}
                                        >
                                            {isGeneratorRunning ? (
                                                <>
                                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                                    Stop Auto-Gen
                                                </>
                                            ) : (
                                                <>
                                                    <Activity className="w-4 h-4" /> Start Auto-Gen
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={handleClearAllOrders}
                                            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                                        >
                                            <X className="w-4 h-4" /> Clear All
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Filters Bar */}
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                                <div className="flex flex-wrap items-center gap-4">
                                    {/* Status Filter */}
                                    <div className="flex items-center gap-2">
                                        <Filter className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm font-medium text-gray-700">Status:</span>
                                        <div className="flex gap-2">
                                            {['all', 'pending', 'preparing', 'ready', 'completed'].map(status => (
                                                <button
                                                    key={status}
                                                    onClick={() => setOrderStatusFilter(status)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${orderStatusFilter === status
                                                        ? 'bg-teal-500 text-white'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Time Filter */}
                                    <div className="flex items-center gap-2 ml-auto">
                                        <Clock className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm font-medium text-gray-700">Time:</span>
                                        <div className="flex gap-2">
                                            {[
                                                { value: 'today', label: 'Today' },
                                                { value: 'yesterday', label: 'Yesterday' },
                                                { value: 'last7days', label: 'Last 7 Days' }
                                            ].map(option => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => setOrderTimeFilter(option.value)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${orderTimeFilter === option.value
                                                        ? 'bg-teal-500 text-white'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Kanban Board */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* PENDING Column */}
                                <div
                                    className="bg-white rounded-xl border-2 border-yellow-200 overflow-hidden"
                                    onDragOver={handleDragOver}
                                    onDrop={() => handleDrop('PENDING')}
                                >
                                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-4 py-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-5 h-5 text-white" />
                                            <h3 className="font-bold text-white">PENDING</h3>
                                        </div>
                                        <span className="bg-white/30 text-white text-xs font-bold px-2 py-1 rounded-full">
                                            {ordersByStatus.PENDING.length}
                                        </span>
                                    </div>
                                    <div className="p-3 space-y-3 max-h-[600px] overflow-y-auto">
                                        {ordersByStatus.PENDING.map(order => {
                                            const elapsed = getElapsedTime(order.createdAt);
                                            const urgency = getUrgencyColor(order.createdAt, order.status);

                                            return (
                                                <div
                                                    key={order.id}
                                                    draggable
                                                    onDragStart={() => handleDragStart(order)}
                                                    className={`rounded-lg p-3 border-2 hover:shadow-lg transition-all cursor-move ${urgency === 'critical' ? 'bg-red-50 border-red-300 animate-pulse' :
                                                        urgency === 'warning' ? 'bg-orange-50 border-orange-300' :
                                                            'bg-gray-50 border-gray-200'
                                                        }`}
                                                >
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <p className="font-bold text-gray-900 text-sm">#{order.id.slice(-6)}</p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                                                    <Clock className="w-3 h-3" />
                                                                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </p>
                                                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${urgency === 'critical' ? 'bg-red-500 text-white' :
                                                                    urgency === 'warning' ? 'bg-orange-500 text-white' :
                                                                        'bg-blue-500 text-white'
                                                                    }`}>
                                                                    {elapsed.minutes}m {elapsed.seconds}s
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                                            {order.tableId}
                                                        </span>
                                                    </div>
                                                    <div className="mb-3">
                                                        <p className="text-xs text-gray-600 mb-1">Items:</p>
                                                        <div className="space-y-1">
                                                            {order.items?.slice(0, 2).map((item: any, idx: number) => (
                                                                <p key={idx} className="text-xs text-gray-700">
                                                                    {item.quantity}x {item.name}
                                                                </p>
                                                            ))}
                                                            {order.items?.length > 2 && (
                                                                <p className="text-xs text-gray-500">+{order.items.length - 2} more</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                                        <p className="font-bold text-gray-900">₹{order.totalAmount}</p>
                                                        <button
                                                            onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                                                            className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded hover:bg-blue-600 transition-colors flex items-center gap-1"
                                                        >
                                                            Start <ArrowRight className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    {/* Action Buttons */}
                                                    <div className="flex gap-1 mt-2">
                                                        <button
                                                            onClick={() => printKOT(order)}
                                                            className="flex-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded flex items-center justify-center gap-1"
                                                            title="Print KOT"
                                                        >
                                                            <Printer className="w-3 h-3" /> KOT
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedOrder(order);
                                                                setShowOrderDetails(true);
                                                            }}
                                                            className="flex-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded flex items-center justify-center gap-1"
                                                            title="View Details"
                                                        >
                                                            <Eye className="w-3 h-3" /> View
                                                        </button>
                                                        <button
                                                            onClick={() => cancelOrder(order.id)}
                                                            className="flex-1 px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs rounded flex items-center justify-center gap-1"
                                                            title="Cancel Order"
                                                        >
                                                            <X className="w-3 h-3" /> Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {ordersByStatus.PENDING.length === 0 && (
                                            <div className="text-center py-8 text-gray-400">
                                                <p className="text-sm">No pending orders</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* PREPARING Column */}
                                <div className="bg-white rounded-xl border-2 border-blue-200 overflow-hidden">
                                    <div className="bg-gradient-to-r from-blue-400 to-blue-500 px-4 py-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <ChefHat className="w-5 h-5 text-white" />
                                            <h3 className="font-bold text-white">PREPARING</h3>
                                        </div>
                                        <span className="bg-white/30 text-white text-xs font-bold px-2 py-1 rounded-full">
                                            {ordersByStatus.PREPARING.length}
                                        </span>
                                    </div>
                                    <div className="p-3 space-y-3 max-h-[600px] overflow-y-auto">
                                        {ordersByStatus.PREPARING.map(order => (
                                            <div key={order.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <p className="font-bold text-gray-900 text-sm">#{order.id.slice(-6)}</p>
                                                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                            <Clock className="w-3 h-3" />
                                                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                    <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                                        {order.tableId}
                                                    </span>
                                                </div>
                                                <div className="mb-3">
                                                    <p className="text-xs text-gray-600 mb-1">Items:</p>
                                                    <div className="space-y-1">
                                                        {order.items?.slice(0, 2).map((item: any, idx: number) => (
                                                            <p key={idx} className="text-xs text-gray-700">
                                                                {item.quantity}x {item.name}
                                                            </p>
                                                        ))}
                                                        {order.items?.length > 2 && (
                                                            <p className="text-xs text-gray-500">+{order.items.length - 2} more</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                                    <p className="font-bold text-gray-900">₹{order.totalAmount}</p>
                                                    <button
                                                        onClick={() => updateOrderStatus(order.id, 'READY')}
                                                        className="px-3 py-1 bg-purple-500 text-white text-xs font-medium rounded hover:bg-purple-600 transition-colors flex items-center gap-1"
                                                    >
                                                        Ready <ArrowRight className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {ordersByStatus.PREPARING.length === 0 && (
                                            <div className="text-center py-8 text-gray-400">
                                                <p className="text-sm">No orders in preparation</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* READY Column */}
                                <div className="bg-white rounded-xl border-2 border-purple-200 overflow-hidden">
                                    <div className="bg-gradient-to-r from-purple-400 to-purple-500 px-4 py-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Bell className="w-5 h-5 text-white" />
                                            <h3 className="font-bold text-white">READY</h3>
                                        </div>
                                        <span className="bg-white/30 text-white text-xs font-bold px-2 py-1 rounded-full">
                                            {ordersByStatus.READY.length}
                                        </span>
                                    </div>
                                    <div className="p-3 space-y-3 max-h-[600px] overflow-y-auto">
                                        {ordersByStatus.READY.map(order => (
                                            <div key={order.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <p className="font-bold text-gray-900 text-sm">#{order.id.slice(-6)}</p>
                                                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                            <Clock className="w-3 h-3" />
                                                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                    <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                                        {order.tableId}
                                                    </span>
                                                </div>
                                                <div className="mb-3">
                                                    <p className="text-xs text-gray-600 mb-1">Items:</p>
                                                    <div className="space-y-1">
                                                        {order.items?.slice(0, 2).map((item: any, idx: number) => (
                                                            <p key={idx} className="text-xs text-gray-700">
                                                                {item.quantity}x {item.name}
                                                            </p>
                                                        ))}
                                                        {order.items?.length > 2 && (
                                                            <p className="text-xs text-gray-500">+{order.items.length - 2} more</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                                    <p className="font-bold text-gray-900">₹{order.totalAmount}</p>
                                                    <button
                                                        onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                                                        className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded hover:bg-green-600 transition-colors flex items-center gap-1"
                                                    >
                                                        Complete <CheckCircle2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {ordersByStatus.READY.length === 0 && (
                                            <div className="text-center py-8 text-gray-400">
                                                <p className="text-sm">No orders ready</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* COMPLETED Column */}
                                <div className="bg-white rounded-xl border-2 border-green-200 overflow-hidden">
                                    <div className="bg-gradient-to-r from-green-400 to-green-500 px-4 py-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-white" />
                                            <h3 className="font-bold text-white">COMPLETED</h3>
                                        </div>
                                        <span className="bg-white/30 text-white text-xs font-bold px-2 py-1 rounded-full">
                                            {ordersByStatus.COMPLETED.length}
                                        </span>
                                    </div>
                                    <div className="p-3 space-y-3 max-h-[600px] overflow-y-auto">
                                        {ordersByStatus.COMPLETED.map(order => (
                                            <div key={order.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow opacity-75">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <p className="font-bold text-gray-900 text-sm">#{order.id.slice(-6)}</p>
                                                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                            <Clock className="w-3 h-3" />
                                                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                    <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                                        {order.tableId}
                                                    </span>
                                                </div>
                                                <div className="mb-3">
                                                    <p className="text-xs text-gray-600 mb-1">Items:</p>
                                                    <div className="space-y-1">
                                                        {order.items?.slice(0, 2).map((item: any, idx: number) => (
                                                            <p key={idx} className="text-xs text-gray-700">
                                                                {item.quantity}x {item.name}
                                                            </p>
                                                        ))}
                                                        {order.items?.length > 2 && (
                                                            <p className="text-xs text-gray-500">+{order.items.length - 2} more</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                                    <p className="font-bold text-gray-900">₹{order.totalAmount}</p>
                                                    <button
                                                        onClick={() => printBill(order)}
                                                        className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded transition-colors flex items-center gap-1"
                                                    >
                                                        <Printer className="w-3 h-3" /> Print Bill
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {ordersByStatus.COMPLETED.length === 0 && (
                                            <div className="text-center py-8 text-gray-400">
                                                <p className="text-sm">No completed orders</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Order Details Modal */}
                            {showOrderDetails && selectedOrder && (
                                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowOrderDetails(false)}>
                                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                                        <div className="sticky top-0 bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4 flex items-center justify-between">
                                            <h2 className="text-xl font-bold text-white">Order Details</h2>
                                            <button
                                                onClick={() => setShowOrderDetails(false)}
                                                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
                                            >
                                                <X className="w-5 h-5 text-white" />
                                            </button>
                                        </div>

                                        <div className="p-6 space-y-6">
                                            {/* Order Info */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-500">Order ID</p>
                                                    <p className="font-bold text-gray-900">#{selectedOrder.id}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Table</p>
                                                    <p className="font-bold text-gray-900">{selectedOrder.tableId}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Status</p>
                                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${selectedOrder.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                        selectedOrder.status === 'PREPARING' ? 'bg-blue-100 text-blue-700' :
                                                            selectedOrder.status === 'READY' ? 'bg-purple-100 text-purple-700' :
                                                                'bg-green-100 text-green-700'
                                                        }`}>
                                                        {selectedOrder.status}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Created At</p>
                                                    <p className="font-bold text-gray-900">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                                                </div>
                                            </div>

                                            {/* Items */}
                                            <div>
                                                <h3 className="font-bold text-gray-900 mb-3">Items</h3>
                                                <div className="space-y-2">
                                                    {selectedOrder.items?.map((item: any, idx: number) => (
                                                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                            <div className="flex items-center gap-3">
                                                                <span className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-700 font-bold text-sm">
                                                                    {item.quantity}x
                                                                </span>
                                                                <span className="font-medium text-gray-900">{item.name}</span>
                                                            </div>
                                                            <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Total */}
                                            <div className="border-t border-gray-200 pt-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-lg font-bold text-gray-900">Total Amount</span>
                                                    <span className="text-2xl font-bold text-teal-600">₹{selectedOrder.totalAmount}</span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => printKOT(selectedOrder)}
                                                    className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
                                                >
                                                    <Printer className="w-5 h-5" /> Print KOT
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        cancelOrder(selectedOrder.id);
                                                        setShowOrderDetails(false);
                                                    }}
                                                    className="flex-1 px-4 py-3 bg-red-100 hover:bg-red-200 text-red-700 font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
                                                >
                                                    <X className="w-5 h-5" /> Cancel Order
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Coming Soon for other sections */}
                    {activeTab !== 'dishes' && activeTab !== 'dashboard' && activeTab !== 'orders' && (
                        <div className="flex items-center justify-center h-96">
                            <div className="text-center">
                                <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-200">
                                    <Grid3x3 className="w-12 h-12 text-gray-300" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-700 mb-2">Coming Soon</h3>
                                <p className="text-gray-500">This section is under development</p>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
