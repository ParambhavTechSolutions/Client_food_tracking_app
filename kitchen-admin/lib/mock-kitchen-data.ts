import { Order, MenuItem } from './types';
import { MOCK_MENU } from './mock-data';

// Helper to generate random orders
const tableNumbers = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'Takeaway', 'Delivery'];
const customerNames = [
    'John Smith', 'Sarah Johnson', 'Mike Chen', 'Emily Davis',
    'David Wilson', 'Lisa Anderson', 'James Brown', 'Maria Garcia',
    'Robert Taylor', 'Jennifer Martinez', 'William Lee', 'Jessica White'
];

let orderCounter = 104; // Start after existing mock orders

export function generateRandomOrder(): Order {
    const numItems = Math.floor(Math.random() * 3) + 1; // 1-3 items
    const selectedItems: any[] = [];

    for (let i = 0; i < numItems; i++) {
        const randomItem = MOCK_MENU[Math.floor(Math.random() * MOCK_MENU.length)];
        const quantity = Math.floor(Math.random() * 2) + 1; // 1-2 quantity

        selectedItems.push({
            menuItem: randomItem,
            quantity,
            specialInstructions: Math.random() > 0.7 ? 'Extra spicy' : undefined
        });
    }

    const totalAmount = selectedItems.reduce((sum, item) =>
        sum + (item.menuItem.price * item.quantity), 0
    );

    const newOrder: Order = {
        id: `ord_${orderCounter++}`,
        storeId: 'store_123',
        tableId: tableNumbers[Math.floor(Math.random() * tableNumbers.length)],
        status: 'PAID',
        items: selectedItems,
        totalAmount,
        createdAt: new Date(),
    };

    return newOrder;
}

export const MOCK_KITCHEN_ORDERS: Order[] = [
    {
        id: 'ord_101',
        storeId: 'store_123',
        tableId: 'T1',
        status: 'PAID',
        totalAmount: 700,
        createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
        items: [
            { menuItem: MOCK_MENU[0], quantity: 2 },
        ],
    },
    {
        id: 'ord_102',
        storeId: 'store_123',
        tableId: 'T3',
        status: 'PREPARING',
        totalAmount: 320,
        createdAt: new Date(Date.now() - 1000 * 60 * 12), // 12 mins ago
        items: [
            { menuItem: MOCK_MENU[1], quantity: 1, specialInstructions: 'No onions' },
        ],
    },
    {
        id: 'ord_103',
        storeId: 'store_123',
        tableId: 'Takeaway',
        status: 'READY',
        totalAmount: 180,
        createdAt: new Date(Date.now() - 1000 * 60 * 20), // 20 mins ago
        items: [
            { menuItem: MOCK_MENU[3], quantity: 1 },
        ],
    },
];
