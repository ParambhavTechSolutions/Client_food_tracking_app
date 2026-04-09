'use client';

import { useCart } from '@/app/context/CartContext';
import { ArrowLeft, CreditCard, Minus, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CartPage({ params }: { params: { storeId: string; tableId: string } }) {
    const router = useRouter();
    const { getCartDetails, updateQuantity, cartTotal, placeOrder, itemCount } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'phonepe' | 'razorpay' | null>(null);

    const cartItems = getCartDetails();

    const handleCheckout = async () => {
        if (!paymentMethod) return;
        setIsProcessing(true);
        await placeOrder();
        setIsProcessing(false);
        router.push(`/menu/${params.storeId}/${params.tableId}/order-success`);
    };

    if (itemCount === 0) {
        return (
            <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
                <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center mb-4 text-neutral-400">
                    <Trash2 className="w-8 h-8" />
                </div>
                <h2 className="text-lg font-semibold text-neutral-900">Your cart is empty</h2>
                <p className="text-neutral-500 text-sm mb-6">Looks like you haven't added anything yet.</p>
                <button
                    onClick={() => router.back()}
                    className="text-orange-600 font-medium hover:underline"
                >
                    Go back to Menu
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 pb-32 font-sans text-neutral-900">
            {/* Header */}
            <header className="bg-white border-b border-neutral-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 text-neutral-600 hover:bg-neutral-50 rounded-full"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-lg font-bold">Your Order</h1>
            </header>

            <main className="p-4 space-y-6">
                {/* Order Items */}
                <section className="space-y-4">
                    {cartItems.map(({ item, quantity }) => (
                        <div key={item.id} className="flex gap-4 bg-white p-3 rounded-xl border border-neutral-100 shadow-sm">
                            <div className="w-20 h-20 bg-neutral-100 rounded-lg overflow-hidden shrink-0">
                                {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />}
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-medium text-neutral-900 line-clamp-2 text-sm">{item.name}</h3>
                                    <span className="font-semibold text-neutral-900">₹{item.price * quantity}</span>
                                </div>

                                <div className="flex items-center justify-between mt-2">
                                    <p className="text-xs text-neutral-400">₹{item.price} / item</p>
                                    <div className="flex items-center bg-neutral-50 border border-neutral-200 rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => updateQuantity(item.id, -1)}
                                            className="p-1 px-2.5 text-neutral-600 hover:bg-neutral-200 active:bg-neutral-300 transition-colors"
                                        >
                                            <Minus className="w-3.5 h-3.5" />
                                        </button>
                                        <span className="text-sm font-semibold text-neutral-900 px-1 min-w-[1.5rem] text-center">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item.id, 1)}
                                            className="p-1 px-2.5 text-neutral-600 hover:bg-neutral-200 active:bg-neutral-300 transition-colors"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>

                {/* Bill Details */}
                <section className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm space-y-3">
                    <h3 className="font-semibold text-sm text-neutral-900">Bill Details</h3>
                    <div className="flex justify-between text-sm text-neutral-500">
                        <span>Item Total</span>
                        <span>₹{cartTotal}</span>
                    </div>
                    <div className="flex justify-between text-sm text-neutral-500">
                        <span>Taxes & Charges (5%)</span>
                        <span>₹{Math.round(cartTotal * 0.05)}</span>
                    </div>
                    <div className="border-t border-dashed border-neutral-200 pt-3 flex justify-between font-bold text-neutral-900">
                        <span>To Pay</span>
                        <span>₹{Math.round(cartTotal * 1.05)}</span>
                    </div>
                </section>

                {/* Payment Method */}
                <section className="space-y-3">
                    <h3 className="font-semibold text-sm text-neutral-900 ml-1">Select Payment Method</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setPaymentMethod('phonepe')}
                            className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'phonepe'
                                ? 'border-purple-500 bg-purple-50 text-purple-700'
                                : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                                }`}
                        >
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                <span className="font-bold text-purple-600 text-xs">Ph</span>
                            </div>
                            <span className="text-sm font-medium">PhonePe</span>
                            {paymentMethod === 'phonepe' && <CheckCircle2 className="w-4 h-4 text-purple-500 absolute top-2 right-2" />}
                        </button>

                        <button
                            onClick={() => setPaymentMethod('razorpay')}
                            className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'razorpay'
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                                }`}
                        >
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <CreditCard className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium">Card / UPI</span>
                            {paymentMethod === 'razorpay' && <CheckCircle2 className="w-4 h-4 text-blue-500 absolute top-2 right-2" />}
                        </button>
                    </div>
                </section>
            </main>

            {/* Footer CTA */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-100 p-4 safe-area-pb">
                <button
                    disabled={!paymentMethod || isProcessing}
                    onClick={handleCheckout}
                    className="w-full bg-neutral-900 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-lg shadow-neutral-900/10 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
                >
                    {isProcessing ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <span>Pay ₹{Math.round(cartTotal * 1.05)}</span>
                            <ArrowLeft className="w-4 h-4 rotate-180" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
