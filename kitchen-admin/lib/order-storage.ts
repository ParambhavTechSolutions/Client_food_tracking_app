import { Order, OrderStatus } from './types';
import { MOCK_KITCHEN_ORDERS } from './mock-kitchen-data';

const STORAGE_KEY = 'cloud_kitchen_orders';

// Initialize storage if empty
export const initializeOrders = (): Order[] => {
    if (typeof window === 'undefined') return MOCK_KITCHEN_ORDERS;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_KITCHEN_ORDERS));
        return MOCK_KITCHEN_ORDERS;
    }
    try {
        // Parse dates back to Date objects
        return JSON.parse(stored, (key, value) => {
            if (key === 'createdAt') return new Date(value);
            return value;
        });
    } catch (e) {
        return MOCK_KITCHEN_ORDERS;
    }
};

export const getOrders = (): Order[] => {
    return initializeOrders();
};

export const updateOrder = (updatedOrder: Order) => {
    const orders = getOrders();
    const index = orders.findIndex(o => o.id === updatedOrder.id);
    if (index !== -1) {
        orders[index] = updatedOrder;
    } else {
        orders.unshift(updatedOrder);
    }

    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
        // Trigger a custom event so other components know data changed
        window.dispatchEvent(new Event('ordersUpdated'));
    }
    return orders;
};

export const addOrder = (newOrder: Order) => {
    const orders = getOrders();
    orders.unshift(newOrder); // Add to top
    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
        window.dispatchEvent(new Event('ordersUpdated'));
    }
    return orders;
};
