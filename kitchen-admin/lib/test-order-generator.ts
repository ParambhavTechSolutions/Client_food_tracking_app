// Test Order Generator - Automatically creates orders every 10 seconds for testing

import { MOCK_MENU } from './mock-data';

const tables = ['T1', 'T2', 'T3', 'T4', 'T5', 'Takeaway'];
const statuses = ['PENDING', 'PREPARING', 'READY'];

// Generate a random order
export const generateTestOrder = () => {
    const randomItems = MOCK_MENU
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 3) + 1)
        .map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: Math.floor(Math.random() * 3) + 1
        }));

    const totalAmount = randomItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const randomTable = tables[Math.floor(Math.random() * tables.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    const order = {
        id: `rd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        tableId: randomTable,
        items: randomItems,
        totalAmount,
        status: randomStatus,
        createdAt: new Date().toISOString()
    };

    return order;
};

// Add order to localStorage
export const addTestOrder = () => {
    const order = generateTestOrder();
    const existingOrders = JSON.parse(localStorage.getItem('cloud_kitchen_orders') || '[]');
    const updatedOrders = [...existingOrders, order];
    localStorage.setItem('cloud_kitchen_orders', JSON.stringify(updatedOrders));
    window.dispatchEvent(new Event('ordersUpdated'));
    console.log('✅ Test order created:', order.id, '-', order.tableId, '-', order.status);
    return order;
};

// Start auto-generating orders
export const startOrderGenerator = (intervalSeconds: number = 10) => {
    console.log(`🚀 Starting test order generator (every ${intervalSeconds} seconds)...`);

    const intervalId = setInterval(() => {
        addTestOrder();
    }, intervalSeconds * 1000);

    // Return stop function
    return () => {
        clearInterval(intervalId);
        console.log('🛑 Test order generator stopped');
    };
};

// Clear all test orders
export const clearAllOrders = () => {
    localStorage.setItem('cloud_kitchen_orders', JSON.stringify([]));
    window.dispatchEvent(new Event('ordersUpdated'));
    console.log('🗑️ All orders cleared');
};
