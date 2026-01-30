import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store';
import { foodAPI } from '@/lib/api';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function CanteenOwner() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [foodItems, setFoodItems] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'lunch',
    quantityTotal: '',
  });

  useEffect(() => {
    if (!user || user.role !== 'canteen_owner') {
      router.push('/');
      return;
    }
    fetchData();
  }, [user, router]);

  const fetchData = async () => {
    try {
      const foodRes = await foodAPI.getAll();
      setFoodItems(foodRes.data.data);
    } catch (error) {
      console.error('Error fetching food items:', error);
    }
  };

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

  if (!user || user.role !== 'canteen_owner') return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-black py-8">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Canteen Owner Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Add and manage your food items</p>
        </motion.div>
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
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input col-span-1"
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="input"
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input col-span-2 h-20"
                required
              ></textarea>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, quantityTotal: e.target.value })}
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
    </div>
  );
}
