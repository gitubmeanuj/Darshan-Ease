# Darshan Ease

A comprehensive web application designed to streamline temple darshan (spiritual visit) bookings and management. Darshan Ease provides an intuitive platform for devotees to book temple visits, manage their bookings, and for temple organizers to maintain schedules and events efficiently.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [File Structure](#file-structure)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

Darshan Ease is a full-stack web application that simplifies the process of booking temple visits and managing darshan slots. It serves three types of users:

- **Devotees**: Can browse temples, check available slots, and book their darshan visits
- **Organizers**: Can manage temple events, maintain darshan schedules, and track maintenance
- **Administrators**: Can manage users, organizers, temples, and system-wide settings

## ✨ Features

### For Devotees
- Browse available temples with detailed information
- View available darshan slots
- Book darshan visits in advance
- Track booking history and status
- Receive confirmation after successful booking
- View payment and ticket information
- Manage user profile

### For Organizers
- Create and manage temple events
- Set up and manage darshan slots
- View and manage bookings
- Track temple maintenance schedules
- Update temple information
- Analytics dashboard

### For Administrators
- Manage all users (devotees and organizers)
- Manage temple listings and organizers
- System-wide event management
- Maintenance tracking
- User role management
- Dashboard with system statistics

## 🛠 Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Other**: Bcrypt for password hashing

### Frontend
- **Framework**: React 18+
- **Build Tool**: Vite
- **Routing**: React Router
- **HTTP Client**: Axios
- **State Management**: Context API
- **Styling**: CSS3
- **Linting**: ESLint

## 📁 Project Structure

```
darshan-ease/
├── darshan-backend/          # Backend application
│   ├── config/
│   │   └── db.js            # Database configuration
│   ├── controllers/          # Business logic controllers
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── eventController.js
│   │   ├── maintenanceController.js
│   │   ├── slotController.js
│   │   ├── templeController.js
│   │   └── userController.js
│   ├── middleware/           # Custom middleware
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   ├── models/              # MongoDB schemas
│   │   ├── Booking.js
│   │   ├── DarshanSlot.js
│   │   ├── Event.js
│   │   ├── Maintenance.js
│   │   ├── Temple.js
│   │   └── User.js
│   ├── routes/              # API routes
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── maintenanceRoutes.js
│   │   ├── slotRoutes.js
│   │   ├── templeRoutes.js
│   │   └── userRoutes.js
│   ├── assets/              # Static assets
│   ├── server.js            # Express server entry point
│   ├── package.json
│   ├── cleanBookings.js     # Booking cleanup utility
│   └── seed.js              # Database seeding script
│
└── Frontend/                # React frontend application
    ├── src/
    │   ├── components/      # React components
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── Layout.jsx
    │   │   ├── Loader.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── AdminRoute.jsx
    │   │   ├── OrganizerRoute.jsx
    │   │   ├── TempleCard.jsx
    │   │   ├── BookingCard.jsx
    │   │   ├── SlotCard.jsx
    │   │   ├── EditTempleModal.jsx
    │   │   ├── EditOrganizerModal.jsx
    │   │   └── EditUserModal.jsx
    │   ├── pages/           # Page components
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── SignUp.jsx
    │   │   ├── Temples.jsx
    │   │   ├── Slots.jsx
    │   │   ├── Bookings.jsx
    │   │   ├── BookingSuccess.jsx
    │   │   ├── Profiles.jsx
    │   │   ├── OrganizerDashboard.jsx
    │   │   └── admin/       # Admin pages
    │   │       ├── AdminUsers.jsx
    │   │       ├── AdminTemples.jsx
    │   │       └── AdminOrganizers.jsx
    │   ├── services/        # API service functions
    │   │   ├── api.js
    │   │   ├── authService.js
    │   │   ├── bookingService.js
    │   │   ├── templeService.js
    │   │   ├── userService.js
    │   │   ├── eventService.js
    │   │   ├── maintenanceService.js
    │   │   └── adminServices.js
    │   ├── context/         # React Context for state
    │   │   └── AuthContext.jsx
    │   ├── hooks/           # Custom React hooks
    │   │   ├── useAuth.js
    │   │   └── useFetch.js
    │   ├── utils/           # Utility functions
    │   │   ├── paymentAndTicket.js
    │   │   └── templeImageMap.js
    │   ├── assets/          # Frontend assets
    │   ├── App.jsx
    │   └── main.jsx
    ├── public/              # Static public files
    ├── package.json
    ├── vite.config.js
    └── eslint.config.js
```

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd darshan-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend root with the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

4. Seed the database (optional):
```bash
npm run seed
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend root:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## ⚙️ Configuration

### Environment Variables

#### Backend (.env)
- `MONGODB_URI`: Connection string for MongoDB
- `PORT`: Server port (default: 5000)
- `JWT_SECRET`: Secret key for JWT token signing
- `NODE_ENV`: Environment (development/production)

#### Frontend (.env)
- `VITE_API_BASE_URL`: Backend API base URL

## 🏃 Running the Application

### Development Mode

**Backend:**
```bash
cd darshan-backend
npm start
```

The backend server will start on `http://localhost:5000`

**Frontend:**
```bash
cd Frontend
npm run dev
```

The frontend will start on `http://localhost:5173` (or another port if 5173 is in use)

### Production Build

**Frontend:**
```bash
cd Frontend
npm run build
```

This creates an optimized build in the `dist` directory.

## 📡 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Temple Endpoints
- `GET /api/temples` - Get all temples
- `GET /api/temples/:id` - Get temple details
- `POST /api/temples` - Create temple (admin only)
- `PUT /api/temples/:id` - Update temple (admin only)
- `DELETE /api/temples/:id` - Delete temple (admin only)

### Booking Endpoints
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

### Slot Endpoints
- `GET /api/slots` - Get available slots
- `GET /api/slots/temple/:templeId` - Get slots for specific temple
- `POST /api/slots` - Create slot (organizer only)
- `PUT /api/slots/:id` - Update slot
- `DELETE /api/slots/:id` - Delete slot

### User Endpoints
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user (admin only)

### Event Endpoints
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (organizer only)
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Maintenance Endpoints
- `GET /api/maintenance` - Get maintenance records
- `POST /api/maintenance` - Create maintenance record
- `PUT /api/maintenance/:id` - Update maintenance record
- `DELETE /api/maintenance/:id` - Delete maintenance record

## 📖 User Roles

### Devotee
- Default user role
- Can browse temples and book slots
- Can view own bookings and profile
- Limited to viewing public information

### Organizer
- Can manage temple information
- Can create and manage events
- Can set up darshan slots
- Can view temple-specific analytics
- Cannot access admin panel

### Administrator
- Full system access
- Can manage all users and roles
- Can manage all temples and organizers
- Can view system-wide analytics
- Can trigger maintenance records

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication. Each request to protected endpoints requires an Authorization header:

```
Authorization: Bearer <token>
```

Tokens are issued upon login and authenticated requests using the `authMiddleware`.

## 🛣️ Routing

### Frontend Routes
- `/` - Home page
- `/login` - Login page
- `/signup` - Registration page
- `/temples` - Browse temples
- `/slots` - View available slots
- `/bookings` - User bookings
- `/profile` - User profile
- `/booking-success` - Successful booking confirmation
- `/organizer-dashboard` - Organizer dashboard
- `/admin/*` - Admin dashboard and management pages

### Backend Routes
- `/api/auth/*` - Authentication routes
- `/api/temples/*` - Temple management
- `/api/bookings/*` - Booking management
- `/api/slots/*` - Slot management
- `/api/users/*` - User management
- `/api/events/*` - Event management
- `/api/maintenance/*` - Maintenance records

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

## 🐛 Known Issues

- Please check the GitHub Issues page for known bugs and feature requests

## 📝 Utilities

### Backend Utilities
- `cleanBookings.js` - Cleanup old/expired bookings
- `seed.js` - Database seeding for development

### Frontend Utilities
- `paymentAndTicket.js` - Payment and ticket generation logic
- `templeImageMap.js` - Temple image asset mapping

## 🔍 Development Tools

- **Linting**: ESLint configuration for code quality
- **Build Tool**: Vite for fast frontend development
- **Package Manager**: npm

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For issues, questions, or suggestions, please create an issue on the GitHub repository or contact the development team.

---

**Last Updated**: March 7, 2026

**Version**: 1.0.0
