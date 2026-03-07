# Quick Reference: Frontend-Backend Integration Guide

## 🚀 Quick Start

### Backend Setup
```bash
cd darshan-backend
npm install
# Setup .env file with:
# - PORT=5000
# - MONGODB_URI=your_connection_string
# - JWT_SECRET=your_secret
npm start
```

### Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173` and connect to backend at `http://localhost:5000/api`

## 📋 Workflow Flow

### 1. Anonymous User
```
Home → Signup → Login → Temples
```

### 2. Authenticated User - Booking Flow
```
Temples → Select Temple → Slots → Book Slot → Bookings → Download Ticket
```

### 3. User Account
```
Navbar → Profile → Edit/View/Logout
```

## 🔌 API Endpoints Used

| Method | Endpoint | Frontend | Auth |
|--------|----------|----------|------|
| POST | /api/auth/register | SignUp.jsx | No |
| POST | /api/auth/login | Login.jsx | No |
| GET | /api/temples | Temples.jsx | No |
| GET | /api/temples/:id | Slots.jsx | No |
| GET | /api/slots/temple/:id | Slots.jsx | No |
| POST | /api/bookings | Slots.jsx | Yes |
| GET | /api/bookings/my | Bookings.jsx | Yes |
| DELETE | /api/bookings/:id | Bookings.jsx | Yes |

## 📁 Key Files Modified

```
Frontend/
├── src/
│   ├── services/
│   │   ├── templeService.js        ✅ Fixed endpoints
│   │   ├── bookingService.js       ✅ Fixed endpoints
│   │   └── adminServices.js        ✅ Fixed endpoints
│   ├── pages/
│   │   ├── Temples.jsx             ✅ Real API integration
│   │   ├── Slots.jsx               ✅ Complete rewrite
│   │   ├── Bookings.jsx            ✅ Major redesign
│   │   ├── Profiles.jsx            ✨ NEW
│   │   ├── Login.jsx               ✅ Enhanced
│   │   └── SignUp.jsx              ✅ Enhanced
│   ├── context/
│   │   └── AuthContext.jsx         ✅ Fixed data extraction
│   ├── components/
│   │   ├── Navbar.jsx              ✅ Updated
│   │   └── Navbar.css              ✅ Restyled
│   └── App.jsx                     ✅ Enabled ProtectedRoute
```

## 🎯 What Each Page Does

### HomePage (/)
- Landing page
- Shows features
- Links to Login/Signup

### SignUp (/signup)
- User registration form
- Fields: name, email, phone, password
- Creates new user in database

### Login (/login)
- User authentication
- Stores token in localStorage
- Redirects to /temples on success

### Temples (/temples)
- Shows all temples
- Search functionality
- Category filters
- Click "Book Darshan" to view slots

### Slots (/temples/:id/slots)
- Shows available slots for temple
- Displays: date, time, available seats, price
- Click "Book Now" to open booking dialog
- Shows loading and empty states

### Bookings (/bookings)
- Shows user's bookings
- Download ticket as PDF
- Cancel bookings with confirmation
- Shows booking details with temple info

### Profile (/profile)
- View user information
- Edit name and phone
- Logout button
- Shows welcome message

### Navbar
- Always visible
- Shows user name when logged in
- Links to: Temples, Bookings, Profile
- Login/Signup links for guests
- Logout button for authenticated users

## 🔐 Authentication Flow

```javascript
// Login
1. User enters email + password
2. Frontend calls: POST /api/auth/login
3. Backend returns: { success: true, data: { id, name, email, phone, role, token } }
4. Frontend stores: token in localStorage, user in context
5. API interceptor adds: Authorization: Bearer {token}
6. User redirected to /temples

// Protected Routes
- Redirects to /login if no auth
- All booking/profile operations require token
- 401 errors clear localStorage and redirect to login
```

## 🎨 Component Props & Data Flow

### TempleCard
```javascript
Props: { temple: { _id, templeName, location, ... } }
Shows: Temple emoji, name, location, "Book Darshan" button
```

### SlotCard
```javascript
Props: { slot: { _id, date, startTime, endTime, availableSeats, price, ... } }
Shows: Time slot, date, available seats, price, "Book Now" button
```

### BookingCard
```javascript
Shows: Temple name, location, date, time, people count, total, actions
Actions: Download ticket, cancel booking
```

## 🛠️ Common Issues & Fixes

### Issue: "Cannot read property 'templeName' of undefined"
**Fix**: Backend returns populated data, ensure proper destructuring

### Issue: Login redirects to home instead of /temples
**Fix**: Check AuthContext.jsx properly extracts user from res.data.data

### Issue: Booking shows 0 slots
**Fix**: Ensure backend has slot data, check templeId is correct

### Issue: PDF download shows [object Object]
**Fix**: Ensure slot is populated with templeId data: `booking.slotId.templeId.templeName`

## 📊 Data Response Structures

### Login Response
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "USER",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Temples Response
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "templeName": "Badrinath",
      "location": "Uttarakhand",
      "darshanStartTime": "06:00",
      "darshanEndTime": "18:00"
    }
  ]
}
```

### Slots Response
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "templeId": {...},
      "date": "2026-03-10",
      "startTime": "10:00",
      "endTime": "11:00",
      "availableSeats": 50,
      "price": 100
    }
  ]
}
```

### Bookings Response
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "userId": {...},
      "slotId": {
        "_id": "507f1f77bcf86cd799439012",
        "templeId": {...},
        "date": "2026-03-10",
        "startTime": "10:00",
        "endTime": "11:00",
        "availableSeats": 49,
        "price": 100
      },
      "numberOfPeople": 1,
      "createdAt": "2026-03-06T10:30:00Z"
    }
  ]
}
```

## ✅ Checklist Before Deployment

- [ ] Backend running on port 5000
- [ ] MongoDB connected
- [ ] Environment variables set
- [ ] Frontend running on Vite dev server
- [ ] Create test user account
- [ ] Book a test slot
- [ ] Download test ticket PDF
- [ ] Test cancel booking
- [ ] Test logout
- [ ] Check responsive design on mobile
- [ ] All toast notifications appear
- [ ] No console errors

## 🚨 Error Handling

All API errors are caught and shown as toast notifications:
```javascript
catch (error) {
  const msg = error.response?.data?.message || "Operation failed";
  toast.error(msg);
}
```

Backend error responses should have format:
```json
{
  "success": false,
  "message": "Error description"
}
```

## 📞 Support

If a button doesn't work:
1. Check browser console for errors
2. Check backend terminal for errors
3. Verify API endpoint in network tab
4. Check authentication token in localStorage
5. Re-read the data structure in CHANGES_MADE.md
