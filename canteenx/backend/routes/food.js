const express = require('express');
const {
  getAllFoodItems,
  getFoodItem,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
} = require('../controllers/foodController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllFoodItems);
router.get('/:id', getFoodItem);
router.post('/', protect, authorize('admin'), createFoodItem);
router.put('/:id', protect, authorize('admin'), updateFoodItem);
router.delete('/:id', protect, authorize('admin'), deleteFoodItem);

module.exports = router;
