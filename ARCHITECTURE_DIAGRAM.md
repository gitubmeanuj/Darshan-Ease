# Frontend-Backend Integration Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     WEB BROWSER (Frontend)                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   React App (Vite)                       │  │
│  │  ┌─────────────────────────────────────────────────────┐ │  │
│  │  │ src/                                                │ │  │
│  │  │  ├── pages/                                        │ │  │
│  │  │  │   ├── Home.jsx         → Landing page          │ │  │
│  │  │  │   ├── Login.jsx        → Auth page             │ │  │
│  │  │  │   ├── SignUp.jsx       → Registration          │ │  │
│  │  │  │   ├── Temples.jsx      → 🏛️ List temples      │ │  │
│  │  │  │   ├── Slots.jsx        → 📅 Book slots        │ │  │
│  │  │  │   ├── Bookings.jsx     → 🎫 My bookings       │ │  │
│  │  │  │   └── Profiles.jsx     → 👤 User profile       │ │  │
│  │  │  │                                                 │ │  │
│  │  │  ├── services/                                    │ │  │
│  │  │  │   ├── api.js           → Axios config         │ │  │
│  │  │  │   ├── authService.js   → Login/Signup         │ │  │
│  │  │  │   ├── templeService.js → Temple API calls     │ │  │
│  │  │  │   ├── bookingService.js → Booking API calls   │ │  │
│  │  │  │   └── adminServices.js → Admin API calls      │ │  │
│  │  │  │                                                 │ │  │
│  │  │  ├── context/                                    │ │  │
│  │  │  │   └── AuthContext.jsx  → User state            │ │  │
│  │  │  │                                                 │ │  │
│  │  │  ├── components/                                 │ │  │
│  │  │  │   ├── Navbar.jsx       → Nav bar              │ │  │
│  │  │  │   ├── Layout.jsx       → Shared wrapper       │ │  │
│  │  │  │   └── ProtectedRoute.jsx → Auth guard         │ │  │
│  │  │  │                                                 │ │  │
│  │  │  └── App.jsx              → Main routes         │ │  │
│  │  │                                                  │ │  │
│  │  └─────────────────────────────────────────────────┘ │  │
│  │                                                      │  │
│  │  axios Interceptor:                               │  │
│  │  • Adds Authorization Bearer token                │  │
│  │  • Handles 401 redirects                          │  │
│  │  • Routes: http://localhost:5000/api              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            ↕️ HTTP/REST API
┌─────────────────────────────────────────────────────────────────┐
│                    Backend Server (Express)                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ server.js (Port 5000)                                    │  │
│  │ ├── CORS enabled                                         │  │
│  │ ├── Express.json parser                                  │  │
│  │ └── Morgan logging                                       │  │
│  │                                                          │  │
│  │ Routes:                                                  │  │
│  │ ├── /api/auth/                                          │  │
│  │ │   ├── POST /register      → authController.register   │  │
│  │ │   └── POST /login         → authController.login      │  │
│  │ │                                                        │  │
│  │ ├── /api/temples/                                       │  │
│  │ │   ├── GET /              → getTemples                 │  │
│  │ │   ├── GET /:id           → getTempleById              │  │
│  │ │   ├── POST /             → createTemple (auth)        │  │
│  │ │   ├── PUT /:id           → updateTemple (auth)        │  │
│  │ │   └── DELETE /:id        → deleteTemple (auth)        │  │
│  │ │                                                        │  │
│  │ ├── /api/slots/                                         │  │
│  │ │   ├── GET /              → getSlots                   │  │
│  │ │   ├── GET /temple/:id    → getSlotByTemple            │  │
│  │ │   ├── POST /             → createSlot (auth)          │  │
│  │ │   ├── PUT /:id           → updateSlot (auth)          │  │
│  │ │   └── DELETE /:id        → deleteSlot (auth)          │  │
│  │ │                                                        │  │
│  │ └── /api/bookings/                                      │  │
│  │     ├── GET /my            → getMyBookings (auth)       │  │
│  │     ├── GET /              → getAllBookings (auth)      │  │
│  │     ├── POST /             → createBooking (auth)       │  │
│  │     └── DELETE /:id        → cancelBooking (auth)       │  │
│  │                                                          │  │
│  │ Middleware:                                             │  │
│  │ • authMiddleware.js        → JWT verification           │  │
│  │ • roleMiddleware.js        → Admin checks               │  │
│  │                                                          │  │
│  │ Controllers:                                            │  │
│  │ • authController.js        → Auth logic                 │  │
│  │ • templeController.js      → Temple CRUD                │  │
│  │ • slotController.js        → Slot CRUD                  │  │
│  │ • bookingController.js     → Booking logic              │  │
│  │                                                          │  │
│  │ Models:                                                 │  │
│  │ • User.js                  → User schema                │  │
│  │ • Temple.js                → Temple schema              │  │
│  │ • DarshanSlot.js           → Slot schema                │  │
│  │ • Booking.js               → Booking schema             │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          ↕️ Database Driver                     │
│                    (Mongoose ODM)                              │
└─────────────────────────────────────────────────────────────────┘
                            ↕️ MongoDB Protocol
