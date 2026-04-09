'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Mail, Lock, Eye, EyeOff, Facebook, Twitter, Instagram } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming you have a utils file for classnames

export default function MobileAppFlow() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<'splash' | 'onboarding' | 'login' | 'signup' | 'verification'>('splash');
    const [showPassword, setShowPassword] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '']);

    // Auto-advance splash screen
    useEffect(() => {
        if (currentStep === 'splash') {
            const timer = setTimeout(() => {
                setCurrentStep('onboarding');
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [currentStep]);

    // Handle OTP Input
    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 3) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    // --- SPLASH SCREEN ---
    if (currentStep === 'splash') {
        return (
            <div className="min-h-screen bg-[#1F8548] flex flex-col items-center justify-center overflow-hidden relative">
                <style jsx>{`
                    @keyframes logo-pop {
                        0% { transform: scale(0.5); opacity: 0; }
                        50% { transform: scale(1.1); }
                        100% { transform: scale(1); opacity: 1; }
                    }
                    @keyframes text-slide-up {
                        0% { transform: translateY(20px); opacity: 0; }
                        100% { transform: translateY(0); opacity: 1; }
                    }
                    @keyframes steam-rise {
                        0% { transform: translateY(0) scale(1); opacity: 0.8; }
                        100% { transform: translateY(-10px) scale(1.5); opacity: 0; }
                    }
                    @keyframes load-bar {
                        0% { width: 0%; }
                        100% { width: 100%; }
                    }
                `}</style>

                <div className="text-center relative z-10">
                    <div
                        className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md shadow-lg shadow-green-900/20"
                        style={{ animation: 'logo-pop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' }}
                    >
                        <div className="relative">
                            {/* Steam animation */}
                            <div className="absolute -top-6 left-2 text-white/80" style={{ animation: 'steam-rise 2s infinite ease-out' }}>sss</div>
                            <div className="absolute -top-5 left-6 text-white/60" style={{ animation: 'steam-rise 2s infinite ease-out 0.5s' }}>sss</div>
                            <span className="text-5xl drop-shadow-md">🍜</span>
                        </div>
                    </div>

                    <h1
                        className="text-4xl font-bold text-white tracking-wide drop-shadow-sm"
                        style={{ animation: 'text-slide-up 0.8s ease-out 0.3s forwards', opacity: 0 }}
                    >
                        Cloud Kitchen
                    </h1>
                </div>

                {/* Loading Bar at Bottom */}
                <div className="absolute bottom-12 w-48 h-1.5 bg-green-800/30 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-white/90 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                        style={{ animation: 'load-bar 2.5s ease-in-out forwards' }}
                    />
                </div>
            </div>
        );
    }

    // --- ONBOARDING SCREEN ---
    if (currentStep === 'onboarding') {
        return (
            <div className="min-h-screen bg-white flex flex-col font-sans">
                {/* Image Area */}
                <div className="flex-1 flex items-center justify-center p-8 bg-green-50/50">
                    <div className="relative w-64 h-64 bg-green-100 rounded-full flex items-center justify-center">
                        {/* Circular decoration */}
                        <div className="absolute inset-0 border-2 border-dashed border-green-300 rounded-full animate-spin-slow"></div>

                        <div className="text-8xl animate-bounce-gentle">🍽️</div>

                        {/* Floating mini icons */}
                        <div className="absolute -top-4 right-4 bg-white p-2 rounded-full shadow-lg text-xl">🥑</div>
                        <div className="absolute bottom-4 -left-4 bg-white p-2 rounded-full shadow-lg text-xl">🍱</div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="bg-white rounded-t-3xl -mt-6 p-8 pb-12 flex flex-col items-center text-center shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                    <h2 className="text-2xl font-bold text-slate-800 mb-3">
                        Effortless dining. Perfectly served
                    </h2>
                    <p className="text-slate-500 mb-8 max-w-xs leading-relaxed">
                        Enjoy restaurant-quality meals prepared fresh and served right to your table
                    </p>

                    {/* Single Dot */}
                    <div className="flex gap-2 mb-8">
                        <div className="h-2 w-6 rounded-full bg-[#1F8548]" />
                    </div>

                    {/* Buttons */}
                    <div className="w-full space-y-3">
                        <button
                            onClick={() => setCurrentStep('login')}
                            className="w-full bg-[#1F8548] text-white py-4 rounded-xl font-bold shadow-lg shadow-green-200 active:scale-95 transition-transform"
                        >
                            Get Started
                        </button>
                        <button
                            onClick={() => setCurrentStep('login')}
                            className="w-full py-4 rounded-xl font-medium text-slate-500 hover:bg-slate-50 transition-colors"
                        >
                            Sign in
                        </button>
                    </div>

                    <div className="mt-6 w-32 h-1 bg-slate-100 rounded-full"></div>
                </div>
            </div>
        );
    }

    // --- LOGIN SCREEN ---
    if (currentStep === 'login') {
        return (
            <div className="min-h-screen bg-white p-6 font-sans flex flex-col">
                <div className="pt-2 mb-8">
                    <button
                        onClick={() => setCurrentStep('onboarding')}
                        className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-700 font-bold hover:bg-slate-100 transition-colors"
                    >
                        ←
                    </button>
                </div>

                <div className="mb-8 pl-1">
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">Welcome Back 👋</h1>
                    <p className="text-slate-500">Sign to your account</p>
                </div>

                <div className="space-y-4 mb-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 ml-1">Email</label>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="w-full bg-slate-50/50 border border-transparent focus:border-[#1F8548] focus:bg-white rounded-xl px-4 py-3.5 outline-none transition-all placeholder:text-slate-400"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 ml-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Your password"
                                className="w-full bg-slate-50/50 border border-transparent focus:border-[#1F8548] focus:bg-white rounded-xl px-4 py-3.5 outline-none transition-all placeholder:text-slate-400"
                            />
                            <button
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                <button className="text-[#1F8548] text-sm font-bold mb-8 text-left pl-1 hover:underline">
                    Forgot Password?
                </button>

                <button
                    onClick={() => {
                        localStorage.setItem('mobile_onboarding_complete', 'true');
                        router.push('/menu/store_123/1?from=login');
                    }}
                    className="w-full bg-[#1F8548] text-white py-4 rounded-xl font-bold shadow-lg shadow-green-200 active:scale-[0.98] transition-all mb-6"
                >
                    Login
                </button>

                <div className="text-center text-slate-500 text-sm mb-6">
                    Don&apos;t have an account? <button onClick={() => setCurrentStep('signup')} className="text-[#1F8548] font-bold hover:underline">Sign Up</button>
                </div>

                <div className="flex items-center gap-4 mb-6">
                    <div className="h-px bg-slate-200 flex-1"></div>
                    <span className="text-slate-400 text-xs font-medium">Or with</span>
                    <div className="h-px bg-slate-200 flex-1"></div>
                </div>

                <div className="space-y-3">
                    <button className="w-full border border-slate-200 py-3.5 rounded-xl flex items-center justify-center gap-3 font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                        <span className="scale-110">G</span> Sign in with Google
                    </button>
                    <button className="w-full border border-slate-200 py-3.5 rounded-xl flex items-center justify-center gap-3 font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                        <span className="scale-110"></span> Sign in with Apple
                    </button>
                </div>
            </div>
        );
    }

    // --- SIGN UP SCREEN ---
    if (currentStep === 'signup') {
        return (
            <div className="min-h-screen bg-white p-6 font-sans flex flex-col">
                <div className="pt-2 mb-6">
                    <button
                        onClick={() => setCurrentStep('login')}
                        className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-700 font-bold hover:bg-slate-100 transition-colors"
                    >
                        ←
                    </button>
                </div>

                <div className="mb-8 pl-1">
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">Sign Up</h1>
                    <p className="text-slate-500">Create account and choose favorite menu</p>
                </div>

                <div className="space-y-4 mb-8">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 ml-1">Name</label>
                        <input
                            type="text"
                            placeholder="Your name"
                            className="w-full bg-slate-50/50 border border-transparent focus:border-[#1F8548] focus:bg-white rounded-xl px-4 py-3.5 outline-none transition-all placeholder:text-slate-400"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 ml-1">Email</label>
                        <input
                            type="email"
                            placeholder="Your email"
                            className="w-full bg-slate-50/50 border border-transparent focus:border-[#1F8548] focus:bg-white rounded-xl px-4 py-3.5 outline-none transition-all placeholder:text-slate-400"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 ml-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Your password"
                                className="w-full bg-slate-50/50 border border-transparent focus:border-[#1F8548] focus:bg-white rounded-xl px-4 py-3.5 outline-none transition-all placeholder:text-slate-400"
                            />
                            <button
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setCurrentStep('verification')}
                    className="w-full bg-[#1F8548] text-white py-4 rounded-xl font-bold shadow-lg shadow-green-200 active:scale-[0.98] transition-all mb-6"
                >
                    Register
                </button>

                <div className="text-center text-slate-500 text-sm">
                    Have an account? <button onClick={() => setCurrentStep('login')} className="text-[#1F8548] font-bold hover:underline">Sign In</button>
                </div>

                <div className="mt-auto text-center px-8">
                    <p className="text-[10px] text-slate-400 leading-normal">
                        By clicking Register, you agree to our <span className="text-[#1F8548]">Terms and Data Policy.</span>
                    </p>
                </div>
            </div>
        );
    }

    // Handle Virtual Keypad Input
    const handleKeypadPress = (key: string) => {
        const newOtp = [...otp];
        const firstEmptyIndex = newOtp.findIndex(val => val === '');
        const lastFilledIndex = newOtp.findLastIndex(val => val !== '');

        if (key === 'backspace') {
            if (lastFilledIndex !== -1) {
                newOtp[lastFilledIndex] = '';
                setOtp(newOtp);
            }
        } else {
            if (firstEmptyIndex !== -1) {
                newOtp[firstEmptyIndex] = key;
                setOtp(newOtp);
            }
        }
    };

    // --- VERIFICATION SCREEN ---
    if (currentStep === 'verification') {
        return (
            <div className="min-h-screen bg-white p-6 font-sans flex flex-col">
                <div className="pt-2 mb-6">
                    <button
                        onClick={() => setCurrentStep('signup')}
                        className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-700 font-bold hover:bg-slate-100 transition-colors"
                    >
                        ←
                    </button>
                </div>

                <div className="mb-8 pl-1 text-center">
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">Verification Email</h1>
                    <p className="text-slate-500 text-sm max-w-[240px] mx-auto leading-relaxed">
                        Please enter the code we just sent to email <span className="text-slate-800 font-medium">users@fitnflex.com</span>
                    </p>
                </div>

                <div className="flex justify-center gap-4 mb-8">
                    {[0, 1, 2, 3].map((idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "w-14 h-14 rounded-2xl border-2 flex items-center justify-center text-2xl font-bold transition-all",
                                otp[idx]
                                    ? "border-[#1F8548] text-slate-800 bg-white"
                                    : "border-slate-100 bg-slate-50"
                            )}
                        >
                            {otp[idx]}
                        </div>
                    ))}
                </div>

                <div className="text-center mb-8">
                    <p className="text-sm text-slate-400">If you didn&apos;t receive a code? <button className="text-[#1F8548] font-bold">Resend</button></p>
                </div>

                <button
                    onClick={() => router.push('/menu/store_123/1?from=login')}
                    className="w-full bg-[#1F8548] text-white py-4 rounded-xl font-bold shadow-lg shadow-green-200 active:scale-[0.98] transition-all"
                >
                    Continue
                </button>

                {/* Numeric Keypad Visual (INTERACTIVE) */}
                <div className="mt-auto pb-4 pt-6">
                    <div className="grid grid-cols-3 gap-y-6 gap-x-12 text-2xl font-medium text-slate-800 px-6">
                        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((key) => (
                            <button
                                key={key}
                                onClick={() => handleKeypadPress(key)}
                                className="flex items-center justify-center h-12 active:scale-90 active:bg-slate-50 rounded-full transition-all"
                            >
                                {key}
                            </button>
                        ))}
                        <div className="h-12"></div>
                        <button
                            onClick={() => handleKeypadPress('0')}
                            className="flex items-center justify-center h-12 active:scale-90 active:bg-slate-50 rounded-full transition-all"
                        >
                            0
                        </button>
                        <button
                            onClick={() => handleKeypadPress('backspace')}
                            className="flex items-center justify-center h-12 active:scale-90 active:text-red-500 transition-all"
                        >
                            <div className="w-8 h-6 border-2 border-slate-800 rounded-md flex items-center justify-center text-xs relative">
                                <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 border-l-2 border-b-2 border-slate-800 bg-white rotate-45 transform"></span>
                                x
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
