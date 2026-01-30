import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore, useCartStore } from '@/store';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import { Trash2, ShoppingBag, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';

export default function Cart() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items, totalPrice, removeItem, updateQuantity, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    paymentMethod: 'cash',
    pickupTime: '',
    scheduledFor: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async () => {
    if (!formData.pickupTime || !formData.scheduledFor) {
      alert('Please select pickup time and date');
      return;
    }

    if (items.length === 0) {
      alert('Cart is empty');
      return;
    }

    setIsLoading(true);

    try {
      const orderItems = items.map((item) => ({
        foodItemId: item.foodItemId,
        quantity: item.quantity,
        notes: item.notes,
      }));

      const pickupDateTime = new Date(
        `${formData.scheduledFor}T${formData.pickupTime}`
      );

      const { error } = await supabase.from('orders').insert([
        {
          user_id: user?.id,
          items: orderItems,
          paymentMethod: formData.paymentMethod,
          pickupTime: pickupDateTime.toISOString(),
          scheduledFor: formData.scheduledFor,
          notes: formData.notes,
          totalAmount: totalPrice + Math.round(totalPrice * 0.05),
          status: 'pending',
          paymentStatus: 'pending',
          createdAt: new Date().toISOString(),
        },
      ]);

      if (error) {
        alert(error.message || 'Failed to place order');
      } else {
        clearCart();
        router.push(`/orders?success=true`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-black py-12">
        <div className="container mx-auto">
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-3xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Start adding items to place an order
            </p>
            <Link href="/menu" className="btn btn-primary">
              Browse Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-black py-12">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-8">Your Order</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="card p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Order Items</h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.foodItemId}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          ₹{item.price} each
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-lg">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.foodItemId,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            className="px-3 py-1 text-gray-600 dark:text-gray-400"
                          >
                            −
                          </button>
                          <span className="px-3 py-1 font-semibold min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.foodItemId, item.quantity + 1)
                            }
                            className="px-3 py-1 text-gray-600 dark:text-gray-400"
                          >
                            +
                          </button>
                        </div>

                        <span className="font-bold min-w-[4rem] text-right">
                          ₹{item.price * item.quantity}
                        </span>

                        <button
                          onClick={() => removeItem(item.foodItemId)}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900 text-red-500 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Details */}
              <div className="card p-6">
                <h2 className="text-2xl font-bold mb-4">Order Details</h2>
                <div className="space-y-4">
                  {/* Date */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Pickup Date
                    </label>
                    <input
                      type="date"
                      name="scheduledFor"
                      value={formData.scheduledFor}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="input"
                    />
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Pickup Time
                    </label>
                    <input
                      type="time"
                      name="pickupTime"
                      value={formData.pickupTime}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Payment Method
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cash"
                          checked={formData.paymentMethod === 'cash'}
                          onChange={handleChange}
                          className="w-4 h-4"
                        />
                        <span className="ml-2">Pay at Counter (Cash)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="online"
                          checked={formData.paymentMethod === 'online'}
                          onChange={handleChange}
                          className="w-4 h-4"
                        />
                        <span className="ml-2">Online Payment</span>
                      </label>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Special Instructions (Optional)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Any special requests?"
                      className="input h-24 resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="font-semibold">₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Delivery Fee</span>
                    <span className="font-semibold">₹0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tax</span>
                    <span className="font-semibold">
                      ₹{Math.round(totalPrice * 0.05)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-3xl font-black text-accent-500">
                    ₹{totalPrice + Math.round(totalPrice * 0.05)}
                  </span>
                </div>

                <button
                  onClick={handleSubmitOrder}
                  disabled={isLoading}
                  className="w-full btn btn-primary py-3 font-semibold mb-3"
                >
                  {isLoading ? 'Placing Order...' : 'Place Order'}
                </button>

                <button
                  onClick={() => router.push('/menu')}
                  className="w-full btn btn-secondary py-3 font-semibold"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
