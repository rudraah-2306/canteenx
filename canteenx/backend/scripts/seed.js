const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const FoodItem = require('../models/FoodItem');
const Inventory = require('../models/Inventory');

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/canteenx');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await FoodItem.deleteMany({});
    await Inventory.deleteMany({});

    // Create admin user
    const admin = await User.create({
      name: 'Canteen Admin',
      email: 'admin@canteenx.com',
      collegeId: 'ADMIN001',
      password: 'admin123',
      phone: '9876543210',
      role: 'admin',
      department: 'Administration',
    });

    // Create sample users
    const student1 = await User.create({
      name: 'Raj Kumar',
      email: 'raj@student.com',
      collegeId: 'STU001',
      password: 'student123',
      phone: '9123456789',
      role: 'student',
      department: 'CSE',
    });

    const student2 = await User.create({
      name: 'Priya Sharma',
      email: 'priya@student.com',
      collegeId: 'STU002',
      password: 'student123',
      phone: '9234567890',
      role: 'student',
      department: 'ECE',
    });

    const teacher = await User.create({
      name: 'Prof. Amit Singh',
      email: 'amit@teacher.com',
      collegeId: 'TECH001',
      password: 'teacher123',
      phone: '9345678901',
      role: 'teacher',
      department: 'CSE',
    });

    // Create food items
    const foodItems = [
      {
        name: 'Butter Chicken',
        description: 'Creamy butter chicken with basmati rice',
        price: 120,
        category: 'lunch',
        quantityTotal: 50,
        isVegetarian: false,
        preparationTime: 20,
        createdBy: admin._id,
      },
      {
        name: 'Paneer Tikka',
        description: 'Grilled paneer pieces with spices',
        price: 100,
        category: 'snacks',
        quantityTotal: 40,
        isVegetarian: true,
        preparationTime: 15,
        createdBy: admin._id,
      },
      {
        name: 'Aloo Paratha',
        description: 'Potato stuffed Indian bread',
        price: 40,
        category: 'breakfast',
        quantityTotal: 80,
        isVegetarian: true,
        preparationTime: 10,
        createdBy: admin._id,
      },
      {
        name: 'Biryani',
        description: 'Fragrant basmati rice with meat',
        price: 150,
        category: 'lunch',
        quantityTotal: 30,
        isVegetarian: false,
        preparationTime: 25,
        createdBy: admin._id,
      },
      {
        name: 'Chow Mein',
        description: 'Indo-Chinese noodles with vegetables',
        price: 80,
        category: 'snacks',
        quantityTotal: 60,
        isVegetarian: true,
        preparationTime: 12,
        createdBy: admin._id,
      },
      {
        name: 'Samosa',
        description: 'Crispy potato and pea samosas (pack of 2)',
        price: 20,
        category: 'snacks',
        quantityTotal: 100,
        isVegetarian: true,
        preparationTime: 5,
        createdBy: admin._id,
      },
      {
        name: 'Fresh Lemonade',
        description: 'Refreshing cold lemonade',
        price: 30,
        category: 'beverages',
        quantityTotal: 150,
        isVegetarian: true,
        isVegan: true,
        preparationTime: 2,
        createdBy: admin._id,
      },
      {
        name: 'Chocolate Cake',
        description: 'Homemade chocolate cake slice',
        price: 60,
        category: 'desserts',
        quantityTotal: 25,
        isVegetarian: true,
        preparationTime: 3,
        createdBy: admin._id,
      },
      {
        name: 'Masala Dosa',
        description: 'Crispy South Indian dosa with sambar',
        price: 70,
        category: 'breakfast',
        quantityTotal: 45,
        isVegetarian: true,
        preparationTime: 12,
        createdBy: admin._id,
      },
      {
        name: 'Tandoori Chicken',
        description: 'Spiced and grilled chicken',
        price: 130,
        category: 'lunch',
        quantityTotal: 35,
        isVegetarian: false,
        preparationTime: 18,
        createdBy: admin._id,
      },
    ];

    const createdFoodItems = await FoodItem.insertMany(foodItems);
    console.log(`${createdFoodItems.length} food items created`);

    // Create inventory entries
    const inventoryItems = createdFoodItems.map((item) => ({
      foodItem: item._id,
      quantityInStock: item.quantityTotal,
      lowStockThreshold: Math.ceil(item.quantityTotal * 0.1),
    }));

    await Inventory.insertMany(inventoryItems);
    console.log('Inventory created');

    console.log('✅ Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
