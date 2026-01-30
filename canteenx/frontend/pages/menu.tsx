import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore, useCartStore } from '@/store';
import { supabase } from '@/lib/supabaseClient';
import { FoodItem } from '@/types';
import FoodCard from '@/components/FoodCard';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';

export default function Menu() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { addItem } = useCartStore();
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchFoodItems = async () => {
      setIsLoading(true);
      let query = supabase.from('food_items').select('*');
      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }
      const { data, error } = await query;
      if (error) {
        console.error('Error fetching food items:', error.message);
        setFoodItems([]);
      } else {
        setFoodItems(data || []);
      }
      setIsLoading(false);
    };

    fetchFoodItems();
  }, [user, selectedCategory, router]);

  const handleAddToCart = (item: FoodItem, quantity: number) => {
    addItem({
      foodItemId: item._id,
      name: item.name,
      quantity,
      price: item.price,
    });

    // Show toast notification
    const event = new CustomEvent('toast', {
      detail: { message: `${item.name} added to cart!`, type: 'success' },
    });
    window.dispatchEvent(event);
  };

  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'breakfast', name: '🌅 Breakfast' },
    { id: 'lunch', name: '🍛 Lunch' },
    { id: 'snacks', name: '🍿 Snacks' },
    { id: 'beverages', name: '🥤 Beverages' },
    { id: 'desserts', name: '🍰 Desserts' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-black py-12">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-2">Today's Menu</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Welcome, {user?.name}! Browse and pre-order your favorite meals.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5" />
            <span className="font-semibold">Filter by Category</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card h-80 bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
            ))}
          </div>
        ) : foodItems.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {foodItems.map((item, i) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              >
                <FoodCard item={item} onAddToCart={handleAddToCart} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-400">
              No items available in this category
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
