import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store';
import { supabase } from '@/lib/supabaseClient';
import { Order } from '@/types';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, Package } from 'lucide-react';

const statusConfig = {
  pending: { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/30', label: 'Pending' },
  confirmed: { icon: CheckCircle, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/30', label: 'Confirmed' },
  preparing: { icon: Package, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/30', label: 'Preparing' },
  ready: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/30', label: 'Ready' },
  completed: { icon: CheckCircle, color: 'text-accent-500', bg: 'bg-accent-50 dark:bg-accent-900/30', label: 'Completed' },
  cancelled: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/30', label: 'Cancelled' },
};

export default function Orders() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('createdAt', { ascending: false });
      if (error) {
        console.error('Error fetching orders:', error.message);
        setOrders([]);
      } else {
        setOrders(data || []);
      }
      setIsLoading(false);
    };

    fetchOrders();
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-black py-12">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-2">My Orders</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Track and manage your food orders
          </p>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="card h-32 bg-gray-200 dark:bg-gray-800 animate-pulse"
                ></div>
              ))}
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order, i) => {
                const config = statusConfig[order.status as keyof typeof statusConfig];
                const StatusIcon = config.icon;

                return (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="card p-6 hover:shadow-soft-lg cursor-pointer"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Order Number and Items */}
                      <div>
                        <h3 className="text-lg font-bold mb-2">
                          Order #{order.orderNumber}
                        </h3>
                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          {order.items.map((item) => (
                            <div key={item.foodItem._id}>
                              {item.quantity}x {item.foodItem.name}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Amount and Date */}
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Amount
                        </p>
                        <p className="text-2xl font-bold text-accent-600">
                          ₹{order.totalAmount}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Status */}
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Status
                        </p>
                        <div
                          className={`flex items-center gap-2 px-3 py-1 rounded-lg w-fit ${config.bg}`}
                        >
                          <StatusIcon className={`w-4 h-4 ${config.color}`} />
                          <span className="font-semibold text-sm">{config.label}</span>
                        </div>
                      </div>

                      {/* Pickup Time */}
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Pickup Time
                        </p>
                        <p className="font-semibold">
                          {new Date(order.pickupTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          {order.paymentMethod === 'cash'
                            ? '💵 Cash'
                            : '💳 Online'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-3xl font-bold mb-2">No orders yet</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Start ordering delicious food from the canteen
              </p>
              <button
                onClick={() => router.push('/menu')}
                className="btn btn-primary"
              >
                Browse Menu
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
