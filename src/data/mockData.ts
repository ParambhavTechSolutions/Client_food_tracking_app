import { Meal, Subscription, WalletTransaction, Address, DeliverySlot, DayPlan, User } from '@/types';
import mealChickenSalad from '@/assets/meal-chicken-salad.jpg';
import mealBuddhaBowl from '@/assets/meal-buddha-bowl.jpg';
import mealSalmon from '@/assets/meal-salmon.jpg';
import mealMediterraneanWrap from '@/assets/meal-mediterranean-wrap.jpg';
import mealStirFry from '@/assets/meal-stir-fry.jpg';

export const mockMeals: Meal[] = [
  {
    id: '1',
    name: 'Grilled Chicken Salad Bowl',
    description: 'Fresh greens, grilled chicken breast, cherry tomatoes, cucumber, and light vinaigrette',
    calories: 420,
    imageUrl: mealChickenSalad,
    tags: ['High Protein', 'Low Carb'],
  },
  {
    id: '2',
    name: 'Quinoa Buddha Bowl',
    description: 'Organic quinoa, roasted chickpeas, avocado, kale, and tahini dressing',
    calories: 480,
    imageUrl: mealBuddhaBowl,
    tags: ['Vegan', 'High Fiber'],
  },
  {
    id: '3',
    name: 'Salmon Teriyaki',
    description: 'Pan-seared salmon with teriyaki glaze, steamed broccoli, and brown rice',
    calories: 520,
    imageUrl: mealSalmon,
    tags: ['Omega-3', 'High Protein'],
  },
  {
    id: '4',
    name: 'Mediterranean Wrap',
    description: 'Whole wheat wrap with hummus, falafel, fresh vegetables, and tzatziki',
    calories: 450,
    imageUrl: mealMediterraneanWrap,
    tags: ['Vegetarian', 'High Fiber'],
  },
  {
    id: '5',
    name: 'Asian Stir-Fry Bowl',
    description: 'Tofu and vegetable stir-fry with ginger soy sauce over jasmine rice',
    calories: 380,
    imageUrl: mealStirFry,
    tags: ['Vegan', 'Low Fat'],
  },
];

export const mockUser: User = {
  id: 'user-1',
  name: 'Priya',
  phone: '+91 98765 43210',
  defaultAddressId: 'addr-1',
  walletBalance: 1250,
};

export const mockSubscription: Subscription = {
  id: 'sub-1',
  planName: 'Healthy Essentials',
  totalDays: 30,
  remainingDays: 18,
  startDate: new Date('2026-01-15'),
  endDate: new Date('2026-02-14'),
  mealsPerDay: 1,
  isActive: true,
};

export const mockTransactions: WalletTransaction[] = [
  {
    id: 'txn-1',
    type: 'credit',
    amount: 2000,
    description: 'Wallet top-up',
    date: new Date('2026-01-25'),
    status: 'completed',
  },
  {
    id: 'txn-2',
    type: 'debit',
    amount: 150,
    description: 'Delivery - Jan 27',
    date: new Date('2026-01-27'),
    status: 'completed',
  },
  {
    id: 'txn-3',
    type: 'debit',
    amount: 150,
    description: 'Delivery - Jan 26',
    date: new Date('2026-01-26'),
    status: 'completed',
  },
  {
    id: 'txn-4',
    type: 'refund',
    amount: 150,
    description: 'Cancelled delivery refund',
    date: new Date('2026-01-24'),
    status: 'completed',
  },
];

export const mockAddresses: Address[] = [
  {
    id: 'addr-1',
    label: 'Home',
    fullAddress: '42, Koramangala 4th Block, Bangalore 560034',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'Office',
    fullAddress: 'WeWork, Embassy Golf Links, Bangalore 560071',
    isDefault: false,
  },
];

export const mockDeliverySlots: DeliverySlot[] = [
  { id: 'slot-1', label: 'Early Morning', timeRange: '6:00 AM - 8:00 AM', isAvailable: true },
  { id: 'slot-2', label: 'Morning', timeRange: '8:00 AM - 10:00 AM', isAvailable: true },
  { id: 'slot-3', label: 'Late Morning', timeRange: '10:00 AM - 12:00 PM', isAvailable: false },
];

const today = new Date();
export const mockWeekPlan: DayPlan[] = Array.from({ length: 7 }, (_, i) => {
  const date = new Date(today);
  date.setDate(today.getDate() + i);
  
  const isPast = i < 0;
  const isToday = i === 0;
  const isPaused = i === 3;
  
  let status: DayPlan['status'] = 'scheduled';
  if (isPaused) status = 'paused';
  else if (isToday) status = 'out-for-delivery';
  else if (isPast) status = 'delivered';
  
  return {
    date,
    meal: isPaused ? null : mockMeals[i % mockMeals.length],
    status,
    isEditable: i > 0 && !isPaused,
    deliveryTime: isToday ? '8:30 AM' : i > 0 ? '7:00 AM - 9:00 AM' : undefined,
  };
});
