import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { mockSubscription, mockWeekPlan, mockMeals } from '@/data/mockData';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { format, addDays, startOfWeek, isToday, isBefore } from 'date-fns';
import { ChevronLeft, ChevronRight, Lock, Check, PauseCircle, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DayPlan, DeliveryStatus } from '@/types';
import { useNavigate } from 'react-router-dom';

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Generate week days
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const getStatusForDate = (date: Date): DeliveryStatus => {
    const dayIndex = Math.floor((date.getTime() - new Date().setHours(0,0,0,0)) / (1000 * 60 * 60 * 24));
    if (dayIndex < 0) return 'delivered';
    if (dayIndex === 3) return 'paused';
    if (dayIndex === 0) return 'out-for-delivery';
    return 'scheduled';
  };

  const isEditable = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const cutoffTime = new Date(date);
    cutoffTime.setDate(cutoffTime.getDate() - 1);
    cutoffTime.setHours(20, 0, 0, 0); // 8 PM previous day cutoff
    return new Date() < cutoffTime;
  };

  return (
    <AppLayout>
      <div className="space-y-6 p-4 max-w-lg mx-auto">
        {/* Header */}
        <header className="pt-2 safe-top">
          <h1 className="text-2xl font-bold text-foreground">My Plan</h1>
          <p className="text-muted-foreground">{mockSubscription.planName}</p>
        </header>

        {/* Subscription Overview Card */}
        <div className="card-elevated p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Plan Status</p>
              <p className="text-lg font-semibold text-success">Active</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p className="text-lg font-semibold text-foreground">{mockSubscription.remainingDays} days</p>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{format(mockSubscription.startDate, 'MMM d')}</span>
              <span>{format(mockSubscription.endDate, 'MMM d')}</span>
            </div>
            <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{
                  width: `${((mockSubscription.totalDays - mockSubscription.remainingDays) / mockSubscription.totalDays) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1 gap-2"
              onClick={() => navigate('/pause')}
            >
              <PauseCircle className="h-4 w-4" />
              Pause Plan
            </Button>
            <Button className="flex-1 gap-2" onClick={() => navigate('/customize')}>
              Modify Meals
            </Button>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentWeekStart(addDays(currentWeekStart, -7))}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="font-semibold text-foreground">
            {format(currentWeekStart, 'MMMM yyyy')}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Week View */}
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => {
            const status = getStatusForDate(day);
            const editable = isEditable(day);
            const isSelected = selectedDate?.toDateString() === day.toDateString();
            const isPast = isBefore(day, new Date()) && !isToday(day);

            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  'flex flex-col items-center p-2 rounded-xl transition-smooth touch-target',
                  isSelected && 'bg-primary text-primary-foreground',
                  !isSelected && isToday(day) && 'bg-primary/10',
                  !isSelected && !isToday(day) && 'hover:bg-secondary',
                  isPast && 'opacity-50'
                )}
              >
                <span className="text-xs font-medium uppercase">
                  {format(day, 'EEE')}
                </span>
                <span className={cn(
                  'text-lg font-bold mt-1',
                  isSelected ? 'text-primary-foreground' : 'text-foreground'
                )}>
                  {format(day, 'd')}
                </span>
                {/* Status indicator */}
                <span
                  className={cn(
                    'mt-1 h-1.5 w-1.5 rounded-full',
                    status === 'delivered' && 'bg-success',
                    status === 'out-for-delivery' && 'bg-warning',
                    status === 'scheduled' && 'bg-info',
                    status === 'paused' && 'bg-muted-foreground'
                  )}
                />
              </button>
            );
          })}
        </div>

        {/* Selected Day Details */}
        {selectedDate && (
          <div className="card-elevated p-4 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {format(selectedDate, 'EEEE, MMMM d')}
                </p>
                <StatusBadge status={getStatusForDate(selectedDate)} />
              </div>
              {!isEditable(selectedDate) && (
                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                  <Lock className="h-4 w-4" />
                  <span>Locked</span>
                </div>
              )}
              {isEditable(selectedDate) && (
                <div className="flex items-center gap-1 text-success text-sm">
                  <Check className="h-4 w-4" />
                  <span>Editable</span>
                </div>
              )}
            </div>

            {/* Meal for this day */}
            <div className="flex gap-3 p-3 bg-secondary/50 rounded-xl">
              <div className="h-16 w-16 rounded-lg bg-secondary overflow-hidden flex-shrink-0">
                <img
                  src={mockMeals[0].imageUrl}
                  alt={mockMeals[0].name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">{mockMeals[0].name}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {mockMeals[0].description}
                </p>
              </div>
            </div>

            {isEditable(selectedDate) && (
              <Button className="w-full" onClick={() => navigate('/customize')}>
                Change Meal
              </Button>
            )}
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-success" />
            <span>Delivered</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-info" />
            <span>Scheduled</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-muted-foreground" />
            <span>Paused</span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
