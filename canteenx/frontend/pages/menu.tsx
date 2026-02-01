import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore, useCartStore } from '@/store';
import { supabase } from '@/lib/supabaseClient';
import { FoodItem } from '@/types';
import FoodCard from '@/components/FoodCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, Sparkles, Flame, Leaf, X } from 'lucide-react';

const categories = [
  { id: 'all', name: 'All Items', emoji: '🍽️' },
  { id: 'breakfast', name: 'Breakfast', emoji: '🌅' },
  { id: 'lunch', name: 'Lunch', emoji: '🍛' },
  { id: 'snacks', name: 'Snacks', emoji: '🍿' },
  { id: 'beverages', name: 'Beverages', emoji: '🥤' },
  { id: 'desserts', name: 'Desserts', emoji: '🍰' },
];

export default function Menu() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { addItem } = useCartStore();
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    vegetarian: false,
    vegan: false,
    spicy: false,
    inStock: false,
  });

  useEffect(() => {
    const fetchFoodItems = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.from('food_items').select('*');
      if (error) {
        console.error('Error fetching food items:', error.message);
        setFoodItems([]);
      } else {
        // Map snake_case columns to camelCase
        const mappedData = (data || []).map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category,
          image: item.image,
          available: item.available ?? true,
          quantityAvailable: item.quantity_available ?? item.quantityAvailable ?? 100,
          preparationTime: item.preparation_time ?? item.preparationTime ?? 15,
          isVegetarian: item.is_vegetarian ?? item.isVegetarian ?? false,
          isVegan: item.is_vegan ?? item.isVegan ?? false,
          isSpicy: item.is_spicy ?? item.isSpicy ?? false,
          rating: item.rating ?? 0,
          totalRatings: item.total_ratings ?? item.totalRatings ?? 0,
        }));
        setFoodItems(mappedData);
      }
      setIsLoading(false);
    };

    fetchFoodItems();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...foodItems];

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(item => item.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
      );
    }

    // Additional filters
    if (filters.vegetarian) result = result.filter(item => item.isVegetarian);
    if (filters.vegan) result = result.filter(item => item.isVegan);
    if (filters.spicy) result = result.filter(item => item.isSpicy);
    if (filters.inStock) result = result.filter(item => item.available && item.quantityAvailable > 0);

    setFilteredItems(result);
  }, [foodItems, selectedCategory, searchQuery, filters]);

  const handleAddToCart = (item: FoodItem, quantity: number) => {
    // Check if user is logged in
    if (!user) {
      const event = new CustomEvent('toast', {
        detail: { message: 'Please login to add items to cart!', type: 'error' },
      });
      window.dispatchEvent(event);
      router.push('/login');
      return;
    }

    // Check if quantity is within available limit
    if (quantity > item.quantityAvailable) {
      const event = new CustomEvent('toast', {
        detail: { message: `Only ${item.quantityAvailable} available!`, type: 'error' },
      });
      window.dispatchEvent(event);
      return;
    }

    addItem({
      foodItemId: item.id || item._id || '',
      name: item.name,
      quantity,
      price: item.price,
      maxQuantity: item.quantityAvailable,
    });

    // Show toast notification
    const event = new CustomEvent('toast', {
      detail: { message: `${item.name} added to cart!`, type: 'success' },
    });
    window.dispatchEvent(event);
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-black relative">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-food-mustard/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-food-tomato/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-food-mustard/10 border border-food-mustard/20 text-food-mustard text-sm font-heading font-semibold mb-4"
              >
                <Sparkles className="w-4 h-4" />
                Fresh & Ready
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                Today's <span className="gradient-text">Menu</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {user ? `Hey ${user?.name?.split(' ')[0]}! 👋 ` : ''}What are you craving today?
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-food-mustard dark:focus:border-food-mustard focus:ring-4 focus:ring-food-mustard/10 transition-all outline-none font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="font-heading font-semibold text-gray-700 dark:text-gray-300">Categories</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-heading font-medium text-sm transition-all ${
                showFilters || activeFiltersCount > 0
                  ? 'bg-food-mustard text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-white text-food-mustard text-xs flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </motion.button>
          </div>

          {/* Category Pills */}
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((category, i) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-heading font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-food-mustard to-food-tomato text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <span className="text-lg">{category.emoji}</span>
                {category.name}
              </motion.button>
            ))}
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                  {[
                    { key: 'vegetarian', label: 'Vegetarian', icon: Leaf, color: 'green' },
                    { key: 'vegan', label: 'Vegan', icon: Leaf, color: 'emerald' },
                    { key: 'spicy', label: 'Spicy', icon: Flame, color: 'red' },
                    { key: 'inStock', label: 'In Stock Only', icon: Sparkles, color: 'yellow' },
                  ].map((filter) => (
                    <motion.button
                      key={filter.key}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setFilters(prev => ({ ...prev, [filter.key]: !prev[filter.key as keyof typeof filters] }))}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-heading font-medium text-sm transition-all ${
                        filters[filter.key as keyof typeof filters]
                          ? `bg-${filter.color}-100 dark:bg-${filter.color}-900/30 text-${filter.color}-700 dark:text-${filter.color}-400 border-2 border-${filter.color}-300 dark:border-${filter.color}-700`
                          : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <filter.icon className="w-4 h-4" />
                      {filter.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-700 dark:text-gray-300">{filteredItems.length}</span> items
            {searchQuery && <span> for "{searchQuery}"</span>}
          </p>
        </motion.div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden"
              >
                <div className="h-48 bg-gray-200 dark:bg-gray-700 shimmer"></div>
                <div className="p-5 space-y-3">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 shimmer"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-full shimmer"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-2/3 shimmer"></div>
                  <div className="flex justify-between items-center pt-4">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-20 shimmer"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl w-24 shimmer"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredItems.map((item, i) => (
                <motion.div
                  key={item.id || item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  layout
                >
                  <FoodCard item={item} onAddToCart={handleAddToCart} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-2xl font-heading font-bold text-gray-700 dark:text-gray-300 mb-2">
              No items found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchQuery ? `No results for "${searchQuery}"` : 'Try adjusting your filters'}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setFilters({ vegetarian: false, vegan: false, spicy: false, inStock: false });
              }}
              className="px-6 py-3 rounded-xl font-heading font-semibold bg-gradient-to-r from-food-mustard to-food-tomato text-white shadow-lg"
            >
              Clear all filters
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
