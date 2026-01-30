import { FoodItem } from '@/types';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

interface FoodCardProps {
  item: FoodItem;
  onAddToCart: (item: FoodItem, quantity: number) => void;
}

export default function FoodCard({ item, onAddToCart }: FoodCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(item, quantity);
    setQuantity(1);
  };

  return (
    <div className="card h-full flex flex-col hover:shadow-soft-lg">
      {/* Image */}
      <div className="relative h-40 bg-gray-200 dark:bg-gray-800 overflow-hidden">
        <Image
          src={item.image || 'https://via.placeholder.com/300x200'}
          alt={item.name}
          fill
          className="object-cover"
        />
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-3 right-3 p-2 bg-white dark:bg-gray-800 rounded-full hover:scale-110 transition-transform"
        >
          <Heart
            className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
          />
        </button>
        {!item.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="badge badge-danger">Sold Out</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-grow flex flex-col">
        <div className="mb-2">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
            {item.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex gap-2 mb-3 flex-wrap">
          {item.isVegetarian && (
            <span className="badge badge-success text-xs">🌱 Veg</span>
          )}
          {item.isVegan && (
            <span className="badge badge-success text-xs">Vegan</span>
          )}
          <span className="badge bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-100 text-xs capitalize">
            {item.category}
          </span>
        </div>

        {/* Rating */}
        {item.totalRatings > 0 && (
          <div className="flex items-center gap-1 mb-3">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold">{item.rating.toFixed(1)}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({item.totalRatings})
            </span>
          </div>
        )}

        {/* Price and Stock */}
        <div className="mb-4 mt-auto">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              ₹{item.price}
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {item.quantityAvailable} in stock
            </span>
          </div>
        </div>

        {/* Add to Cart */}
        {item.available ? (
          <div className="flex gap-2">
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
              >
                −
              </button>
              <span className="px-2 font-semibold min-w-[2rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(item.quantityAvailable, quantity + 1))}
                className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex-1 btn btn-accent flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Add
            </button>
          </div>
        ) : (
          <button disabled className="w-full btn bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed">
            Out of Stock
          </button>
        )}
      </div>
    </div>
  );
}