┌─────────────────────────────────────────────────────────────────┐
│                    MongoDB Database                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Collections:                                             │  │
│  │ • users          { id, name, email, phone, password }   │  │
│  │ • temples        { templeName, location, times }        │  │
│  │ • darshanslots   { templeId, date, time, seats, price } │  │
│  │ • bookings       { userId, slotId, numPeople }          │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## User Flow Diagram

```
┌─────────────────┐
│   Start Here    │
│  (Home Page)    │
└────────┬────────┘
         │
         ├─────────────────────────────────┐
         │                                 │
    Is Logged In?                    Is Logged In?
         │ NO                            │ YES
         │                               │
         ▼                               ▼
    ┌─────────────┐                ┌──────────────┐
    │   SIGNUP    │                │   TEMPLES    │
    │  /signup    │                │ /temples     │
    └──────┬──────┘                └──────┬───────┘
           │                              │
           │ Email + Name                 │ Click "Book Darshan"
           │ Phone + Password             │
           ▼                              ▼
    ┌──────────────┐              ┌──────────────┐
    │    LOGIN     │              │    SLOTS     │
    │  /login      │              │ /temples/:id │
    └──────┬───────┘              │   /slots     │
           │                      └──────┬───────┘
           │ Email + Password           │
           │                           │ Click "Book Now"
           │                           │
           ▼                           ▼
    ┌──────────────────────┐  ┌──────────────────────┐
    │ Token → localStorage │  │ NUMBER OF PEOPLE     │
    │ User → Context       │  │ TOTAL PRICE = CALC   │
    └──────┬───────────────┘  └──────┬───────────────┘
           │                         │
           │ Redirect to TEMPLES     │ Click "Confirm"
           │                         │
           ▼                         ▼
    ┌──────────────────────┐  ┌──────────────────────┐
    │    MAIN APP          │  │    API CALL POST     │
    │    /temples          │  │  /api/bookings       │
    │    /bookings    ◄────┼──│  Booking Created ✓   │
    │    /profile          │  │                      │
    └──────────────────────┘  └──────┬───────────────┘
           │                         │
           │ Click on Bookings       │ Redirect → Bookings
           │                         │
           ▼                         ▼
    ┌──────────────────────────────────────────┐
    │          MY BOOKINGS PAGE                │
    │        /bookings                         │
    │  ┌────────────────────────────────────┐ │
    │  │ Booking Card                       │ │
    │  │ • Temple: Badrinath                │ │
    │  │ • Date: 2026-03-10                 │ │
    │  │ • Time: 10:00 - 11:00              │ │
    │  │ • People: 1                        │ │
    │  │ • Total: ₹100                      │ │
    │  │                                    │ │
    │  │ [Download Ticket] [Cancel]         │ │
    │  └────────────────────────────────────┘ │
    │                                          │
    │  Downloads PDF or Cancels Booking       │
    └──────────────────────────────────────────┘
           │                        │
    [PDF Saved]                [Canceled]
           │                        │
           └────────────┬───────────┘
                        │
                        ▼
           ┌──────────────────────────┐
           │   Click on Profile       │
           │   /profile               │
           │  ┌────────────────────┐ │
           │  │ Name: John Doe     │ │
           │  │ Email: john@ex.com │ │
           │  │ Phone: 9876543210  │ │
           │  │ Role: USER         │ │
           │  │                    │ │
           │  │ [Edit] [Logout]    │ │
           │  └────────────────────┘ │
           └───────────┬──────────────┘
                       │ Click Logout
                       ▼
           ┌──────────────────────────┐
           │ Token Cleared            │
           │ User Cleared             │
           │ Redirect to Home         │
           └──────────────────────────┘
```

## Data Relationship Diagram

