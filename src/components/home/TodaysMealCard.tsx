import { Meal, DeliveryStatus } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Clock, ChevronRight, MapPin, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface TodaysMealCardProps {
  meal: Meal | null;
  status: DeliveryStatus;
  deliveryTime?: string;
  onChangeMeal?: () => void;
  onTrackDelivery?: () => void;
}

export function TodaysMealCard({
  meal,
  status,
  deliveryTime,
  onChangeMeal,
  onTrackDelivery,
}: TodaysMealCardProps) {
  if (!meal) {
    return (
      <div className="card-elevated p-6 animate-fade-in">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <Clock className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No Delivery Today</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Your delivery is paused for today
          </p>
          <Link to="/subscription">
            <Button variant="outline" className="mt-4">
              View Schedule
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card-elevated overflow-hidden animate-fade-in">
      {/* Meal Image */}
      <div className="relative h-40 bg-secondary">
        <img
          src={meal.imageUrl}
          alt={meal.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <StatusBadge status={status} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-foreground">{meal.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
          {meal.description}
        </p>

        {/* Tags & Calories */}
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
            {meal.calories} cal
          </span>
          {meal.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Delivery Time */}
        {deliveryTime && (
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {status === 'out-for-delivery' ? 'Arriving by' : 'Scheduled'}: <strong className="text-foreground">{deliveryTime}</strong>
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          {status === 'out-for-delivery' && (
            <Button 
              onClick={onTrackDelivery}
              className="flex-1 gap-2"
            >
              <MapPin className="h-4 w-4" />
              Track Delivery
            </Button>
          )}
          
          {status === 'scheduled' && (
            <Button
              variant="outline"
              onClick={onChangeMeal}
              className="flex-1 gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Change Meal
            </Button>
          )}
          
          {status === 'out-for-delivery' && (
            <Button variant="outline" size="icon" onClick={onChangeMeal}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
