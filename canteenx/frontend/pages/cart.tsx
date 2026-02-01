import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore, useCartStore } from '@/store';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingBag, Calendar, Clock, Plus, Minus, CreditCard, Banknote, ArrowRight, Sparkles, ChevronLeft, Phone } from 'lucide-react';
import Link from 'next/link';

// Canteen phone number for contact
const CANTEEN_PHONE = '+919711344559';

// Generate available pickup time slots
const generateTimeSlots = (isToday: boolean) => {
  const slots = [];
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  // Canteen operating hours: start from current time (rounded to next 15 min) to 4:30 PM (16:30)
  const endHour = 16;
  const endMinute = 30;
  
  // Start from 8:00 AM or current time if today
  let startHour = 8;
  let startMinute = 0;
  
  if (isToday) {
    // Round up to next 15 minute slot
    startHour = currentHour;
    startMinute = Math.ceil(currentMinute / 15) * 15;
    if (startMinute >= 60) {
      startHour++;
      startMinute = 0;
    }
  }
  
  // Generate slots in 15-minute intervals
  for (let h = startHour; h <= endHour; h++) {
    for (let m = (h === startHour ? startMinute : 0); m < 60; m += 15) {
      // Stop at 4:30 PM
      if (h === endHour && m > endMinute) break;
      if (h > endHour) break;
      
      const hour12 = h % 12 || 12;
      const ampm = h < 12 ? 'AM' : 'PM';
      const timeValue = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      const timeLabel = `${hour12}:${m.toString().padStart(2, '0')} ${ampm}`;
      
      slots.push({ value: timeValue, label: timeLabel });
    }
  }
  
  return slots;
};

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
      window.location.href = '/login';
    }
  }, [user]);

  if (!user) return null;

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async () => {
    if (!formData.pickupTime || !formData.scheduledFor) {
      const event = new CustomEvent('toast', {
        detail: { message: 'Please select pickup time and date', type: 'error' },
      });
      window.dispatchEvent(event);
      return;
    }

    if (items.length === 0) {
      const event = new CustomEvent('toast', {
        detail: { message: 'Cart is empty', type: 'error' },
      });
      window.dispatchEvent(event);
      return;
    }

    setIsLoading(true);

    try {
      const orderItems = items.map((item) => ({
        food_item_id: item.foodItemId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        notes: item.notes || '',
      }));

      const pickupDateTime = new Date(
        `${formData.scheduledFor}T${formData.pickupTime}`
      );

      // Generate token number (today's date + random 3 digits)
      const today = new Date();
      const dateStr = `${today.getDate().toString().padStart(2, '0')}${(today.getMonth() + 1).toString().padStart(2, '0')}`;
      const randomNum = Math.floor(100 + Math.random() * 900);
      const tokenNumber = `TKN${dateStr}${randomNum}`;

      const orderData = {
        user_id: user?.id,
        user_name: user?.name || '',
        user_email: user?.email || '',
        user_phone: user?.phone || '',
        user_role: user?.role || 'student',
        token_number: tokenNumber,
        items: orderItems,
        payment_method: formData.paymentMethod,
        pickup_time: pickupDateTime.toISOString(),
        scheduled_for: formData.scheduledFor,
        special_instructions: formData.notes || '',
        total_amount: totalPrice,
        status: 'pending',
        payment_status: 'pending',
      };

      console.log('Placing order:', orderData);

      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select();

      console.log('Order response:', { data, error });

      if (error) {
        console.error('Order error:', error);
        const event = new CustomEvent('toast', {
          detail: { message: error.message || 'Failed to place order', type: 'error' },
        });
        window.dispatchEvent(event);
        setIsLoading(false);
      } else {
        // Update inventory - decrease quantity for each ordered item
        for (const item of items) {
          console.log('Updating inventory for:', item.foodItemId);
          
          // Get current quantity
          const { data: foodItem, error: fetchError } = await supabase
            .from('food_items')
            .select('quantity_available')
            .eq('id', item.foodItemId)
            .single();

          console.log('Food item found:', foodItem, 'Error:', fetchError);

          if (foodItem) {
            const newQuantity = Math.max(0, (foodItem.quantity_available || 0) - item.quantity);
            
            console.log('New quantity:', newQuantity);
            
            // Update quantity and availability
            const { error: updateError } = await supabase
              .from('food_items')
              .update({
                quantity_available: newQuantity,
                available: newQuantity > 0,
              })
              .eq('id', item.foodItemId);
              
            console.log('Update result:', updateError ? updateError : 'Success');
          }
        }

        const event = new CustomEvent('toast', {
          detail: { message: `Order placed! Token: ${tokenNumber} 🎉`, type: 'success' },
        });
        window.dispatchEvent(event);
        clearCart();
        setTimeout(() => {
          window.location.href = `/orders?success=true&token=${tokenNumber}&showContact=true`;
        }, 500);
      }
    } catch (err: any) {
      console.error('Order exception:', err);
      const event = new CustomEvent('toast', {
        detail: { message: err.message || 'Something went wrong', type: 'error' },
      });
      window.dispatchEvent(event);
      setIsLoading(false);
    }
  };

  // No service fee
  const grandTotal = totalPrice;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-black relative">
        <div className="absolute inset-0 food-pattern opacity-30"></div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md mx-auto"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-food-mustard/10 to-food-tomato/10 rounded-3xl flex items-center justify-center"
            >
              <ShoppingBag className="w-12 h-12 text-food-mustard" />
            </motion.div>
            <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-3">
              Your cart is empty
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              Looks like you haven't added any delicious items yet!
            </p>
            <Link href="/menu">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(243, 156, 18, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-2xl font-heading font-bold bg-gradient-to-r from-food-mustard to-food-tomato text-white shadow-lg flex items-center gap-2 mx-auto"
              >
                Browse Menu <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-black relative">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-food-mustard/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-food-lettuce/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link href="/menu" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-food-mustard transition-colors font-heading font-medium">
            <ChevronLeft className="w-5 h-5" />
            Back to Menu
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-food-mustard to-food-tomato flex items-center justify-center shadow-glow">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white">
                Your Order
              </h1>
              <p className="text-gray-500 dark:text-gray-400">{items.length} item{items.length > 1 ? 's' : ''} in cart</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Items Card */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-soft border border-gray-100 dark:border-gray-800">
                <h2 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-food-mustard" />
                  Order Items
                </h2>
                <div className="space-y-4">
                  <AnimatePresence>
                    {items.map((item, index) => (
                      <motion.div
                        key={item.foodItemId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl group hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
                      >
                        {/* Food emoji placeholder */}
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-food-mustard/20 to-food-tomato/20 flex items-center justify-center text-2xl flex-shrink-0">
                          🍽️
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-heading font-semibold text-gray-900 dark:text-white truncate">{item.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            ₹{item.price} each
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Quantity controls */}
                          <div className="flex items-center bg-white dark:bg-gray-700 rounded-xl shadow-soft overflow-hidden">
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.foodItemId, Math.max(1, item.quantity - 1))}
                              className="p-2 text-gray-600 dark:text-gray-400 hover:text-food-tomato hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </motion.button>
                            <span className="px-3 font-heading font-bold min-w-[2.5rem] text-center">
                              {item.quantity}
                            </span>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.foodItemId, Math.min(item.quantity + 1, item.maxQuantity || 999))}
                              disabled={item.quantity >= (item.maxQuantity || 999)}
                              className="p-2 text-gray-600 dark:text-gray-400 hover:text-food-lettuce hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="w-4 h-4" />
                            </motion.button>
                          </div>

                          <span className="font-heading font-bold text-lg min-w-[4rem] text-right text-gray-900 dark:text-white">
                            ₹{item.price * item.quantity}
                          </span>

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeItem(item.foodItemId)}
                            className="p-2 text-gray-400 hover:text-food-tomato hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Order Details Card */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-soft border border-gray-100 dark:border-gray-800">
                <h2 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-food-mustard" />
                  Pickup Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Date */}
                  <div>
                    <label className="block text-sm font-heading font-semibold mb-2 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-food-mustard" /> Pickup Date
                    </label>
                    <input
                      type="date"
                      name="scheduledFor"
                      value={formData.scheduledFor}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-food-mustard dark:focus:border-food-mustard focus:ring-4 focus:ring-food-mustard/10 transition-all outline-none font-medium"
                    />
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block text-sm font-heading font-semibold mb-2 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-food-mustard" /> Pickup Time
                      <span className="text-xs text-gray-400 font-normal">(Until 4:30 PM)</span>
                    </label>
                    <select
                      name="pickupTime"
                      value={formData.pickupTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-food-mustard dark:focus:border-food-mustard focus:ring-4 focus:ring-food-mustard/10 transition-all outline-none font-medium"
                    >
                      <option value="">Select pickup time</option>
                      {generateTimeSlots(formData.scheduledFor === new Date().toISOString().split('T')[0]).map((slot) => (
                        <option key={slot.value} value={slot.value}>
                          {slot.label}
                        </option>
                      ))}
                    </select>
                    {generateTimeSlots(formData.scheduledFor === new Date().toISOString().split('T')[0]).length === 0 && (
                      <p className="text-xs text-food-tomato mt-1">Canteen is closed for today. Please select tomorrow.</p>
                    )}
                  </div>

                  {/* Payment Method */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-heading font-semibold mb-3 text-gray-700 dark:text-gray-300">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'cash', label: 'Cash on Pickup', icon: Banknote, emoji: '💵' },
                        { value: 'upi', label: 'UPI Payment', icon: CreditCard, emoji: '📱' },
                      ].map((method) => (
                        <motion.button
                          key={method.value}
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.value }))}
                          className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                            formData.paymentMethod === method.value
                              ? 'border-food-mustard bg-food-mustard/5 text-food-mustard'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <span className="text-2xl">{method.emoji}</span>
                          <span className="font-heading font-medium">{method.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-heading font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Special Instructions (Optional)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-food-mustard dark:focus:border-food-mustard focus:ring-4 focus:ring-food-mustard/10 transition-all outline-none font-medium resize-none"
                      placeholder="Any special requests or dietary requirements..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-soft border border-gray-100 dark:border-gray-800 sticky top-24"
              >
                <h2 className="text-xl font-heading font-bold mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal ({items.length} items)</span>
                    <span className="font-semibold">₹{totalPrice}</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex justify-between text-xl font-heading font-bold text-gray-900 dark:text-white">
                      <span>Total</span>
                      <span className="gradient-text">₹{grandTotal}</span>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(243, 156, 18, 0.3)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmitOrder}
                  disabled={isLoading || !formData.pickupTime}
                  className="w-full py-4 rounded-2xl font-heading font-bold text-lg bg-gradient-to-r from-food-mustard to-food-tomato text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      ></motion.div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Place Order <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>

                {!formData.pickupTime && (
                  <p className="text-center text-sm text-food-tomato mt-3">
                    Please select a pickup time
                  </p>
                )}

                {/* Trust badges */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-center gap-4 text-gray-400 text-sm">
                    <span className="flex items-center gap-1">🔒 Secure</span>
                    <span className="flex items-center gap-1">⚡ Fast</span>
                    <span className="flex items-center gap-1">✓ Verified</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
