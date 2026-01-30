# CanteenX - College Canteen Pre-order System

## 🏗️ Project Structure

```
canteenx/
├── frontend/                 # Next.js React application
│   ├── pages/               # Next.js pages and routes
│   │   ├── index.tsx        # Landing page
│   │   ├── login.tsx        # Login page
│   │   ├── signup.tsx       # Signup page
│   │   ├── menu.tsx         # Food menu page
│   │   ├── cart.tsx         # Shopping cart
│   │   ├── orders.tsx       # Order history
│   │   ├── admin.tsx        # Admin dashboard
│   │   ├── about.tsx        # About page
│   │   └── contact.tsx      # Contact page
│   ├── components/          # Reusable React components
│   │   ├── Navbar.tsx       # Navigation bar
│   │   ├── Footer.tsx       # Footer
│   │   └── FoodCard.tsx     # Food item card
│   ├── styles/              # CSS and Tailwind styles
│   ├── lib/                 # Utilities and API helpers
│   │   └── api.ts           # Axios API client
│   ├── store/               # Zustand state management
│   ├── types/               # TypeScript types
│   ├── public/              # Static assets
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── tsconfig.json
│
└── backend/                  # Node.js/Express API
    ├── models/              # MongoDB schemas
    │   ├── User.js
    │   ├── FoodItem.js
    │   ├── Order.js
    │   └── Inventory.js
    ├── controllers/         # Business logic
    │   ├── authController.js
    │   ├── foodController.js
    │   └── orderController.js
    ├── routes/              # API routes
    │   ├── auth.js
    │   ├── food.js
    │   └── order.js
    ├── middleware/          # Express middleware
    │   └── auth.js          # JWT authentication
    ├── scripts/             # Database scripts
    │   └── seed.js          # Database seeding
    ├── server.js            # Express server entry
    ├── package.json
    └── .env.example         # Environment variables template
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
```bash
cd canteenx
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run seed  # Seed dummy data
npm run dev   # Start backend on http://localhost:5000
```

3. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev   # Start frontend on http://localhost:3000
```

## 🎯 Demo Credentials

Use these credentials to test the application:

### Student
- Email: `raj@student.com`
- Password: `student123`

### Teacher
- Email: `amit@teacher.com`
- Password: `teacher123`

### Admin
- Email: `admin@canteenx.com`
- Password: `admin123`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Food Items
- `GET /api/food` - Get all food items
- `GET /api/food/:id` - Get specific food item
- `POST /api/food` - Create food item (Admin only)
- `PUT /api/food/:id` - Update food item (Admin only)
- `DELETE /api/food/:id` - Delete food item (Admin only)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get specific order
- `PUT /api/orders/:id` - Update order status (Admin only)
- `GET /api/orders/stats` - Get order statistics (Admin only)

## 🎨 Design Features

- **Modern UI**: Clean, minimal design inspired by Stripe, Notion, Swiggy
- **Dark Mode**: Full dark mode support with smooth transitions
- **Responsive**: Mobile-first, works on all devices
- **Animations**: Smooth Framer Motion animations throughout
- **Accessibility**: Semantic HTML, keyboard navigation ready
- **Performance**: Optimized images, lazy loading, code splitting

## 📝 Database Schema

### User
- College ID, Name, Email, Phone, Role, Department
- Hashed passwords, timestamps

### FoodItem
- Name, Description, Price, Category, Image
- Quantity tracking, Preparation time
- Dietary flags (Vegetarian, Vegan)
- Ratings system

### Order
- Order number, Items, Total amount
- Status tracking (Pending → Completed)
- Payment method & status
- Pickup time scheduling

### Inventory
- Real-time stock levels
- Reserved quantities
- Low stock alerts
- Restock planning

## 🔐 Security

- JWT token-based authentication
- Password hashing with bcryptjs
- Protected routes with middleware
- Role-based access control
- Environment variables for sensitive data
- CORS enabled for frontend communication

## 📦 Tech Stack

### Frontend
- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **State**: Zustand
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Type Safety**: TypeScript

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Auth**: JWT, bcryptjs
- **Validation**: express-validator

## 🚢 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Connect to Vercel for automatic deployments
```

### Backend (Render/Railway)
```bash
# Set environment variables in hosting platform
# Push to git for automatic deployments
```

## 📊 Future Enhancements

- AI-based demand prediction
- Meal subscriptions
- Hostel integration & room delivery
- QR code-based pickup system
- Multi-canteen support
- Real-time notifications
- Advanced analytics dashboard
- Payment gateway integration (Stripe)
- Food rating & reviews system
- Dietary preference profiles

## 🤝 Contributing

This is a starter MVP. Feel free to extend with more features!

## 📄 License

MIT License - feel free to use this for your college or startup.

## 💡 Built For

Students, teachers, and canteen administrators who want to modernize campus dining operations. Built with ❤️ by students for students.

---

**Skip the Queue. Secure Your Meal.** 🍽️
