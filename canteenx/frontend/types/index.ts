export interface User {
  id: string;
  name: string;
  email: string;
  collegeId: string;
  phone: string;
  role: 'student' | 'teacher' | 'admin' | 'canteen_owner';
  department: string;
  position?: string; // Added for teacher role
  avatar?: string;
  createdAt: string;
}

export interface FoodItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: 'breakfast' | 'lunch' | 'snacks' | 'beverages' | 'desserts' | 'special';
  image: string;
  available: boolean;
  quantityAvailable: number;
  preparationTime: number;
  isVegetarian: boolean;
  isVegan: boolean;
  rating: number;
  totalRatings: number;
}

export interface CartItem {
  foodItemId: string;
  quantity: number;
  price: number;
  name: string;
  notes?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  items: {
    foodItem: FoodItem;
    quantity: number;
    price: number;
    notes?: string;
  }[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  paymentMethod: 'online' | 'cash';
  paymentStatus: 'pending' | 'completed' | 'failed';
  pickupTime: string;
  scheduledFor: string;
  user: User;
  rating?: number;
  feedback?: string;
  createdAt: string;
  completedAt?: string;
}
