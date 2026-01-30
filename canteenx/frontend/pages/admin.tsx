import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store';
import { foodAPI, orderAPI } from '@/lib/api';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, TrendingUp, ShoppingBag, Users } from 'lucide-react';

import { supabase } from '@/lib/supabaseClient';

// UsersTab component for admin approval
function UsersTab() {
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchPendingUsers = async () => {
    setLoading(true);
    // Fetch users with is_approved: false and role student/teacher
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) return setLoading(false);
    const filtered = (data?.users || []).filter(
      (u) =>
        (u.user_metadata?.role === 'student' || u.user_metadata?.role === 'teacher') &&
        !u.user_metadata?.is_approved
    );
    setPendingUsers(filtered);
    setLoading(false);
  };
  useEffect(() => { fetchPendingUsers(); }, []);
  const handleApprove = async (userId: string) => {
    await supabase.auth.admin.updateUserById(userId, { user_metadata: { is_approved: true } });
    fetchPendingUsers();
  };
  const handleReject = async (userId: string) => {
    await supabase.auth.admin.deleteUser(userId);
    fetchPendingUsers();
  };
  if (loading) return <div>Loading users...</div>;
  if (pendingUsers.length === 0) return <div>No pending users.</div>;
  return (
    <div className="space-y-4">
      {pendingUsers.map((u) => (
        <div key={u.id} className="card p-4 flex items-center justify-between">
          <div>
            <div className="font-bold">{u.user_metadata?.name || u.email}</div>
            <div className="text-sm text-gray-600">{u.user_metadata?.role} | {u.email}</div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleApprove(u.id)} className="btn btn-accent">Approve</button>
            <button onClick={() => handleReject(u.id)} className="btn btn-secondary">Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Admin() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [foodItems, setFoodItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'lunch',
    quantityTotal: '',
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchData();
  }, [user, router]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [foodRes, ordersRes, statsRes] = await Promise.all([
        foodAPI.getAll(),
        orderAPI.getAll(),
        orderAPI.getStats(),
      ]);

      setFoodItems(foodRes.data.data);
      setOrders(ordersRes.data.data);
      setStats(statsRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || user.role !== 'admin') return null;

  const handleAddItem = async (e: any) => {
    e.preventDefault();
    try {
      await foodAPI.create(formData);
      setFormData({ name: '', description: '', price: '', category: 'lunch', quantityTotal: '' });
      setShowAddForm(false);
      fetchData();
    } catch (error) {
      alert('Error adding food item');
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (confirm('Are you sure?')) {
      try {
        await foodAPI.delete(id);
        fetchData();
      } catch (error) {
        alert('Error deleting item');
      }
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await orderAPI.updateStatus(orderId, { status: newStatus });
      fetchData();
    } catch (error) {
      alert('Error updating status');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-black py-8">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage canteen operations</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {['overview', 'menu', 'orders', ...(user?.role === 'admin' ? ['users'] : [])].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
            {/* Users Tab */}
            {activeTab === 'users' && (
              <UsersTab />
            )}

        {isLoading ? (
          <div className="text-center py-20">Loading...</div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                  { icon: ShoppingBag, label: 'Total Orders', value: (stats as any)?.totalOrders },
                  { icon: TrendingUp, label: 'Today Orders', value: (stats as any)?.todayOrders },
                  { icon: Users, label: 'Total Revenue', value: `₹${(stats as any)?.totalRevenue}` },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="card p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">{item.label}</p>
                        <p className="text-3xl font-bold">{item.value}</p>
                      </div>
                      <item.icon className="w-12 h-12 text-primary-600 dark:text-primary-400 opacity-20" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Menu Tab */}
            {activeTab === 'menu' && (
              <div>
                <div className="mb-6">
                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="btn btn-primary flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Food Item
                  </button>
                </div>

                {showAddForm && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card p-6 mb-6"
                  >
                    <h3 className="text-xl font-bold mb-4">Add New Food Item</h3>
                    <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Item Name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="input col-span-1"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        className="input"
                        required
                      />
                      <textarea
                        placeholder="Description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        className="input col-span-2 h-20"
                        required
                      ></textarea>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="input"
                      >
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="snacks">Snacks</option>
                        <option value="beverages">Beverages</option>
                        <option value="desserts">Desserts</option>
                      </select>
                      <input
                        type="number"
                        placeholder="Quantity Available"
                        value={formData.quantityTotal}
                        onChange={(e) =>
                          setFormData({ ...formData, quantityTotal: e.target.value })
                        }
                        className="input"
                        required
                      />
                      <div className="col-span-2 flex gap-2">
                        <button type="submit" className="flex-1 btn btn-accent">
                          Add Item
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddForm(false)}
                          className="flex-1 btn btn-secondary"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                <div className="space-y-4">
                  {foodItems.map((item: any) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="card p-4 flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <h3 className="font-bold">{item.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          ₹{item.price} | {item.quantityAvailable} available
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item._id)}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900 text-red-500 rounded-lg"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {orders.map((order: any) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="card p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold">Order #{order.orderNumber}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {order.user?.name} | ₹{order.totalAmount}
                        </p>
                      </div>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        className="input py-2 w-32"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div className="space-y-2 text-sm">
                      {order.items.map((item: any) => (
                        <div key={item.foodItem._id}>
                          {item.quantity}x {item.foodItem.name}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
