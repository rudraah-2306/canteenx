const FoodItem = require('../models/FoodItem');
const Inventory = require('../models/Inventory');

exports.getAllFoodItems = async (req, res) => {
  try {
    const { category, available } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (available) filter.available = available === 'true';

    const items = await FoodItem.find(filter).populate('createdBy', 'name');

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFoodItem = async (req, res) => {
  try {
    const item = await FoodItem.findById(req.params.id).populate('createdBy', 'name');

    if (!item) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createFoodItem = async (req, res) => {
  try {
    const { name, description, price, category, quantityTotal, isVegetarian, isVegan, preparationTime } = req.body;

    if (!name || !description || !price || !category || !quantityTotal) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const foodItem = await FoodItem.create({
      name,
      description,
      price,
      category,
      quantityAvailable: quantityTotal,
      quantityTotal,
      isVegetarian: isVegetarian || false,
      isVegan: isVegan || false,
      preparationTime: preparationTime || 15,
      createdBy: req.user.id,
    });

    // Create inventory entry
    await Inventory.create({
      foodItem: foodItem._id,
      quantityInStock: quantityTotal,
      lowStockThreshold: Math.ceil(quantityTotal * 0.1),
    });

    res.status(201).json({
      success: true,
      data: foodItem,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateFoodItem = async (req, res) => {
  try {
    const { quantityAvailable, available } = req.body;

    let foodItem = await FoodItem.findById(req.params.id);

    if (!foodItem) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }

    if (quantityAvailable !== undefined) {
      foodItem.quantityAvailable = quantityAvailable;
    }

    if (available !== undefined) {
      foodItem.available = available;
    }

    // Update other fields if provided
    const { name, description, price, category, isVegetarian, isVegan, preparationTime } = req.body;
    if (name) foodItem.name = name;
    if (description) foodItem.description = description;
    if (price) foodItem.price = price;
    if (category) foodItem.category = category;
    if (isVegetarian !== undefined) foodItem.isVegetarian = isVegetarian;
    if (isVegan !== undefined) foodItem.isVegan = isVegan;
    if (preparationTime) foodItem.preparationTime = preparationTime;

    foodItem = await foodItem.save();

    res.status(200).json({
      success: true,
      data: foodItem,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteFoodItem = async (req, res) => {
  try {
    const foodItem = await FoodItem.findByIdAndDelete(req.params.id);

    if (!foodItem) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }

    // Delete inventory entry
    await Inventory.findOneAndDelete({ foodItem: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Food item deleted',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
