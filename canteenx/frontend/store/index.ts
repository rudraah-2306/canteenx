import { create } from 'zustand';
import { User, CartItem, Order } from '../types';
import { supabase } from '../lib/supabaseClient';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, meta?: Partial<User>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
}

interface CartStore {
  items: CartItem[];
  totalPrice: number;
  addItem: (item: CartItem) => void;
  removeItem: (foodItemId: string) => void;
  updateQuantity: (foodItemId: string, quantity: number) => void;
  clearCart: () => void;
}

interface OrderStore {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  signUp: async (email, password, meta) => {
    set({ loading: true, error: null });
    // Add is_approved: false to meta
    const metaWithApproval = { ...meta, is_approved: false };
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metaWithApproval }
    });
    if (error) {
      set({ error: error.message, loading: false });
    } else {
      set({ loading: false });
    }
  },
  signIn: async (email, password) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      set({ error: error.message, loading: false });
    } else {
      const supabaseUser = data.user;
      const meta = supabaseUser?.user_metadata || {};
      // Check email confirmed
      if (!supabaseUser?.email_confirmed_at) {
        set({ error: 'Please confirm your email before logging in.', loading: false });
        return;
      }
      // Only require admin approval for student and teacher
      if ((meta.role === 'student' || meta.role === 'teacher') && !meta.is_approved) {
        set({ error: 'Your registration is pending admin approval.', loading: false });
        return;
      }
      set({
        user: supabaseUser
          ? {
              id: supabaseUser.id,
              email: supabaseUser.email || '',
              name: meta.name || '',
              collegeId: meta.collegeId || '',
              phone: meta.phone || '',
              role: meta.role || 'student',
              department: meta.department || '',
              avatar: meta.avatar || '',
              createdAt: supabaseUser.created_at,
            }
          : null,
        isAuthenticated: !!supabaseUser,
        loading: false,
      });
    }
  },
  signOut: async () => {
    set({ loading: true, error: null });
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false, loading: false });
  },
}));

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  totalPrice: 0,
  addItem: (item) =>
    set((state) => {
      const existingItem = state.items.find((i) => i.foodItemId === item.foodItemId);
      let newItems;

      if (existingItem) {
        newItems = state.items.map((i) =>
          i.foodItemId === item.foodItemId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        newItems = [...state.items, item];
      }

      const totalPrice = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
      return { items: newItems, totalPrice };
    }),
  removeItem: (foodItemId) =>
    set((state) => {
      const newItems = state.items.filter((i) => i.foodItemId !== foodItemId);
      const totalPrice = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
      return { items: newItems, totalPrice };
    }),
  updateQuantity: (foodItemId, quantity) =>
    set((state) => {
      const newItems = state.items.map((i) =>
        i.foodItemId === foodItemId ? { ...i, quantity } : i
      );
      const totalPrice = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
      return { items: newItems, totalPrice };
    }),
  clearCart: () => set({ items: [], totalPrice: 0 }),
}));

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  setOrders: (orders) => set({ orders }),
  addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
}));
