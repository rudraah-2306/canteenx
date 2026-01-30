const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    foodItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodItem',
      required: true,
      unique: true,
    },
    quantityInStock: {
      type: Number,
      required: true,
      min: 0,
    },
    quantityReserved: {
      type: Number,
      default: 0,
    },
    quantitySold: {
      type: Number,
      default: 0,
    },
    lowStockThreshold: {
      type: Number,
      required: true,
      default: 5,
    },
    lastRestocked: Date,
    nextRestockDate: Date,
    restockQuantity: Number,
    notes: String,
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inventory', inventorySchema);
