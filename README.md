# 🛍️ StyleNest - Full-Stack E-Commerce Platform

StyleNest is a modern, high-performance, full-stack E-Commerce web application built with the **MERN** stack (MongoDB, Express, React, Node.js) and styled using **Tailwind CSS**.

---

## 🔗 Live Deployments

- **🌐 Live Website (Frontend)**: [https://frontend-weld-nu-69.vercel.app](https://frontend-weld-nu-69.vercel.app)
- **⚡ API Server (Backend)**: [https://backend-five-khaki-22.vercel.app](https://backend-five-khaki-22.vercel.app)

---

## ✨ Features

### 🛒 Customer Features
- **Interactive Product Catalog**: Browse products with categories, price filters, and instant keyword search.
- **Product Details & Reviews**: Detailed image views, customer reviews, ratings, and stock status.
- **Cart Management**: Add/remove products, adjust quantities, and real-time total price calculations.
- **Seamless Checkout**: Order placement with Cash on Delivery (COD) and delivery address details.
- **Order Tracking & History**: Track personal order status (Pending, Processing, Shipped, Delivered, Cancelled).
- **Authentication System**: Secure registration and login powered by JSON Web Tokens (JWT) & bcrypt encryption.
- **Promotions & Banners**: Dynamic homepage banners and promotional countdown timers.

### 🛡️ Admin Management Dashboard
- **Analytics & Overview**: Overview of total revenue, total sales, user count, and top products.
- **Product CRUD**: Create, edit, update stock, and delete clothing products with image upload.
- **Category Management**: Organize products into custom categories.
- **Order Status Control**: Process, update order delivery statuses, and manage customer shipments.
- **Banner & Offer Management**: Control promotional banners and hero sliders dynamically.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS, PostCSS
- **Routing**: React Router DOM v6
- **Icons**: React Icons
- **State & Data**: React Context API & Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs
- **Cloud Storage**: Cloudinary (Product & Banner Image Hosting)
- **Deployment Platform**: Vercel Serverless Functions

---

## 📁 Repository Structure

```
setiaProject2/
├── backend/                  # Express.js REST API Server
│   ├── config/              # Database connection & configurations
│   ├── controllers/         # API controllers logic
│   ├── middleware/          # JWT auth, error handling & upload middlewares
│   ├── models/             # Mongoose schemas (User, Product, Order, etc.)
│   ├── routes/             # Express API route handlers
│   ├── server.js           # Express app entry point
│   └── vercel.json         # Vercel serverless configuration
├── frontend/                 # React + Vite Frontend Application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Auth & Product state providers
│   │   ├── pages/          # Application views & admin routes
│   │   ├── utils/          # Axios instance & utility functions
│   │   ├── App.jsx         # App router setup
│   │   └── main.jsx        # App entry point
│   └── vercel.json         # Vercel rewrite configuration
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Local Setup & Installation

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB Atlas cluster URI
- Cloudinary credentials

### 1. Clone & Install Dependencies

```bash
git clone <your-repository-url>
cd setiaProject2
npm run install:all
```

### 2. Configure Environment Variables

Create `.env` inside the `backend/` folder:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=http://localhost:5173
```

### 3. Run Development Servers

Run both Backend and Frontend concurrently from the root directory:

```bash
npm run dev
```

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000/api`

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user | No |
| `POST` | `/api/auth/login` | Authenticate user & get JWT token | No |
| `GET` | `/api/products` | Fetch product list with filters | No |
| `GET` | `/api/products/:id` | Fetch single product details | No |
| `POST` | `/api/products` | Create product with image upload | Admin |
| `PUT` | `/api/products/:id` | Update product details | Admin |
| `DELETE` | `/api/products/:id` | Remove a product | Admin |
| `GET` | `/api/categories` | List all categories | No |
| `POST` | `/api/orders` | Place a new order | User |
| `GET` | `/api/orders/myorders` | View user order history | User |
| `GET` | `/api/admin/stats` | Retrieve dashboard metrics | Admin |

---

## ☁️ Vercel Deployment

Both backend and frontend are configured for deployment on Vercel:

- **Backend**: Configured via `backend/vercel.json` as `@vercel/node` serverless entry point (`server.js`).
- **Frontend**: Configured via `frontend/vercel.json` with SPA route rewrites forwarding `/api/*` requests to the live Vercel backend URL.

---

## 📄 License

Distributed under the ISC License.
