import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store';
import { supabase } from '@/lib/supabaseClient';
import { Order } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, Clock, AlertCircle, Package, ShoppingBag, 
  ChefHat, Truck, XCircle, Filter, Search, ArrowRight,
  Calendar, CreditCard, Utensils, Phone, X
} from 'lucide-react';

// Canteen phone number
const CANTEEN_PHONE = '+919711344559';

const statusConfig = {
  pending: { 
    icon: Clock, 
    color: 'text-food-mustard', 
    bg: 'bg-food-mustard/10', 
    border: 'border-food-mustard/20',
    label: 'Pending',
    emoji: '⏳'
  },
  confirmed: { 
    icon: CheckCircle, 
    color: 'text-blue-500', 
    bg: 'bg-blue-500/10', 
    border: 'border-blue-500/20',
    label: 'Confirmed',
    emoji: '✅'
  },
  preparing: { 
    icon: ChefHat, 
    color: 'text-food-spice', 
    bg: 'bg-food-spice/10', 
    border: 'border-food-spice/20',
    label: 'Preparing',
    emoji: '👨‍🍳'
  },
  ready: { 
    icon: Package, 
    color: 'text-food-lettuce', 
    bg: 'bg-food-lettuce/10', 
    border: 'border-food-lettuce/20',
    label: 'Ready',
    emoji: '📦'
  },
  completed: { 
    icon: CheckCircle, 
    color: 'text-food-lettuce', 
    bg: 'bg-food-lettuce/10', 
    border: 'border-food-lettuce/20',
    label: 'Completed',
    emoji: '🎉'
  },
  cancelled: { 
    icon: XCircle, 
    color: 'text-food-tomato', 
    bg: 'bg-food-tomato/10', 
    border: 'border-food-tomato/20',
    label: 'Cancelled',
    emoji: '❌'
  },
};

