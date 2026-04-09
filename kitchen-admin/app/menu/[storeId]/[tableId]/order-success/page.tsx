'use client';

import { CheckCircle2, ChefHat, UtensilsCrossed } from 'lucide-react';
import Link from 'next/link';

export default function OrderSuccessPage({ params }: { params: { storeId: string; tableId: string } }) {
    const orderId = '#ORD-' + Math.floor(Math.random() * 10000);

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>

            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Order Confirmed!</h1>
            <p className="text-neutral-500 max-w-xs mx-auto mb-8">
                Your order <span className="font-mono text-neutral-900 font-medium">{orderId}</span> has been sent to the kitchen.
            </p>

            <div className="w-full max-w-sm bg-neutral-50 rounded-2xl p-6 border border-neutral-100 mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <ChefHat className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-semibold text-neutral-900">Preparing</h3>
                        <p className="text-xs text-neutral-500">Estimated time: 15-20 mins</p>
                    </div>
                </div>

                <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 w-1/3 animate-pulse" />
                </div>
            </div>

            <Link
                href={`/menu/${params.storeId}/${params.tableId}`}
                className="w-full max-w-xs bg-neutral-900 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-neutral-900/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
                <UtensilsCrossed className="w-4 h-4" />
                Order More Items
            </Link>
        </div>
    );
}
