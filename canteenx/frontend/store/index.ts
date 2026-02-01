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
    // Canteen owners don't need approval, students and teachers do
    const needsApproval = meta?.role === 'student' || meta?.role === 'teacher';
    const metaWithApproval = { ...meta, is_approved: !needsApproval };
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metaWithApproval }
    });
    if (error) {
      set({ error: error.message, loading: false });
    } else {
      // Create a profile entry for admin to manage
      if (data.user) {
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: data.user.id,
          email: email.toLowerCase().trim(),
          name: meta?.name || '',
          role: meta?.role || 'student',
          college_id: (meta?.collegeId || '').toUpperCase().trim(),
          phone: (meta?.phone || '').trim(),
          department: meta?.department || '',
          position: meta?.position || '',
          is_approved: !needsApproval,
          created_at: new Date().toISOString(),
        });
        
        if (profileError) {
          console.error('Profile creation failed:', profileError);
          // Still continue - profile will be created on order
        } else {
          console.log('Profile created successfully for:', data.user.id);
        }
      }
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
      
      // Check approval status from profiles table ONLY (admin controls this)
      if (meta.role === 'student' || meta.role === 'teacher') {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('is_approved')
          .eq('id', supabaseUser?.id)
          .single();
        
        console.log('Profile check:', { profileData, profileError, userId: supabaseUser?.id });
        
        // If no profile exists or is_approved is not true, block login
        // User must have profile AND is_approved must be explicitly true
        const isApproved = profileData?.is_approved === true;
        
        if (!profileData || !isApproved) {
          // Sign out the user since they're not approved yet
          await supabase.auth.signOut();
          set({ 
            error: 'Your registration is pending admin approval. Please wait for admin to verify your account.', 
            loading: false,
            user: null,
            isAuthenticated: false
          });
          return;
        }
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
      const maxQty = item.maxQuantity || 999;

      if (existingItem) {
        // Don't exceed max quantity
        const newQuantity = Math.min(existingItem.quantity + item.quantity, maxQty);
        newItems = state.items.map((i) =>
          i.foodItemId === item.foodItemId
            ? { ...i, quantity: newQuantity, maxQuantity: maxQty }
            : i
        );
      } else {
        newItems = [...state.items, { ...item, maxQuantity: maxQty }];
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
      const item = state.items.find((i) => i.foodItemId === foodItemId);
      const maxQty = item?.maxQuantity || 999;
      const newQuantity = Math.min(quantity, maxQty);
      
      const newItems = state.items.map((i) =>
        i.foodItemId === foodItemId ? { ...i, quantity: newQuantity } : i
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
