import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format, addDays, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

export default function PausePage() {
  const navigate = useNavigate();
  const [pauseStart, setPauseStart] = useState<Date | undefined>();
  const [pauseEnd, setPauseEnd] = useState<Date | undefined>();
  const [step, setStep] = useState<'start' | 'end' | 'confirm'>('start');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const today = new Date();
  const minPauseStart = addDays(today, 1); // Can't pause today

  const pauseDays = pauseStart && pauseEnd ? differenceInDays(pauseEnd, pauseStart) + 1 : 0;

  const handleConfirmPause = () => {
    setIsPaused(true);
    setShowConfirmDialog(false);
  };

  if (isPaused && pauseStart && pauseEnd) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center space-y-6 max-w-sm animate-fade-in">
            <div className="mx-auto w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-success" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Pause Confirmed!</h1>
              <p className="text-muted-foreground mt-2">
                Your deliveries are paused from{' '}
                <span className="font-medium text-foreground">
                  {format(pauseStart, 'MMM d')}
                </span>{' '}
                to{' '}
                <span className="font-medium text-foreground">
                  {format(pauseEnd, 'MMM d')}
                </span>
              </p>
            </div>

            <div className="bg-secondary/50 rounded-xl p-4 text-sm text-muted-foreground">
              <p>No deliveries or charges during this period.</p>
              <p className="mt-2">
                Deliveries will resume on{' '}
                <span className="font-medium text-foreground">
                  {format(addDays(pauseEnd, 1), 'EEEE, MMM d')}
                </span>
              </p>
            </div>

            <Button className="w-full" onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 p-4 max-w-lg mx-auto">
        {/* Header */}
        <header className="flex items-center gap-3 pt-2 safe-top">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Pause Deliveries</h1>
            <p className="text-sm text-muted-foreground">Select pause period</p>
          </div>
        </header>

        {/* Info Banner */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-info/10 border border-info/20">
          <AlertCircle className="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-foreground">No charges during pause</p>
            <p className="text-muted-foreground mt-1">
              You won't be charged for any deliveries during the pause period. Your subscription days will be preserved.
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2">
          <div className={cn(
            'flex-1 h-1 rounded-full transition-colors',
            step === 'start' || step === 'end' || step === 'confirm' ? 'bg-primary' : 'bg-secondary'
          )} />
          <div className={cn(
            'flex-1 h-1 rounded-full transition-colors',
            step === 'end' || step === 'confirm' ? 'bg-primary' : 'bg-secondary'
          )} />
          <div className={cn(
            'flex-1 h-1 rounded-full transition-colors',
            step === 'confirm' ? 'bg-primary' : 'bg-secondary'
          )} />
        </div>

        {/* Calendar Selection */}
        <div className="card-elevated p-4">
          {step === 'start' && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center">
                <h2 className="font-semibold text-foreground">When should deliveries pause?</h2>
                <p className="text-sm text-muted-foreground">Select the first day to skip</p>
              </div>
              <Calendar
                mode="single"
                selected={pauseStart}
                onSelect={(date) => {
                  setPauseStart(date);
                  if (date) setStep('end');
                }}
                disabled={(date) => date < minPauseStart}
                className="rounded-xl pointer-events-auto"
              />
            </div>
          )}

          {step === 'end' && pauseStart && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center">
                <h2 className="font-semibold text-foreground">When should deliveries resume?</h2>
                <p className="text-sm text-muted-foreground">Select the last day to skip</p>
              </div>
              <div className="text-center p-3 bg-secondary/50 rounded-lg mb-4">
                <span className="text-sm text-muted-foreground">Pause starts: </span>
                <span className="font-medium text-foreground">{format(pauseStart, 'EEE, MMM d')}</span>
              </div>
              <Calendar
                mode="single"
                selected={pauseEnd}
                onSelect={(date) => {
                  setPauseEnd(date);
                  if (date) setStep('confirm');
                }}
                disabled={(date) => date < pauseStart}
                className="rounded-xl pointer-events-auto"
              />
              <Button variant="ghost" className="w-full" onClick={() => setStep('start')}>
                Change Start Date
              </Button>
            </div>
          )}

          {step === 'confirm' && pauseStart && pauseEnd && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <h2 className="font-semibold text-foreground">Confirm Pause</h2>
                <p className="text-sm text-muted-foreground">Review your pause period</p>
              </div>

              <div className="bg-secondary/50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pause starts</span>
                  <span className="font-medium text-foreground">{format(pauseStart, 'EEE, MMM d')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pause ends</span>
                  <span className="font-medium text-foreground">{format(pauseEnd, 'EEE, MMM d')}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="text-muted-foreground">Days paused</span>
                  <span className="font-semibold text-foreground">{pauseDays} days</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-warning/30 bg-warning/5">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Deliveries will resume on </span>
                  {format(addDays(pauseEnd, 1), 'EEEE, MMMM d')}
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep('end')}>
                  Change Dates
                </Button>
                <Button className="flex-1" onClick={() => setShowConfirmDialog(true)}>
                  Confirm Pause
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-sm mx-4">
          <DialogHeader>
            <DialogTitle>Pause Deliveries?</DialogTitle>
            <DialogDescription>
              Your deliveries will be paused for {pauseDays} days. You won't receive any meals or charges during this period.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleConfirmPause} className="flex-1">
              Yes, Pause
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
