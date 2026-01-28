import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Phone, ArrowRight, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';

export default function LoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = () => {
    if (phone.length >= 10) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setStep('otp');
      }, 1000);
    }
  };

  const handleVerifyOtp = () => {
    if (otp.length === 6) {
      setIsLoading(true);
      setTimeout(() => {
        navigate('/');
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 animate-fade-in">
          <Leaf className="h-10 w-10 text-primary" />
        </div>
        
        <h1 className="text-3xl font-bold text-foreground animate-fade-in">
          NutriBox
        </h1>
        <p className="text-muted-foreground mt-2 animate-fade-in">
          Healthy meals delivered daily
        </p>

        {/* Trust badges */}
        <div className="flex items-center gap-4 mt-8 text-sm text-muted-foreground animate-slide-up">
          <span>10K+ Happy Customers</span>
          <span>•</span>
          <span>Fresh Ingredients</span>
        </div>
      </div>

      {/* Login Form */}
      <div className="bg-card rounded-t-3xl p-6 shadow-elevated animate-slide-up">
        {step === 'phone' ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Get Started</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Enter your phone number to continue
              </p>
            </div>

            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="pl-12 h-14 text-lg"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                +91
              </span>
            </div>

            <Button
              className="w-full h-14 text-lg gap-2"
              onClick={handleSendOtp}
              disabled={phone.length < 10 || isLoading}
            >
              {isLoading ? 'Sending...' : 'Continue'}
              <ArrowRight className="h-5 w-5" />
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By continuing, you agree to our{' '}
              <a href="/terms" className="text-primary underline">Terms of Service</a>
              {' '}and{' '}
              <a href="/privacy" className="text-primary underline">Privacy Policy</a>
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Verify OTP</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Enter the 6-digit code sent to +91 {phone}
              </p>
            </div>

            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              className="w-full h-14 text-lg"
              onClick={handleVerifyOtp}
              disabled={otp.length < 6 || isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify & Login'}
            </Button>

            <div className="flex items-center justify-between text-sm">
              <button
                onClick={() => setStep('phone')}
                className="text-muted-foreground hover:text-foreground"
              >
                Change Number
              </button>
              <button className="text-primary font-medium">
                Resend OTP
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
