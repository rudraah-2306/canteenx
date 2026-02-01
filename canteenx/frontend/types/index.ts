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
  id: string;
  _id?: string; // For backward compatibility with MongoDB
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
  isSpicy?: boolean;
  rating: number;
  totalRatings: number;
}

export interface CartItem {
  foodItemId: string;
  quantity: number;
  price: number;
  name: string;
  notes?: string;
  maxQuantity?: number;
}

export interface Order {
  id: string;
  _id?: string; // For backward compatibility with MongoDB
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
