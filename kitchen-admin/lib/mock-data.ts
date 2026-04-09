import { MenuCategory, MenuItem, Store } from './types';

export const MOCK_STORE: Store = {
    id: 'store_123',
    name: 'Cloud Kitchen',
    slug: 'cloud-kitchen-blr',
    currency: 'INR',
    theme: {
        primaryColor: '#16A34A', // Green-600
    },
};

export const MOCK_CATEGORIES: MenuCategory[] = [
    { id: 'cat_1', storeId: 'store_123', name: 'High Protein Bowls', sortOrder: 1 },
    { id: 'cat_2', storeId: 'store_123', name: 'Fresh Salads', sortOrder: 2 },
    { id: 'cat_3', storeId: 'store_123', name: 'Keto Specials', sortOrder: 3 },
    { id: 'cat_4', storeId: 'store_123', name: 'Healthy Wraps', sortOrder: 4 },
    { id: 'cat_5', storeId: 'store_123', name: 'Smoothies & Juices', sortOrder: 5 },
];

export const MOCK_MENU: MenuItem[] = [
    // --- High Protein Bowls ---
    {
        id: 'item_1',
        storeId: 'store_123',
        name: 'Grilled Chicken Quinoa Bowl',
        description: '40g Protein. Grilled chicken breast served with quinoa, roasted veggies, sweet potato, and tahini dressing.',
        price: 350,
        categoryId: 'cat_1',
        isAvailable: true,
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'item_2',
        storeId: 'store_123',
        name: 'Tofu Buddha Bowl',
        description: 'Vegan goodness. Marinated tofu, brown rice, avocado, purple cabbage, edamame, and sesame seeds.',
        price: 320,
        categoryId: 'cat_1',
        isAvailable: true,
        imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'item_3',
        storeId: 'store_123',
        name: 'Salmon Poke Bowl',
        description: 'Fresh salmon cubes, sushi rice, cucumber, mango, seaweed salad, and spicy mayo.',
        price: 450,
        categoryId: 'cat_1',
        isAvailable: true,
        imageUrl: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'item_4',
        storeId: 'store_123',
        name: 'Teriyaki Beef Bowl',
        description: 'Lean beef strips in low-sodium teriyaki glaze, broccoli, carrots, and jasmine rice.',
        price: 380,
        categoryId: 'cat_1',
        isAvailable: true,
        imageUrl: 'https://images.unsplash.com/photo-1627909384950-8b1b22e1189c?auto=format&fit=crop&w=800&q=80',
    },

    // --- Fresh Salads ---
    {
        id: 'item_5',
        storeId: 'store_123',
        name: 'Mediterranean Greek Salad',
        description: 'Crisp romaine, feta cheese, kalamata olives, cucumber, cherry tomatoes, and oregano vinaigrette.',
        price: 280,
        categoryId: 'cat_2',
        isAvailable: true,
        imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'item_6',
        storeId: 'store_123',
        name: 'Asian Sesame Chicken Salad',
        description: 'Shredded cabbage mix, grilled chicken, mandarin oranges, wonton strips, and sesame ginger dressing.',
        price: 310,
        categoryId: 'cat_2',
        isAvailable: true,
        imageUrl: 'https://images.unsplash.com/photo-1640719028782-4f5145c3b999?auto=format&fit=crop&w=800&q=80',
    },

    // --- Keto Specials ---
    {
        id: 'item_7',
        storeId: 'store_123',
        name: 'Keto Zucchini Pasta',
        description: 'Zoodles tossed in creamy garlic parmesan sauce with grilled shrimp and cherry tomatoes.',
        price: 340,
        categoryId: 'cat_3',
        isAvailable: true,
        imageUrl: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'item_8',
        storeId: 'store_123',
        name: 'Avocado & Egg Plate',
        description: 'Two poached eggs, sliced avocado, bacon strips, and keto seed crackers.',
        price: 260,
        categoryId: 'cat_3',
        isAvailable: true,
        imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414395d8?auto=format&fit=crop&w=800&q=80',
    },

    // --- Healthy Wraps ---
    {
        id: 'item_9',
        storeId: 'store_123',
        name: 'Spicy Hummus Wrap',
        description: 'Whole wheat tortilla, red pepper hummus, spinach, roasted zucchini, and feta cheese.',
        price: 220,
        categoryId: 'cat_4',
        isAvailable: true,
        imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'item_10',
        storeId: 'store_123',
        name: 'Chicken Caesar Wrap',
        description: 'Grilled chicken, parmesan, romaine lettuce, and light caesar dressing in a spinach wrap.',
        price: 240,
        categoryId: 'cat_4',
        isAvailable: true,
        imageUrl: 'https://images.unsplash.com/photo-1584946332158-b64fd450d032?auto=format&fit=crop&w=800&q=80',
    },

    // --- Smoothies ---
    {
        id: 'item_11',
        storeId: 'store_123',
        name: 'Berry Blast Protein Shake',
        description: 'Whey protein, mixed berries, almond milk, banana, and chia seeds.',
        price: 180,
        categoryId: 'cat_5',
        isAvailable: true,
        imageUrl: 'https://images.unsplash.com/photo-1577805947697-89e4387d37ad?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'item_12',
        storeId: 'store_123',
        name: 'Green Detox Juice',
        description: 'Spinach, cucumber, green apple, ginger, lemon, and celery. sugar-free.',
        price: 160,
        categoryId: 'cat_5',
        isAvailable: true,
        imageUrl: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'item_13',
        storeId: 'store_123',
        name: 'Tropical Paradise',
        description: 'Mango, pineapple, coconut water, mint, and passion fruit. Refreshing!',
        price: 170,
        categoryId: 'cat_5',
        isAvailable: true,
        imageUrl: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=800&q=80',
    }
];
