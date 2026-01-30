const Order = require('../models/Order');
const FoodItem = require('../models/FoodItem');
const Inventory = require('../models/Inventory');

// Generate unique order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `ORD${timestamp}${random}`;
};

exports.createOrder = async (req, res) => {
  try {
    const { items, paymentMethod, pickupTime, scheduledFor, notes } = req.body;

    if (!items || items.length === 0 || !paymentMethod || !pickupTime) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    let totalAmount = 0;
    const orderItems = [];

    // Validate items and calculate total
    for (const item of items) {
      const foodItem = await FoodItem.findById(item.foodItemId);

      if (!foodItem) {
        return res.status(404).json({ success: false, message: `Food item ${item.foodItemId} not found` });
      }

      if (foodItem.quantityAvailable < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient quantity for ${foodItem.name}`,
        });
      }

      const itemTotal = foodItem.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        foodItem: foodItem._id,
        quantity: item.quantity,
        price: foodItem.price,
        notes: item.notes,
      });

      // Reduce inventory
      foodItem.quantityAvailable -= item.quantity;
      await foodItem.save();

      // Update inventory
      const inventory = await Inventory.findOne({ foodItem: foodItem._id });
      if (inventory) {
        inventory.quantityInStock -= item.quantity;
        inventory.quantityReserved += item.quantity;
        await inventory.save();
      }
    }

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      user: req.user.id,
      items: orderItems,
      totalAmount,
      paymentMethod,
      pickupTime,
      scheduledFor: scheduledFor || new Date(),
      notes,
    });

    await order.populate('items.foodItem');
    await order.populate('user', 'name email phone');

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    let query = Order.find().populate('items.foodItem').populate('user', 'name email phone');

    // If student/teacher, only show their orders
    if (req.user.role !== 'admin') {
      query = query.where('user').equals(req.user.id);
    }

    const orders = await query.sort('-createdAt');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.foodItem').populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check authorization
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;

    if (status === 'completed') {
      order.completedAt = new Date();
    }

    if (status === 'cancelled') {
      order.cancelledAt = new Date();
      // Restore inventory
      for (const item of order.items) {
        const foodItem = await FoodItem.findById(item.foodItem);
        foodItem.quantityAvailable += item.quantity;
        await foodItem.save();

        const inventory = await Inventory.findOne({ foodItem: item.foodItem });
        if (inventory) {
          inventory.quantityInStock += item.quantity;
          inventory.quantityReserved -= item.quantity;
          await inventory.save();
        }
      }
    }

    order = await order.save();

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
        },
      },
    ]);

    const todayOrders = await Order.countDocuments({
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    });

    const statusBreakdown = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        todayOrders,
        statusBreakdown,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
