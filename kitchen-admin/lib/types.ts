export type Store = {
    id: string;
    name: string;
    slug: string; // for url: /menu/[slug]
    currency: string;
    theme?: {
        primaryColor: string;
    };
};

export type MenuItem = {
    id: string;
    storeId: string;
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
    categoryId: string;
    isAvailable: boolean;
};

export type MenuCategory = {
    id: string;
    storeId: string;
    name: string;
    sortOrder: number;
};

export type CartItem = {
    menuItem: MenuItem;
    quantity: number;
    specialInstructions?: string;
};

export type OrderStatus = 'PENDING' | 'PAID' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';

export type Order = {
    id: string;
    storeId: string;
    tableId: string;
    status: OrderStatus;
    items: CartItem[];
    totalAmount: number;
    createdAt: Date;
    paymentId?: string;
};
