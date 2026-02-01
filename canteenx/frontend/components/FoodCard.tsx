import { FoodItem } from '@/types';
import { ShoppingCart, Heart, Star, Flame, Leaf, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface FoodCardProps {
  item: FoodItem;
  onAddToCart: (item: FoodItem, quantity: number) => void;
}

export default function FoodCard({ item, onAddToCart }: FoodCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    onAddToCart(item, quantity);
    setTimeout(() => {
      setQuantity(1);
      setIsAdding(false);
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4 }}
      className="group relative bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-soft hover:shadow-soft-xl transition-all duration-500"
    >
      {/* Decorative gradient border */}
      <div className="absolute inset-0 bg-gradient-to-br from-food-mustard/20 via-transparent to-food-tomato/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
      
      {/* Image Container */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
        <Image
          src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Like button */}
        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-4 right-4 p-2.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg z-10"
        >
          <motion.div
            animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isLiked ? 'fill-food-tomato text-food-tomato' : 'text-gray-400'
              }`}
            />
          </motion.div>
        </motion.button>

        {/* Category badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-200 shadow-lg capitalize">
            {item.category === 'breakfast' && '🌅'} 
            {item.category === 'lunch' && '🍛'} 
            {item.category === 'snacks' && '🍿'} 
            {item.category === 'beverages' && '🥤'} 
            {item.category === 'desserts' && '🍰'} 
            {item.category}
          </span>
        </div>
        
        {/* Sold out overlay */}
        {!item.available && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-4 py-2 bg-food-tomato text-white font-heading font-bold rounded-full shadow-xl"
            >
              😔 Sold Out
            </motion.span>
          </div>
        )}

        {/* Steam animation for hot items */}
        {item.category !== 'beverages' && item.available && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="w-1 h-4 bg-white/40 rounded-full animate-steam" style={{ animationDelay: '0s' }}></span>
            <span className="w-1 h-4 bg-white/40 rounded-full animate-steam" style={{ animationDelay: '0.3s' }}></span>
            <span className="w-1 h-4 bg-white/40 rounded-full animate-steam" style={{ animationDelay: '0.6s' }}></span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 relative z-10">
        {/* Title and description */}
        <div className="mb-3">
          <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white mb-1 group-hover:text-food-tomato transition-colors">
            {item.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex gap-2 mb-3 flex-wrap">
          {item.isVegetarian && (
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
            >
              <Leaf className="w-3 h-3" /> Veg
            </motion.span>
          )}
          {item.isVegan && (
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
            >
              🌿 Vegan
            </motion.span>
          )}
          {item.isSpicy && (
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
            >
              <Flame className="w-3 h-3" /> Spicy
            </motion.span>
          )}
        </div>

        {/* Rating */}
        {item.totalRatings > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-food-cheese/10">
              <Star className="w-4 h-4 fill-food-cheese text-food-cheese" />
              <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{item.rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-gray-400">
              ({item.totalRatings} reviews)
            </span>
          </div>
        )}

        {/* Price and Stock */}
        <div className="flex justify-between items-end mb-4">
          <div>
            <span className="text-3xl font-heading font-black bg-gradient-to-r from-food-mustard to-food-tomato bg-clip-text text-transparent">
              ₹{item.price}
            </span>
          </div>
          <div className="text-right">
            <span className={`text-xs font-medium ${
              item.quantityAvailable > 10 
                ? 'text-green-600 dark:text-green-400' 
                : item.quantityAvailable > 0 
                  ? 'text-orange-500' 
                  : 'text-red-500'
            }`}>
              {item.quantityAvailable > 10 
                ? '✓ In Stock' 
                : item.quantityAvailable > 0 
                  ? `Only ${item.quantityAvailable} left!` 
                  : 'Out of stock'}
            </span>
          </div>
        </div>

        {/* Add to Cart Section */}
        {item.available ? (
          <div className="flex gap-3">
            {/* Quantity Selector */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 text-gray-600 dark:text-gray-400 hover:text-food-tomato hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </motion.button>
              <motion.span 
                key={quantity}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                className="px-3 font-heading font-bold min-w-[2.5rem] text-center"
              >
                {quantity}
              </motion.span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setQuantity(Math.min(item.quantityAvailable, quantity + 1))}
                className="p-3 text-gray-600 dark:text-gray-400 hover:text-food-lettuce hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>
            
            {/* Add to Cart Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={isAdding}
              className="flex-1 py-3 px-4 rounded-xl font-heading font-semibold bg-gradient-to-r from-food-mustard to-food-tomato text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              <AnimatePresence mode="wait">
                {isAdding ? (
                  <motion.span
                    key="adding"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2"
                  >
                    ✓ Added!
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        ) : (
          <button 
            disabled 
            className="w-full py-3 px-4 rounded-xl font-heading font-semibold bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
          >
            Currently Unavailable
          </button>
        )}
      </div>
    </motion.div>
  );
}
