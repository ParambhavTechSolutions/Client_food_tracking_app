'use client';

import { useState, useMemo, useEffect } from 'react';
import { MOCK_CATEGORIES, MOCK_MENU, MOCK_STORE } from '@/lib/mock-data';
import { Minus, Plus, ShoppingCart, Search, Heart, Star, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import { cn } from '@/lib/utils';

export default function MenuPage({ params }: { params: { storeId: string; tableId: string } }) {
    const router = useRouter();
    const { items: cart, updateQuantity, itemCount: cartTotalItems, cartTotal: cartTotalPrice } = useCart();
    const [activeCategory, setActiveCategory] = useState(MOCK_CATEGORIES[0].id);
    const [searchQuery, setSearchQuery] = useState('');

    // Filter menu based on search
    const filteredMenu = useMemo(() => {
        if (!searchQuery) return MOCK_MENU;
        return MOCK_MENU.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    // Group by category
    const menuByCategory = useMemo(() => {
        return MOCK_CATEGORIES.map(cat => ({
            ...cat,
            items: filteredMenu.filter((item) => item.categoryId === cat.id)
        })).filter(group => group.items.length > 0);
    }, [filteredMenu]);

    // Featured items (just picking the first 3 for demo)
    const featuredItems = MOCK_MENU.slice(0, 3);

    // Redirect to mobile flow first (unless coming from login)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const fromLogin = urlParams.get('from');

            if (!fromLogin) {
                router.push('/mobile');
            }
        }
    }, [router]);

    return (
        <div className="min-h-screen bg-[#F6F6F6] pb-32 font-sans text-slate-800">
            {/* Custom Green Theme Scope */}
            <style jsx global>{`
                :root {
                    --primary: 142 76% 36%; /* Green-600 */
                }
            `}</style>

            {/* Header */}
            <header className="sticky top-0 z-20 bg-[#F6F6F6]/90 backdrop-blur-md pt-4 pb-2 px-6">
                <div className="flex items-center justify-between mb-6">
                    <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <ChevronRight className="w-5 h-5 rotate-180" />
                    </button>
                    <h1 className="text-lg font-bold">Menu</h1>
                    <div className="relative">
                        <button
                            onClick={() => router.push(`/menu/${params.storeId}/${params.tableId}/cart`)}
                            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm relative"
                        >
                            <ShoppingCart className="w-5 h-5 text-slate-700" />
                            {cartTotalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                    {cartTotalItems}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="relative mb-4">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search for food..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-none shadow-sm text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 outline-none"
                    />
                </div>
            </header>

            <main className="px-6 space-y-8">
                {/* Special For You (Featured) */}
                {!searchQuery && (
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold">Special For You</h2>
                            <button className="text-xs text-green-600 font-semibold">See All</button>
                        </div>
                        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6">
                            {featuredItems.map(item => (
                                <div key={item.id} className="min-w-[280px] bg-green-600 rounded-3xl p-5 relative overflow-hidden shadow-lg shadow-green-200">
                                    <div className="relative z-10 w-2/3">
                                        <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-white text-xs font-medium mb-3">
                                            Promo
                                        </span>
                                        <h3 className="text-white text-xl font-bold leading-tight mb-2">{item.name}</h3>
                                        <p className="text-green-100 text-sm mb-4">Best seller of the week</p>
                                        <button
                                            onClick={() => updateQuantity(item.id, 1)}
                                            className="bg-white text-green-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm active:scale-95 transition-transform"
                                        >
                                            Buy Now
                                        </button>
                                    </div>
                                    <div className="absolute -right-6 -bottom-6 w-40 h-40">
                                        {/* Fallback pattern if no image */}
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} className="w-full h-full object-cover rounded-full border-4 border-white/10" alt="" />
                                        ) : (
                                            <div className="w-full h-full bg-white/10 rounded-full flex items-center justify-center">
                                                <Star className="w-12 h-12 text-white/50" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Categories & Grid */}
                <section>
                    {/* Category Tabs */}
                    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-6 sticky top-[140px] z-10 bg-[#F6F6F6] -mx-6 px-6 pt-2">
                        {MOCK_CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    setActiveCategory(cat.id);
                                    document.getElementById(cat.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }}
                                className={cn(
                                    "whitespace-nowrap px-6 py-2.5 rounded-2xl text-sm font-semibold transition-all shadow-sm border",
                                    activeCategory === cat.id
                                        ? "bg-green-600 text-white border-transparent shadow-green-200"
                                        : "bg-white text-gray-500 border-transparent hover:bg-gray-50"
                                )}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Food Grid */}
                    <div className="space-y-8">
                        {menuByCategory.map((group) => (
                            <div key={group.id} id={group.id} className="scroll-mt-40">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    {group.name}
                                    <span className="text-xs font-normal text-gray-400 bg-white px-2 py-0.5 rounded-full">
                                        {group.items.length}
                                    </span>
                                </h3>

                                <div className="grid grid-cols-2 gap-4">
                                    {group.items.map((item) => (
                                        <div key={item.id} className="bg-white p-3 rounded-[20px] shadow-sm hover:shadow-md transition-shadow relative group">
                                            {/* Favorite Button */}
                                            <button className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                                                <Heart className="w-4 h-4" />
                                            </button>

                                            {/* Image */}
                                            <div className="aspect-square w-full rounded-2xl bg-gray-100 mb-3 overflow-hidden relative">
                                                {item.imageUrl ? (
                                                    <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.name} />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <span className="text-4xl">🥘</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div>
                                                <h4 className="font-bold text-gray-800 text-sm mb-1 leading-snug line-clamp-1">{item.name}</h4>
                                                <div className="flex items-center gap-1 mb-2">
                                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                    <span className="text-xs font-bold text-gray-700">4.8</span>
                                                    <span className="text-[10px] text-gray-400">(1.2k)</span>
                                                </div>

                                                <div className="flex items-end justify-between">
                                                    <div>
                                                        <span className="text-[10px] text-gray-400 block -mb-0.5">Price</span>
                                                        <span className="text-base font-bold text-green-600">₹{item.price}</span>
                                                    </div>

                                                    {/* Add Button */}
                                                    {(cart[item.id] || 0) > 0 ? (
                                                        <div className="flex flex-col items-center gap-1 bg-green-50 rounded-lg p-1">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, 1)}
                                                                className="w-6 h-6 bg-green-600 rounded-lg flex items-center justify-center text-white active:scale-90 transition-transform"
                                                            >
                                                                <Plus className="w-3 h-3" />
                                                            </button>
                                                            <span className="text-xs font-bold text-green-700">{cart[item.id]}</span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, -1)}
                                                                className="w-6 h-6 bg-white border border-green-200 rounded-lg flex items-center justify-center text-green-600 active:scale-90 transition-transform"
                                                            >
                                                                <Minus className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => updateQuantity(item.id, 1)}
                                                            className="w-8 h-8 bg-green-600 rounded-xl flex items-center justify-center text-white shadow-green-200 shadow-lg active:scale-90 transition-transform"
                                                        >
                                                            <Plus className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Bottom Floating Bar */}
            {cartTotalItems > 0 && (
                <div className="fixed bottom-6 left-6 right-6 z-30 animate-in slide-in-from-bottom-6">
                    <button
                        onClick={() => router.push(`/menu/${params.storeId}/${params.tableId}/cart`)}
                        className="w-full bg-[#181E29] text-white rounded-[24px] p-4 shadow-xl shadow-gray-300 flex items-center justify-between hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <span className="font-bold text-sm">{cartTotalItems}</span>
                            </div>
                            <div className="text-left">
                                <p className="text-xs text-gray-400 font-medium">Total</p>
                                <p className="text-lg font-bold">₹{cartTotalPrice}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 pr-2">
                            <span className="font-semibold text-sm">Cart</span>
                            <ChevronRight className="w-4 h-4" />
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
}
