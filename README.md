# ElectroShop Frontend - React (Vite + Material UI + SignalR)

## 📌 Overview
This is a modern e-commerce application frontend built with **React + Vite**, using **Material UI** for the interface, **SignalR** for real-time customer support chat, **Formik** for form handling, and **React Router** for routing.

Backend repository: [electro-shop-backend](https://github.com/nguyenhbtrung/electro-shop-backend)

---

## 🚀 Tech Stack
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Material UI](https://mui.com/)
- [SignalR](https://learn.microsoft.com/en-us/aspnet/core/signalr/introduction)
- [React Router](https://reactrouter.com/)
- [Formik](https://formik.org/)
- [Yup](https://github.com/jquense/yup)
- [Axios](https://axios-http.com/)
- [FullCalendar](https://fullcalendar.io/)
- [Nivo Charts](https://nivo.rocks/)
- [Yarn](https://yarnpkg.com/) (Package Manager)

---

## 📂 Project Structure
```
.
├── src/
│   ├── assets/       # Static assets
│   ├── components/   # Reusable components
│   ├── contexts/     # React contexts
│   ├── data/         # Mock data
│   ├── pages/        # Page components
│   │   ├── admin/    # Admin dashboard
│   │   ├── auth/     # Authentication
│   │   └── user/     # User interface
│   ├── services/     # API services
│   ├── theme/        # Theme configuration
│   ├── utils/        # Utility functions
│   ├── Router.jsx    # Route configurations
│   ├── App.jsx       # Root component
│   └── main.jsx      # Entry point
├── .env             # Environment variables
├── package.json
└── vite.config.js
```

---

## ⚙️ Environment Variables
Create a `.env` file in the project root:

```env
VITE_BACKEND_URL=https://localhost:7169
```

---

## 📦 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/electro-shop-frontend.git
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
  - Notification system

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
- User profile management

---

## 📱 Mobile Support

- Responsive design
- Touch-friendly interface
- Mobile-optimized shopping experience
- Adaptive navigation
- Responsive admin dashboard

---

## 📊 Features

- Product Management
- Category Management
- Order Processing
- Customer Support Chat
- User Management
- Analytics Dashboard
- Stock Management
- Return Management
- Voucher & Discount System
- Rating System

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