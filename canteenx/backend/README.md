# Migration Notice to Supabase

This backend is now deprecated. All database and authentication logic has been migrated to Supabase. The Next.js frontend communicates directly with Supabase for all operations.

## Removal Notice

You can safely remove the backend folder as it is no longer in use.

## Supabase Setup

To set up your project with Supabase, follow these steps:

1. Create a Supabase account at [supabase.io](https://supabase.io).
2. Create a new project and configure your database.
3. Update your frontend to communicate with Supabase using the provided API keys.

For more information, refer to the Supabase documentation.
# CanteenX Backend - Express.js API

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/canteenx

# JWT Configuration
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRE=7d

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## Running the Server

### Development
```bash
npm run dev
# Server runs on http://localhost:5000
```

### Seed Database
```bash
npm run seed
# Populates with sample data (users, food items, etc.)
```

### Production
```bash
npm start
```

## API Response Format

Success Response:
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "optional message"
}
```

Error Response:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Authentication

All protected routes require:
```
Authorization: Bearer <JWT_TOKEN>
```

JWT contains:
- User ID
- User Role (student/teacher/admin)
- Expiration time

## Models

### User
```javascript
{
  name: String,
  email: String (unique),
  collegeId: String (unique),
  password: String (hashed),
  phone: String,
  role: String (student|teacher|admin),
  department: String
}
```

### FoodItem
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String (breakfast|lunch|snacks|beverages|desserts),
  quantityAvailable: Number,
  quantityTotal: Number,
  image: String,
  available: Boolean,
  preparationTime: Number (minutes),
  isVegetarian: Boolean,
  isVegan: Boolean,
  rating: Number,
  totalRatings: Number
}
```

### Order
```javascript
{
  orderNumber: String (unique),
  user: ObjectId (ref: User),
  items: [{
    foodItem: ObjectId (ref: FoodItem),
    quantity: Number,
    price: Number,
    notes: String
  }],
  totalAmount: Number,
  status: String (pending|confirmed|preparing|ready|completed|cancelled),
  paymentMethod: String (online|cash),
  paymentStatus: String (pending|completed|failed),
  pickupTime: Date,
  scheduledFor: Date,
  notes: String,
  rating: Number (1-5),
  feedback: String
}
```

### Inventory
```javascript
{
  foodItem: ObjectId (ref: FoodItem),
  quantityInStock: Number,
  quantityReserved: Number,
  quantitySold: Number,
  lowStockThreshold: Number,
  lastRestocked: Date,
  nextRestockDate: Date
}
```

## Error Codes

- 400 - Bad Request (invalid data)
- 401 - Unauthorized (missing/invalid token)
- 403 - Forbidden (insufficient permissions)
- 404 - Not Found (resource doesn't exist)
- 500 - Server Error

## Middleware

- **CORS** - Cross-origin requests enabled
- **JSON Parser** - Parses incoming JSON
- **Auth** - JWT verification for protected routes
- **Authorization** - Role-based access control

## Database Indexes

MongoDB automatically creates indexes on:
- `User.email` (unique)
- `User.collegeId` (unique)
- `Order.user` (for querying user orders)
- `Order.orderNumber` (unique)
