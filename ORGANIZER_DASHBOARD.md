# Organizer Dashboard

## Overview
The Organizer Dashboard is a comprehensive management system for temple organizers. It allows organizers to manage their profiles, slots, and view booking statistics.

## Features

### 1. Profile Management
- **View Profile**: Display organizer's current profile information
- **Edit Profile**: Update name, email, and phone number
- **Change Password**: Securely update password

**API Endpoints:**
- `GET /api/users/profile/me` - Get current user profile
- `PUT /api/users/profile/update` - Update user profile

### 2. Slot Management
- **View All Slots**: Display all available slots created by the organizer
- **Edit Slots**: Modify slot details (date, time, price, available seats)
- **Delete Slots**: Remove slots that are no longer needed

**Slot Information Displayed:**
- Temple name
- Slot date
- Start and end time
- Available seats
- Price per person

**API Endpoints:**
- `GET /api/slots` - Get all slots
- `PUT /api/slots/:id` - Update a slot
- `DELETE /api/slots/:id` - Delete a slot

### 3. Booking Management
- **View All Bookings**: Display all bookings across all slots
- **Statistics**: 
  - Total number of bookings
  - Total revenue generated

**Booking Information Displayed:**
- Devotee name
- Temple name
- Booking date and time
- Number of people
- Total amount

**API Endpoints:**
- `GET /api/bookings` - Get all bookings (requires ADMIN or ORGANIZER role)

## Access Control

The Organizer Dashboard is protected by a custom route component `OrganizerRoute` which ensures:
- Only users with `role === "organizer"` can access the dashboard
- Unauthenticated users are redirected to `/temples`
- Users with different roles are redirected to `/temples`

## User Interface

### Navigation
The Organizer Dashboard is accessible from:
1. Navbar menu: "📊 Dashboard" link (visible only for organizers)
2. URL: `/organizer/dashboard`

### Tab Interface
The dashboard uses a tabbed interface with three main sections:

#### Tab 1: Profile Management
- Display current profile information
- Forms to edit name, email, and phone
- Option to change password
- Save button to update profile

#### Tab 2: Slot Management
- Grid display of all available slots
- Each slot card shows:
  - Temple name
  - Date and time
  - Available seats
  - Price
  - Delete button

#### Tab 3: Booking Management
- Statistics block showing:
  - Total bookings
  - Total revenue
- Table displaying:
  - Devotee name
  - Temple name
  - Booking date and time
  - Number of people
  - Total amount

## File Structure

### Frontend Files
- **Component**: `Frontend/src/pages/OrganizerDashboard.jsx` - Main dashboard component
- **Route**: `Frontend/src/components/OrganizerRoute.jsx` - Protected route component
- **Services**: 
  - `Frontend/src/services/userService.js` - User profile operations
  - `Frontend/src/services/bookingService.js` - Booking operations
  - `Frontend/src/services/templeService.js` - Slot operations

### Backend Files
- **Routes**: `darshan-backend/routes/userRoutes.js` - User profile endpoints
- **Controllers**: `darshan-backend/controllers/userController.js` - User profile logic
- **Models**: `darshan-backend/models/User.js` - User data structure

## Styling

The dashboard uses Material-UI (MUI) components combined with custom CSS for:
- Professional card-based layout
- Tabbed navigation
- Data table display
- Statistics boxes
- Responsive grid layout

## Error Handling

The dashboard includes error handling for:
- Failed data fetching
- Profile update failures
- Slot deletion failures
- Network errors

Toast notifications display success/error messages to users.

## Dependencies

- React (Context, Hooks)
- Material-UI (Tabs, Dialog, Button, TextField)
- React Hot Toast (notifications)
- Axios (API calls)
- React Router (routing)

## Future Enhancements

Possible enhancements for the Organizer Dashboard:
1. Slot creation interface
2. Advanced booking analytics and charts
3. Export booking data to CSV/PDF
4. Email notifications for bookings
5. Customizable dashboard widgets
6. Organizer performance metrics
7. Payment settlements tracking
