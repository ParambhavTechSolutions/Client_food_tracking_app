import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Phone, MapPin, Clock, ChefHat, Truck, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

type DeliveryStep = 'preparing' | 'picked-up' | 'on-the-way' | 'nearby' | 'delivered';

const steps: { id: DeliveryStep; label: string; icon: typeof ChefHat }[] = [
  { id: 'preparing', label: 'Preparing', icon: ChefHat },
  { id: 'picked-up', label: 'Picked Up', icon: Truck },
  { id: 'on-the-way', label: 'On the Way', icon: MapPin },
  { id: 'nearby', label: 'Nearby', icon: MapPin },
  { id: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

export default function TrackingPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<DeliveryStep>('on-the-way');
  const [eta, setEta] = useState(8);

  // Simulate progress
  useEffect(() => {
    const timer = setInterval(() => {
      setEta((prev) => Math.max(0, prev - 1));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(timer);
  }, []);

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <AppLayout>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center gap-3 p-4 safe-top bg-background/80 backdrop-blur-lg sticky top-0 z-10">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-foreground">Track Delivery</h1>
            <p className="text-sm text-muted-foreground">Order #DLV-28012026</p>
          </div>
        </header>

        {/* Map Placeholder */}
        <div className="relative flex-1 bg-secondary min-h-[300px]">
          {/* This would be a real map integration */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse-soft">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Live tracking map</p>
            </div>
          </div>

          {/* ETA Badge */}
          <div className="absolute top-4 left-4 right-4 flex justify-center">
            <div className="glass rounded-full px-6 py-3 shadow-elevated">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-warning">
                  <Clock className="h-5 w-5" />
                  <span className="font-bold text-lg">{eta} min</span>
                </div>
                <span className="text-muted-foreground">|</span>
                <span className="text-sm text-muted-foreground">Arriving soon</span>
              </div>
            </div>
          </div>

          {/* User Location Pin */}
          <div className="absolute bottom-20 right-8">
            <div className="relative">
              <div className="h-4 w-4 rounded-full bg-primary shadow-lg" />
              <div className="absolute -inset-2 rounded-full bg-primary/20 animate-ping" />
            </div>
          </div>

          {/* Delivery Agent Pin */}
          <div className="absolute bottom-32 left-1/3">
            <div className="bg-warning text-warning-foreground rounded-full p-2 shadow-lg animate-bounce-gentle">
              <Truck className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Bottom Sheet */}
        <div className="bg-card rounded-t-3xl -mt-6 relative z-10 p-6 space-y-6 shadow-elevated">
          {/* Delivery Progress */}
          <div className="space-y-4">
            <h2 className="font-semibold text-foreground">Delivery Status</h2>
            
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-secondary" />
              <div
                className="absolute left-4 top-0 w-0.5 bg-primary transition-all duration-500"
                style={{ height: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
              />

              {/* Steps */}
              <div className="space-y-4">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = index < currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  const isPending = index > currentStepIndex;

                  return (
                    <div key={step.id} className="flex items-center gap-4 relative">
                      <div
                        className={cn(
                          'relative z-10 h-8 w-8 rounded-full flex items-center justify-center transition-colors',
                          isCompleted && 'bg-primary text-primary-foreground',
                          isCurrent && 'bg-primary text-primary-foreground ring-4 ring-primary/20',
                          isPending && 'bg-secondary text-muted-foreground'
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p
                          className={cn(
                            'font-medium',
                            (isCompleted || isCurrent) ? 'text-foreground' : 'text-muted-foreground'
                          )}
                        >
                          {step.label}
                        </p>
                        {isCurrent && step.id === 'on-the-way' && (
                          <p className="text-sm text-muted-foreground">
                            Ravi is on his way to you
                          </p>
                        )}
                      </div>
                      {isCompleted && (
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Delivery Agent Card */}
          <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl">
            <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center">
              <span className="text-xl font-bold text-foreground">R</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">Ravi Kumar</p>
              <p className="text-sm text-muted-foreground">Delivery Partner</p>
            </div>
            <Button size="icon" className="rounded-full h-12 w-12">
              <Phone className="h-5 w-5" />
            </Button>
          </div>

          {/* Privacy Note */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
            <ShieldCheck className="h-4 w-4" />
            <span>Your phone number is hidden from the delivery partner</span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
