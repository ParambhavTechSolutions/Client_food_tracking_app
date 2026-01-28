import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Lock, ChevronRight, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockMeals, mockWeekPlan } from '@/data/mockData';
import { format, addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { Meal } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function CustomizePage() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(addDays(new Date(), 1));
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(mockMeals[0]);
  const [showMealPicker, setShowMealPicker] = useState(false);
  const [confirmedChanges, setConfirmedChanges] = useState<Record<string, Meal>>({});

  const editableDays = mockWeekPlan.filter((day) => day.isEditable);

  const isDateEditable = (date: Date): boolean => {
    const cutoff = new Date(date);
    cutoff.setDate(cutoff.getDate() - 1);
    cutoff.setHours(20, 0, 0, 0);
    return new Date() < cutoff;
  };

  const handleSelectMeal = (meal: Meal) => {
    setSelectedMeal(meal);
    setConfirmedChanges((prev) => ({
      ...prev,
      [selectedDate.toISOString()]: meal,
    }));
    setShowMealPicker(false);
  };

  const hasChanges = Object.keys(confirmedChanges).length > 0;

  return (
    <AppLayout>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center gap-3 p-4 safe-top bg-background/80 backdrop-blur-lg sticky top-0 z-10 border-b">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-foreground">Customize Meals</h1>
            <p className="text-sm text-muted-foreground">Select day to modify</p>
          </div>
          <Button variant="ghost" size="icon">
            <Filter className="h-5 w-5" />
          </Button>
        </header>

        {/* Date Selector */}
        <div className="p-4 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {Array.from({ length: 7 }, (_, i) => {
              const date = addDays(new Date(), i + 1);
              const editable = isDateEditable(date);
              const isSelected = selectedDate.toDateString() === date.toDateString();
              const hasChange = confirmedChanges[date.toISOString()];

              return (
                <button
                  key={i}
                  onClick={() => editable && setSelectedDate(date)}
                  disabled={!editable}
                  className={cn(
                    'flex flex-col items-center p-3 rounded-xl min-w-[70px] transition-smooth relative',
                    isSelected && 'bg-primary text-primary-foreground',
                    !isSelected && editable && 'bg-card hover:bg-secondary',
                    !editable && 'bg-muted opacity-50 cursor-not-allowed'
                  )}
                >
                  {!editable && (
                    <Lock className="absolute top-1 right-1 h-3 w-3 text-muted-foreground" />
                  )}
                  {hasChange && (
                    <div className="absolute top-1 right-1 h-2 w-2 rounded-full bg-success" />
                  )}
                  <span className="text-xs font-medium uppercase">
                    {format(date, 'EEE')}
                  </span>
                  <span className="text-lg font-bold mt-1">
                    {format(date, 'd')}
                  </span>
                  <span className="text-xs mt-1 opacity-70">
                    {format(date, 'MMM')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cutoff Notice */}
        <div className="px-4">
          <div className="text-xs text-muted-foreground text-center p-2 bg-secondary/50 rounded-lg">
            Changes must be made before 8 PM the previous day
          </div>
        </div>

        {/* Current Selection */}
        <div className="p-4">
          <div className="card-elevated p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Selected for</p>
                <p className="font-semibold text-foreground">
                  {format(selectedDate, 'EEEE, MMMM d')}
                </p>
              </div>
              <span className="text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">
                Editable
              </span>
            </div>

            {selectedMeal && (
              <button
                onClick={() => setShowMealPicker(true)}
                className="w-full flex gap-4 p-3 bg-secondary/50 rounded-xl hover:bg-secondary transition-smooth text-left"
              >
                <div className="h-20 w-20 rounded-lg bg-secondary overflow-hidden flex-shrink-0">
                  <img
                    src={selectedMeal.imageUrl}
                    alt={selectedMeal.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{selectedMeal.name}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {selectedMeal.description}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {selectedMeal.calories} cal
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground self-center" />
              </button>
            )}
          </div>
        </div>

        {/* Meal Options Preview */}
        <div className="flex-1 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Quick Switch</h2>
            <Button variant="ghost" size="sm" onClick={() => setShowMealPicker(true)}>
              See All
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {mockMeals.slice(0, 4).map((meal) => (
              <button
                key={meal.id}
                onClick={() => handleSelectMeal(meal)}
                className={cn(
                  'text-left rounded-xl overflow-hidden transition-smooth',
                  selectedMeal?.id === meal.id
                    ? 'ring-2 ring-primary shadow-soft'
                    : 'hover:shadow-soft'
                )}
              >
                <div className="h-24 bg-secondary relative">
                  <img
                    src={meal.imageUrl}
                    alt={meal.name}
                    className="h-full w-full object-cover"
                  />
                  {selectedMeal?.id === meal.id && (
                    <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <div className="p-3 bg-card">
                  <p className="font-medium text-foreground text-sm truncate">{meal.name}</p>
                  <p className="text-xs text-muted-foreground">{meal.calories} cal</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        {hasChanges && (
          <div className="sticky bottom-20 p-4 bg-background/80 backdrop-blur-lg border-t">
            <Button className="w-full h-12" size="lg" onClick={() => navigate('/')}>
              Confirm {Object.keys(confirmedChanges).length} Change{Object.keys(confirmedChanges).length > 1 ? 's' : ''}
            </Button>
          </div>
        )}

        {/* Meal Picker Dialog */}
        <Dialog open={showMealPicker} onOpenChange={setShowMealPicker}>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Choose Your Meal</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 pt-4">
              {mockMeals.map((meal) => (
                <button
                  key={meal.id}
                  onClick={() => handleSelectMeal(meal)}
                  className={cn(
                    'w-full flex gap-4 p-3 rounded-xl transition-smooth text-left',
                    selectedMeal?.id === meal.id
                      ? 'bg-primary/10 ring-2 ring-primary'
                      : 'bg-secondary/50 hover:bg-secondary'
                  )}
                >
                  <div className="h-20 w-20 rounded-lg bg-secondary overflow-hidden flex-shrink-0">
                    <img
                      src={meal.imageUrl}
                      alt={meal.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{meal.name}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {meal.description}
                    </p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {meal.calories} cal
                      </span>
                      {meal.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  {selectedMeal?.id === meal.id && (
                    <Check className="h-5 w-5 text-primary self-center" />
                  )}
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