const filterOptions = ['all', 'pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];

export default function Orders() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [successToken, setSuccessToken] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching orders:', error.message);
        setOrders([]);
      } else {
        const mappedOrders = (data || []).map((order: any) => ({
          ...order,
          _id: order.id,
          orderNumber: order.order_number || order.id?.slice(-8).toUpperCase(),
          totalAmount: order.total_amount,
          paymentMethod: order.payment_method,
          paymentStatus: order.payment_status,
          pickupTime: order.pickup_time,
          scheduledFor: order.scheduled_for,
          createdAt: order.created_at,
          tokenNumber: order.token_number,
        }));
        setOrders(mappedOrders);
      }
      setIsLoading(false);
    };

    fetchOrders();

    // Check for success message with token
    if (router.query.success && router.query.token) {
      setSuccessToken(router.query.token as string);
      if (router.query.showContact) {
        setShowContactModal(true);
      }
      const event = new CustomEvent('toast', {
        detail: { message: `Order placed! Your Token: ${router.query.token}`, type: 'success' },
      });
      window.dispatchEvent(event);
      // Clean URL
      router.replace('/orders', undefined, { shallow: true });
    }
  }, [user, router]);

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch = order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items?.some(item => item.foodItem?.name?.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  if (!user) return null;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Contact Canteen Modal */}
      <AnimatePresence>
        {showContactModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowContactModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                  className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-food-lettuce to-food-mustard rounded-full flex items-center justify-center"
                >
                  <span className="text-4xl">🎉</span>
                </motion.div>
                <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                  Order Placed Successfully!
                </h2>
                {successToken && (
                  <div className="bg-food-mustard/10 rounded-xl p-3 mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Your Token Number</p>
                    <p className="text-2xl font-heading font-bold text-food-mustard">{successToken}</p>
                  </div>
                )}
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Need to contact the canteen about your order?
                </p>
                <div className="space-y-3">
                  <motion.a
                    href={`tel:${CANTEEN_PHONE}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-2xl font-heading font-bold text-lg bg-gradient-to-r from-food-lettuce to-food-mustard text-white shadow-lg flex items-center justify-center gap-3"
                  >
                    <Phone className="w-5 h-5" />
                    Call Canteen
                  </motion.a>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowContactModal(false)}
                    className="w-full py-3 rounded-xl font-heading font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700"
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-black">
        <div className="absolute inset-0 food-pattern opacity-5"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-food-mustard/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-food-lettuce/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-heading font-black mb-2">
                My Orders <span className="text-3xl">📋</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track and manage your food orders
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-soft border border-gray-100 dark:border-gray-700">
                <div className="text-2xl font-heading font-bold text-food-mustard">{orders.length}</div>
                <div className="text-xs text-gray-500">Total Orders</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-soft border border-gray-100 dark:border-gray-700">
                <div className="text-2xl font-heading font-bold text-food-lettuce">
                  {orders.filter(o => o.status === 'completed').length}
                </div>
                <div className="text-xs text-gray-500">Completed</div>
              </div>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-soft border border-gray-100 dark:border-gray-700 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by order number or item..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-food-mustard dark:focus:border-food-mustard focus:ring-4 focus:ring-food-mustard/10 transition-all outline-none"
                />
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
                {filterOptions.map((option) => (
                  <motion.button
                    key={option}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilter(option)}
                    className={`px-4 py-2 rounded-xl text-sm font-heading font-semibold whitespace-nowrap transition-all ${
                      filter === option
                        ? 'bg-gradient-to-r from-food-mustard to-food-tomato text-white shadow-glow'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {option === 'all' ? '🍽️ All' : `${statusConfig[option as keyof typeof statusConfig]?.emoji} ${option.charAt(0).toUpperCase() + option.slice(1)}`}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Orders List */}
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-gray-700">
                  <div className="animate-pulse">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                      <div className="flex-1 space-y-3">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                      <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="space-y-4">
              <AnimatePresence>
                {filteredOrders.map((order, i) => {
                  const config = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
                  const StatusIcon = config.icon;
                  const isExpanded = expandedOrder === order.id;

                  return (
                    <motion.div
                      key={order.id || order._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                      layout
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer hover:shadow-lg transition-all"
                    >
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          {/* Order Icon */}
                          <motion.div
                            whileHover={{ rotate: 10 }}
                            className={`w-16 h-16 rounded-2xl ${config.bg} ${config.border} border-2 flex items-center justify-center text-3xl flex-shrink-0`}
                          >
                            {config.emoji}
                          </motion.div>

                          {/* Order Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-heading font-bold">
                                Order #{order.orderNumber}
                              </h3>
                              <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.color} ${config.border} border`}>
                                <StatusIcon className="w-3 h-3" />
                                {config.label}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(order.createdAt).toLocaleDateString()}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {new Date(order.pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <CreditCard className="w-4 h-4" />
                                {order.paymentMethod === 'cash' ? '💵 Cash' : '💳 UPI'}
                              </span>
                            </div>
                          </div>

                          {/* Amount */}
                          <div className="text-right flex-shrink-0">
                            <div className="text-2xl font-heading font-bold bg-gradient-to-r from-food-mustard to-food-tomato bg-clip-text text-transparent">
                              ₹{order.totalAmount}
                            </div>
                            <div className="text-xs text-gray-500">{order.items?.length || 0} items</div>
                          </div>
                        </div>

                        {/* Expanded Content */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700"
                            >
                              <h4 className="font-heading font-semibold mb-3 flex items-center gap-2">
                                <Utensils className="w-4 h-4 text-food-mustard" />
                                Order Items
                              </h4>
                              <div className="space-y-3">
                                {order.items?.map((item, idx) => (
                                  <div
                                    key={item.foodItem?.id || item.foodItem?._id || idx}
                                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 bg-food-mustard/10 rounded-lg flex items-center justify-center text-lg">
                                        🍽️
                                      </div>
                                      <div>
                                        <p className="font-medium">{item.foodItem?.name || 'Unknown item'}</p>
                                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                      </div>
                                    </div>
                                    <p className="font-heading font-semibold">
                                      ₹{(item.foodItem?.price || 0) * item.quantity}
                                    </p>
                                  </div>
                                ))}
                              </div>

                              {/* Progress Steps */}
                              {order.status !== 'cancelled' && (
                                <div className="mt-6">
                                  <h4 className="font-heading font-semibold mb-4">Order Progress</h4>
                                  <div className="flex items-center justify-between">
                                    {['pending', 'confirmed', 'preparing', 'ready', 'completed'].map((step, idx) => {
                                      const stepConfig = statusConfig[step as keyof typeof statusConfig];
                                      const isActive = ['pending', 'confirmed', 'preparing', 'ready', 'completed'].indexOf(order.status) >= idx;
                                      return (
                                        <div key={step} className="flex flex-col items-center flex-1">
                                          <motion.div
                                            initial={false}
                                            animate={{ scale: isActive ? 1 : 0.8 }}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
                                              isActive ? stepConfig.bg : 'bg-gray-100 dark:bg-gray-700'
                                            }`}
                                          >
                                            {stepConfig.emoji}
                                          </motion.div>
                                          <span className={`text-xs mt-2 ${isActive ? 'font-semibold' : 'text-gray-400'}`}>
                                            {stepConfig.label}
                                          </span>
                                          {idx < 4 && (
                                            <div className={`absolute w-full h-1 top-5 ${isActive ? 'bg-food-lettuce' : 'bg-gray-200 dark:bg-gray-700'}`} />
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* Contact Canteen Button */}
                              {order.status !== 'completed' && order.status !== 'cancelled' && (
                                <motion.a
                                  href={`tel:${CANTEEN_PHONE}`}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={(e) => e.stopPropagation()}
                                  className="mt-6 w-full py-3 rounded-xl font-heading font-semibold bg-gradient-to-r from-food-mustard/10 to-food-tomato/10 text-food-mustard border-2 border-food-mustard/20 flex items-center justify-center gap-2 hover:bg-food-mustard hover:text-white transition-all"
                                >
                                  <Phone className="w-4 h-4" />
                                  Contact Canteen
                                </motion.a>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-8xl mb-6"
              >
                🍽️
              </motion.div>
              <h2 className="text-3xl font-heading font-black mb-3">
                {searchQuery || filter !== 'all' ? 'No matching orders' : 'No orders yet'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                {searchQuery || filter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Your first delicious meal is just a few clicks away. Start exploring our menu!'}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {(searchQuery || filter !== 'all') && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setSearchQuery(''); setFilter('all'); }}
                    className="px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-heading font-semibold"
                  >
                    Clear Filters
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(243, 156, 18, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/menu')}
                  className="px-8 py-3 bg-gradient-to-r from-food-mustard to-food-tomato text-white font-heading font-bold rounded-xl shadow-lg flex items-center gap-2"
                >
                  Browse Menu <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
