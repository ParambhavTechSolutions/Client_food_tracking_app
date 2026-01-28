export type DeliveryStatus = 'scheduled' | 'out-for-delivery' | 'delivered' | 'paused';

export interface Meal {
  id: string;
  name: string;
  description: string;
  calories: number;
  imageUrl: string;
  tags: string[];
}

export interface DayPlan {
  date: Date;
  meal: Meal | null;
  status: DeliveryStatus;
  isEditable: boolean;
  deliveryTime?: string;
}

export interface Subscription {
  id: string;
  planName: string;
  totalDays: number;
  remainingDays: number;
  startDate: Date;
  endDate: Date;
  mealsPerDay: number;
  isActive: boolean;
}

export interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit' | 'refund';
  amount: number;
  description: string;
  date: Date;
  status: 'completed' | 'pending';
}

export interface Address {
  id: string;
  label: string;
  fullAddress: string;
  isDefault: boolean;
}

export interface DeliverySlot {
  id: string;
  label: string;
  timeRange: string;
  isAvailable: boolean;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  defaultAddressId: string;
  walletBalance: number;
}
