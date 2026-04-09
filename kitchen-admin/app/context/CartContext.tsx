'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { MOCK_MENU } from '@/lib/mock-data';
import { MenuItem } from '@/lib/types';

export type CartItem = {
    item: MenuItem;
    quantity: number;
};

type CartContextType = {
    items: { [itemId: string]: number };
    addToCart: (itemId: string) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, delta: number) => void;
    cartTotal: number;
    itemCount: number;
    getCartDetails: () => CartItem[];
    placeOrder: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<{ [itemId: string]: number }>({});

    const updateQuantity = (itemId: string, delta: number) => {
        setItems((prev) => {
            const current = prev[itemId] || 0;
            const next = Math.max(0, current + delta);
            if (next === 0) {
                const { [itemId]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [itemId]: next };
        });
    };

    const addToCart = (itemId: string) => updateQuantity(itemId, 1);
    const removeFromCart = (itemId: string) => updateQuantity(itemId, -1);

    const itemCount = Object.values(items).reduce((a, b) => a + b, 0);

    const cartTotal = Object.entries(items).reduce((total, [itemId, qty]) => {
        const item = MOCK_MENU.find((i) => i.id === itemId);
        return total + (item ? item.price * qty : 0);
    }, 0);

    const getCartDetails = () => {
        return Object.entries(items)
            .map(([itemId, qty]) => {
                const item = MOCK_MENU.find((i) => i.id === itemId);
                return item ? { item, quantity: qty } : null;
            })
            .filter(Boolean) as CartItem[];
    };

    const placeOrder = async () => {
        // Mock API call
        return new Promise<void>((resolve) => setTimeout(() => resolve(), 1500));
    };

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            cartTotal,
            itemCount,
            getCartDetails,
            placeOrder
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
