# ElectroShop Frontend - React (Vite + Material UI + SignalR)

## 📌 Overview
This is a modern e-commerce frontend application built with **React + Vite**.
It features a responsive UI powered by **Material UI**, seamless API communication using **Axios**, real-time customer support chat via **SignalR**, and navigation handled by **React Router**.

Backend repository: [electro-shop-backend](https://github.com/nguyenhbtrung/electro-shop-backend)

---

## 🚀 Tech Stack
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Material UI](https://mui.com/)
- [Axios](https://axios-http.com/)
- [SignalR](https://learn.microsoft.com/en-us/aspnet/core/signalr/introduction)
- [React Router](https://reactrouter.com/)
- [Formik](https://formik.org/)
- [Yup](https://github.com/jquense/yup)
- [Yarn](https://yarnpkg.com/) (Package Manager)

---

## 📂 Project Structure
```
.
├── src/
│   ├── assets/       # Static assets
│   ├── components/   # Reusable components
│   ├── contexts/     # React contexts
│   ├── pages/        # Page components
│   │   ├── admin/    # Admin interface
│   │   ├── auth/     # Authentication
│   │   └── user/     # User interface
│   ├── services/     # API config, services
│   ├── utils/        # Utility functions
│   ├── theme.js      # Theme configuration
│   ├── Router.jsx    # Route configurations
│   └── main.jsx      # Entry point
├── .env             # Environment variables
├── package.json
└── vite.config.js
```

---

## ⚙️ Environment Variables
Create a `.env` file in the project root and set the backend URL:

```env
VITE_BACKEND_URL=https://localhost:7169
```

---

## 📦 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/nguyenhbtrung/electro-shop-frontend.git
cd electro-shop-frontend
```

### 2. Install dependencies

```bash
yarn
```

### 3. Start development server

```bash
yarn dev
```

The app will be available at: [http://localhost:5173](http://localhost:5173)

---

## 🛠️ Available Scripts

```bash
yarn dev      # Start development server
yarn build    # Build for production
yarn preview  # Preview production build
yarn lint     # Run ESLint
```

---

## 🔌 SignalR Integration

SignalR is used for real-time customer support chat:
- Connection setup in `services/signalR/`
- Real-time messaging between:
  - Customers and support staff
  - Admin chat management

---

## 🎨 UI Components

Built with Material UI (v6):
- Responsive admin dashboard
- Dark/light theme support
- Custom components for:
  - Product management
  - User management
  - Order processing
  - Chat interface
  - Data visualization

---

## 🔒 Authentication

- JWT-based authentication
- Token stored in localStorage
- Protected routes
- Role-based access control

---

## 📊 Features
- Product Management
- Category Management
- Brand Management
- Order Processing
- Customer Support Chat
- User Management
- Analytics Dashboard
- Stock & Supplier Management
- Return Management
- Banner Management
- Voucher & Discount System
- Rating System
- Browsing history for customer
- Browse products by category and brand
- Search and filter products

---

## 📝 Notes

* Ensure `.env` is configured properly
* Backend server must be running for full functionality
* Node.js 18+ recommended
* Yarn 1.22+ recommended
* For production deployment:
  - Set proper environment variables
  - Enable HTTPS
  - Configure proper CORS settings