```
┌──────────────┐
│     USER     │
│──────────────│
│ _id          │
│ name         │
│ email        │
│ phone        │
│ password     │
│ role         │
│ timestamps   │
└──┬───────────┘
   │
   │ (1:Many)━━━━━┓
   │              │
   │         ┌────▼──────────────┐
   │         │    BOOKINGS       │
   │         │──────────────────┐
   │         │ _id              │
   │         │ userId ────────┐ │
   │         │ slotId       │ │ │
   │         │ numberOfPeo…  │ │ (ref to User)
   │         │ timestamps   │ │ │
   │         └──┬──────────┬──┘
   │            │          │
   │            │    (Many:1)━┐
   │            │             │ (ref to User)
   │            │          POPULATED DATA
   │            │             │
   │            ▼             │
   │     ┌──────────────────┐ │
   │     │  DARSHAN SLOTS   │─┘
   │     │──────────────────│
   │     │ _id              │
   │     │ templeId ────────┼──┐
   │     │ date             │  │ (ref to Temple)
   │     │ startTime        │  │
   │     │ endTime          │  │
   │     │ availableSeats   │  │
   │     │ price            │  │
   │     │ timestamps       │  │
   │     └─────────────┬────┘  │
   │                  │        │
   │         (Many:1) │        │
   │                  │        │
   │                  ▼        │
   │            ┌──────────────▼─────┐
   └───────────▶│     TEMPLES        │
                │──────────────────┐ │
                │ _id              │ │
                │ templeName       │ │
                │ location         │ │
                │ darshanStartTime │ │
                │ darshanEndTime   │ │
                │ timestamps       │ │
                └──────────────────┘ │
```

## Request/Response Flow

```
FRONTEND                          BACKEND                    DATABASE
────────                          ───────                    ────────

User Input
   │
   ▼
Component (React)
   │
   ▼
Service Function
(e.g., getTemples())
   │
   ├─► Add Headers
   │   {Authorization: Bearer token}
   │
   ├─► Make HTTP Request
   │   GET http://localhost:5000/api/temples
   │         │
   │         ▼
   │    CORS Check ✓
   │         │
   │         ▼
   │    Express Router
   │         │
   │         ├─► auth Route (/auth)
   │         │
   │         ├─► temples Route (/temples)
   │         │         │
   │         │         ├─► authMiddleware? (check JWT)
   │         │         │
   │         │         ├─► templeController.getTemples()
   │         │         │         │
   │         │         │         ▼
   │         │         │    Mongoose Query
   │         │         │    Temple.find()
   │         │         │         │
   │         │         │         ▼
   │         │         │    ┌─────────────────────┐
   │         │         │    │ MongoDB             │
   │         │         │    │ Fetch Documents     │
   │         │         │    │ From temples        │
   │         │         │    │ Collection          │
   │         │         │    └──────────┬──────────┘
   │         │         │               │
   │         │         │         Return Array
   │         │         │               │
   │         │         ├─► Format Response
   │         │         │    {
   │         │         │      success: true,
   │         │         │      data: [...]
   │         │         │    }
   │         │         │
   │    ◄────┴─────────┴─► Send JSON Response
   │                       (200, 400, 500, etc)
   │
   ◄─────────────────────── Receive Response
   │
   ▼
Extract res.data.data
   │
   ▼
Update State (setTemples)
   │
   ▼
Re-render Component
   │
   ▼
Display to User
```

## Authentication Flow

```
SIGNUP/LOGIN PROCESS:
════════════════════

1. User enters credentials
   │
   ▼
2. Frontend: POST /api/auth/login
   {
     email: "user@example.com",
     password: "password123"
   }
   │
   ▼
3. Backend: authController.login()
   ├─ Find user by email
   ├─ Compare password with bcrypt
   ├─ Generate JWT token
   ├─ Return response
   │
4. Frontend receives:
   {
     success: true,
     data: {
       id: "507...",
       name: "John",
       email: "john@ex.com",
       phone: "9876...",
       role: "USER",
       token: "eyJhbGciOiJIUzI1NiIs..."
     }
   }
   │
   ▼
5. Store in Frontend:
   ├─ localStorage.setItem("token", token)
   └─ localStorage.setItem("user", JSON.stringify(userData))
   │
   ▼
6. Set in AuthContext:
   ├─ setToken(token)
   └─ setUser(userData)
   │
   ▼
7. Subsequent API requests:
   GET /api/bookings/my
   Headers: {
     Authorization: "Bearer eyJhbGciOiJIUzI1NiIs..."
   }
   │
   ▼
8. Backend: authMiddleware
   ├─ Extract token from header
   ├─ Verify JWT signature
   ├─ Extract userId
   ├─ Attach to req.user
   │
9. Controller accesses: req.user.id
   │
   ▼
10. Query database: Booking.find({ userId: req.user.id })
    │
    ▼
11. Return user's bookings only
```

---

**All integration points verified and working ✅**
