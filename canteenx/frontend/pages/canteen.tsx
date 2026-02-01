import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Package, ShoppingBag, TrendingUp, Clock, CheckCircle, X, Phone } from 'lucide-react';

interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  quantity_available: number;
  available: boolean;
  image?: string;
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  preparation_time?: number;
}

interface Order {
  id: string;
  order_number?: string;
  token_number?: string;
  user_id: string;
  user_name?: string;
  user_email?: string;
  user_phone?: string;
  user_role?: string;
  items: any[];
  total_amount: number;
  status: string;
  payment_method: string;
  payment_status?: string;
  pickup_time: string;
  scheduled_for?: string;
  special_instructions?: string;
  created_at: string;
}

export default function CanteenDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('menu');
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [orderFilter, setOrderFilter] = useState('all'); // all, today, week, month
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'lunch',
    quantity_available: '',
    is_vegetarian: false,
    is_vegan: false,
    preparation_time: '15',
  });
  const [stats, setStats] = useState({
    totalItems: 0,
    activeItems: 0,
    todayOrders: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    if (!user || user.role !== 'canteen_owner') {
      router.push('/');
      return;
    }
    fetchData();
  }, [user, router]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch food items
      const { data: items, error: itemsError } = await supabase
        .from('food_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (itemsError) throw itemsError;
      setFoodItems(items || []);

      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;
      setOrders(ordersData || []);
      setFilteredOrders(ordersData || []);

      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const todayOrders = (ordersData || []).filter(
        (o) => o.created_at?.split('T')[0] === today
      );
      const pendingOrders = (ordersData || []).filter(
        (o) => o.status === 'pending' || o.status === 'confirmed' || o.status === 'preparing'
      );

      setStats({
        totalItems: items?.length || 0,
        activeItems: items?.filter((i) => i.available)?.length || 0,
        todayOrders: todayOrders.length,
        pendingOrders: pendingOrders.length,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter orders based on selected filters
  const applyOrderFilters = () => {
    let filtered = [...orders];
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // Time period filter
    if (orderFilter === 'today') {
      filtered = filtered.filter(o => o.created_at?.split('T')[0] === today);
    } else if (orderFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(o => new Date(o.created_at) >= weekAgo);
    } else if (orderFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(o => new Date(o.created_at) >= monthAgo);
    } else if (orderFilter === 'custom' && dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end + 'T23:59:59');
      filtered = filtered.filter(o => {
        const orderDate = new Date(o.created_at);
        return orderDate >= startDate && orderDate <= endDate;
      });
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(o => o.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  // Apply filters when filter values change
  useEffect(() => {
    applyOrderFilters();
  }, [orderFilter, dateRange, statusFilter, orders]);

  // Calculate filtered stats
  const filteredStats = {
    total: filteredOrders.length,
    totalRevenue: filteredOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0),
    pending: filteredOrders.filter(o => o.status === 'pending').length,
    completed: filteredOrders.filter(o => o.status === 'completed').length,
  };

  const handleAddItem = async (e: any) => {
    e.preventDefault();
    try {
      // Ensure canteen owner profile exists
      await supabase.from('profiles').upsert({
        id: user?.id,
        name: user?.name || '',
        email: user?.email || '',
        role: 'canteen_owner',
        is_approved: true,
      }, { onConflict: 'id' });

      const newItem = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        quantity_available: parseInt(formData.quantity_available),
        available: parseInt(formData.quantity_available) > 0,
        is_vegetarian: formData.is_vegetarian,
        is_vegan: formData.is_vegan,
        preparation_time: parseInt(formData.preparation_time),
        rating: 0,
        total_ratings: 0,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
      };

      console.log('Adding food item:', newItem);
      
      const { data, error } = await supabase.from('food_items').insert([newItem]).select();
      
      console.log('Insert response:', { data, error });
      
      if (error) {
        console.error('Insert error:', error);
        throw error;
      }

      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'lunch',
        quantity_available: '',
        is_vegetarian: false,
        is_vegan: false,
        preparation_time: '15',
      });
      setShowAddForm(false);
      fetchData();

      // Toast notification
      const event = new CustomEvent('toast', {
        detail: { message: 'Food item added successfully!', type: 'success' },
      });
      window.dispatchEvent(event);
    } catch (error: any) {
      console.error('Error adding item:', error);
      alert('Error adding food item: ' + (error?.message || 'Unknown error'));
    }
  };

  const handleEditItem = async (e: any) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const updatedItem = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        quantity_available: parseInt(formData.quantity_available),
        available: parseInt(formData.quantity_available) > 0,
        is_vegetarian: formData.is_vegetarian,
        is_vegan: formData.is_vegan,
        preparation_time: parseInt(formData.preparation_time),
      };

      const { error } = await supabase
        .from('food_items')
        .update(updatedItem)
        .eq('id', editingItem.id);

      if (error) throw error;

      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'lunch',
        quantity_available: '',
        is_vegetarian: false,
        is_vegan: false,
        preparation_time: '15',
      });
      fetchData();

      const event = new CustomEvent('toast', {
        detail: { message: 'Food item updated successfully!', type: 'success' },
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Error updating food item');
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const { error } = await supabase.from('food_items').delete().eq('id', id);
      if (error) throw error;

      fetchData();

      const event = new CustomEvent('toast', {
        detail: { message: 'Food item deleted!', type: 'success' },
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error deleting food item');
    }
  };

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    try {
      const { error } = await supabase
        .from('food_items')
        .update({
          quantity_available: newQuantity,
          available: newQuantity > 0,
        })
        .eq('id', id);

      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleToggleAvailability = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('food_items')
        .update({ available: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error toggling availability:', error);
    }
  };

  const handleOrderStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      fetchData();

      const event = new CustomEvent('toast', {
        detail: { message: `Order status updated to ${newStatus}!`, type: 'success' },
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handlePaymentStatusUpdate = async (orderId: string, newPaymentStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: newPaymentStatus })
        .eq('id', orderId);

      if (error) throw error;
      fetchData();

      const event = new CustomEvent('toast', {
        detail: { message: `Payment status updated to ${newPaymentStatus}!`, type: 'success' },
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const startEditing = (item: FoodItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      quantity_available: item.quantity_available.toString(),
      is_vegetarian: item.is_vegetarian || false,
      is_vegan: item.is_vegan || false,
      preparation_time: (item.preparation_time || 15).toString(),
    });
    setShowAddForm(false);
  };

  const cancelEditing = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'lunch',
      quantity_available: '',
      is_vegetarian: false,
      is_vegan: false,
      preparation_time: '15',
    });
  };

  if (!user || user.role !== 'canteen_owner') return null;

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    preparing: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    ready: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    completed: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-black py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Canteen Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your menu and orders</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Items', value: stats.totalItems, icon: Package, color: 'text-blue-500' },
            { label: 'Active Items', value: stats.activeItems, icon: CheckCircle, color: 'text-green-500' },
            { label: "Today's Orders", value: stats.todayOrders, icon: ShoppingBag, color: 'text-purple-500' },
            { label: 'Pending Orders', value: stats.pendingOrders, icon: Clock, color: 'text-orange-500' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="card p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color} opacity-50`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'menu'
                ? 'bg-primary-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Package className="w-4 h-4" />
            Menu Items
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-primary-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Orders ({stats.pendingOrders} pending)
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        ) : (
          <>
            {/* Menu Tab */}
            {activeTab === 'menu' && (
              <div>
                {/* Add Button */}
                <div className="mb-6">
                  <button
                    onClick={() => {
                      setShowAddForm(!showAddForm);
                      cancelEditing();
                    }}
                    className="btn btn-primary flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add New Item
                  </button>
                </div>

                {/* Add/Edit Form */}
                {(showAddForm || editingItem) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card p-6 mb-6"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold">
                        {editingItem ? 'Edit Food Item' : 'Add New Food Item'}
                      </h3>
                      <button
                        onClick={() => {
                          setShowAddForm(false);
                          cancelEditing();
                        }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <form
                      onSubmit={editingItem ? handleEditItem : handleAddItem}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <input
                        type="text"
                        placeholder="Item Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="input"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Price (₹)"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="input"
                        required
                        min="0"
                        step="0.01"
                      />
                      <textarea
                        placeholder="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="input col-span-2 h-20"
                        required
                      />
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="input"
                      >
                        <option value="breakfast">🌅 Breakfast</option>
                        <option value="lunch">🍛 Lunch</option>
                        <option value="snacks">🍿 Snacks</option>
                        <option value="beverages">🥤 Beverages</option>
                        <option value="desserts">🍰 Desserts</option>
                      </select>
                      <input
                        type="number"
                        placeholder="Quantity Available"
                        value={formData.quantity_available}
                        onChange={(e) => setFormData({ ...formData, quantity_available: e.target.value })}
                        className="input"
                        required
                        min="0"
                      />
                      <input
                        type="number"
                        placeholder="Preparation Time (minutes)"
                        value={formData.preparation_time}
                        onChange={(e) => setFormData({ ...formData, preparation_time: e.target.value })}
                        className="input"
                        min="1"
                      />
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.is_vegetarian}
                            onChange={(e) => setFormData({ ...formData, is_vegetarian: e.target.checked })}
                            className="w-4 h-4 rounded border-gray-300"
                          />
                          <span className="text-sm">🌱 Vegetarian</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.is_vegan}
                            onChange={(e) => setFormData({ ...formData, is_vegan: e.target.checked })}
                            className="w-4 h-4 rounded border-gray-300"
                          />
                          <span className="text-sm">🌿 Vegan</span>
                        </label>
                      </div>
                      <div className="col-span-2 flex gap-2">
                        <button type="submit" className="flex-1 btn btn-accent">
                          {editingItem ? 'Update Item' : 'Add Item'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddForm(false);
                            cancelEditing();
                          }}
                          className="flex-1 btn btn-secondary"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* Food Items List */}
                <div className="space-y-4">
                  {foodItems.length === 0 ? (
                    <div className="card p-12 text-center">
                      <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-xl font-bold mb-2">No menu items yet</h3>
                      <p className="text-gray-600 dark:text-gray-400">Add your first food item to get started!</p>
                    </div>
                  ) : (
                    foodItems.map((item, i) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.3 }}
                        className={`card p-4 ${!item.available ? 'opacity-60' : ''}`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-lg">{item.name}</h3>
                              {item.is_vegetarian && <span className="text-xs">🌱</span>}
                              {item.is_vegan && <span className="text-xs">🌿</span>}
                              {!item.available && (
                                <span className="px-2 py-0.5 text-xs rounded bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                                  Unavailable
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.description}</p>
                            <div className="flex flex-wrap gap-2">
                              <span className="px-2 py-1 text-xs rounded bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 capitalize">
                                {item.category}
                              </span>
                              <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                                ₹{item.price}
                              </span>
                              <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                ⏱ {item.preparation_time || 15} min
                              </span>
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Qty:</span>
                            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg">
                              <button
                                onClick={() => handleUpdateQuantity(item.id, Math.max(0, item.quantity_available - 1))}
                                className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-primary-600"
                              >
                                −
                              </button>
                              <input
                                type="number"
                                value={item.quantity_available}
                                onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 0)}
                                className="w-16 text-center bg-transparent border-0 font-semibold"
                                min="0"
                              />
                              <button
                                onClick={() => handleUpdateQuantity(item.id, item.quantity_available + 1)}
                                className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-primary-600"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleAvailability(item.id, item.available)}
                              className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                                item.available
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                  : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                              }`}
                            >
                              {item.available ? 'Available' : 'Unavailable'}
                            </button>
                            <button
                              onClick={() => startEditing(item)}
                              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="p-2 hover:bg-red-100 dark:hover:bg-red-900 text-red-500 rounded-lg"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                {/* Filters Section */}
                <div className="card p-4">
                  <h3 className="font-bold text-lg mb-4">📊 Filter Orders</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Time Period Filter */}
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 block">Time Period</label>
                      <select
                        value={orderFilter}
                        onChange={(e) => setOrderFilter(e.target.value)}
                        className="input w-full"
                      >
                        <option value="all">📋 All Time</option>
                        <option value="today">📅 Today</option>
                        <option value="week">📆 This Week</option>
                        <option value="month">🗓️ This Month</option>
                        <option value="custom">🎯 Custom Range</option>
                      </select>
                    </div>

                    {/* Custom Date Range */}
                    {orderFilter === 'custom' && (
                      <>
                        <div>
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 block">From</label>
                          <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                            className="input w-full"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 block">To</label>
                          <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                            className="input w-full"
                          />
                        </div>
                      </>
                    )}

                    {/* Status Filter */}
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 block">Status</label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="input w-full"
                      >
                        <option value="all">All Status</option>
                        <option value="pending">⏳ Pending</option>
                        <option value="confirmed">✅ Confirmed</option>
                        <option value="preparing">👨‍🍳 Preparing</option>
                        <option value="ready">📦 Ready</option>
                        <option value="completed">🎉 Completed</option>
                        <option value="cancelled">❌ Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Filter Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{filteredStats.total}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Total Orders</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">₹{filteredStats.totalRevenue}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Total Revenue</p>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-600">{filteredStats.pending}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Pending</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{filteredStats.completed}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Completed</p>
                    </div>
                  </div>
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                  <div className="card p-12 text-center">
                    <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-bold mb-2">No orders found</h3>
                    <p className="text-gray-600 dark:text-gray-400">No orders match your filter criteria.</p>
                  </div>
                ) : (
                  filteredOrders.map((order, i) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                      className="card p-6"
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg">
                              🎫 Token: {order.token_number || order.id?.slice(-8).toUpperCase()}
                            </h3>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[order.status] || statusColors.pending}`}>
                              {order.status?.toUpperCase()}
                            </span>
                            <span className="text-xs text-gray-500">
                              🕐 {new Date(order.created_at).toLocaleString('en-IN', { 
                                day: '2-digit', 
                                month: 'short', 
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          
                          {/* Customer Details */}
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-3">
                            <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">👤 Customer Details:</p>
                            <p className="text-sm font-medium">{order.user_name || 'N/A'}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{order.user_email}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">📱 {order.user_phone || 'N/A'}</p>
                            <p className="text-xs text-gray-500 capitalize">Role: {order.user_role || 'student'}</p>
                          </div>

                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            <p>📅 Pickup: {new Date(order.pickup_time).toLocaleString()}</p>
                            <p>💰 Payment: {order.payment_method === 'cash' ? '💵 Cash on Pickup' : '💳 UPI'} ({order.payment_status || 'pending'})</p>
                            {order.special_instructions && (
                              <p className="text-food-spice">📝 Note: {order.special_instructions}</p>
                            )}
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">🍽️ Items:</p>
                            {order.items?.map((item: any, idx: number) => (
                              <div key={idx} className="text-sm flex justify-between">
                                <span>{item.quantity}x {item.name || 'Item'}</span>
                                <span>₹{item.price * item.quantity}</span>
                              </div>
                            ))}
                            <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                              <p className="font-bold text-lg text-food-tomato">Total: ₹{order.total_amount}</p>
                            </div>
                          </div>
                        </div>

                        {/* Status Update */}
                        <div className="flex flex-col gap-3">
                          <div>
                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Update Status:</p>
                            <select
                              value={order.status}
                              onChange={(e) => handleOrderStatusUpdate(order.id, e.target.value)}
                              className="input py-2 w-full"
                            >
                              <option value="pending">⏳ Pending</option>
                              <option value="confirmed">✅ Confirmed</option>
                              <option value="preparing">👨‍🍳 Preparing</option>
                              <option value="ready">📦 Ready for Pickup</option>
                              <option value="completed">🎉 Completed</option>
                              <option value="cancelled">❌ Cancelled</option>
                            </select>
                          </div>
                          
                          <div>
                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Payment Status:</p>
                            <select
                              value={order.payment_status || 'pending'}
                              onChange={(e) => handlePaymentStatusUpdate(order.id, e.target.value)}
                              className={`input py-2 w-full ${
                                order.payment_status === 'paid' 
                                  ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700' 
                                  : ''
                              }`}
                            >
                              <option value="pending">⏳ Pending</option>
                              <option value="paid">✅ Paid</option>
                              <option value="failed">❌ Failed</option>
                              <option value="refunded">↩️ Refunded</option>
                            </select>
                          </div>

                          {/* Call User Button - Show when order is ready or preparing */}
                          {(order.status === 'ready' || order.status === 'preparing') && (
                            order.user_phone && order.user_phone !== 'N/A' ? (
                              <a
                                href={`tel:${order.user_phone}`}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-food-lettuce to-food-mustard text-white rounded-lg font-semibold hover:opacity-90 transition-all"
                              >
                                <Phone className="w-4 h-4" />
                                Call {order.user_name?.split(' ')[0] || 'User'}
                              </a>
                            ) : (
                              <div className="text-center text-sm text-gray-500 dark:text-gray-400 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                📵 No phone number
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
