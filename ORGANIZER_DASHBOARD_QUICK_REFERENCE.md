# Organizer Dashboard - Quick Reference

## Accessing the Dashboard

### URL
- Direct access: `http://localhost:3000/organizer/dashboard`
- Via Navbar: Click "📊 Dashboard" link (visible when logged in as organizer)

### Access Requirements
- Must be logged in as an **ORGANIZER** user
- Non-organizers will be redirected to `/temples`

## Dashboard Features Quick Guide

### 📊 Tab 1: Profile Management
**What Can I Do?**
- View current profile information (name, email, phone)
- Edit name, email, and phone number
- Change password securely
- Save changes with one click

**Form Fields:**
- Name
- Email
- Phone
- Password (optional, only if changing)

**Buttons:**
- 💾 Save Changes - Updates your profile
- 🔐 Change Password - Toggle password change mode

---

### 📅 Tab 2: Slot Management
**What Can I Do?**
- View all available slots
- See slot details (temple, date, time, capacity, price)
- Delete slots you no longer need

**Slot Information Shown:**
- 🏛️ Temple Name
- 📅 Slot Date
- ⏰ Time (Start - End)
- 👥 Available Seats
- 💰 Price per Person

**Actions:**
- Delete button to remove a slot

---

### 📊 Tab 3: Booking Management
**What Can I Do?**
- View all booking statistics
- See detailed booking information
- Track revenue generation

**Statistics Displayed:**
- 📅 Total Bookings Count
- 💰 Total Revenue (calculated from bookings × price × people)

**Booking Table Shows:**
- Devotee Name
- Temple Name
- Booking Date and Time
- Number of People
- Total Amount

---

## Features Overview

| Feature | Tab | Availability |
|---------|-----|--------------|
| Profile View | 1 | All organizers |
| Profile Edit | 1 | All organizers |
| Password Change | 1 | All organizers |
| View All Slots | 2 | All organizers |
| Delete Slots | 2 | Organizer of that slot |
| View Bookings | 3 | All organizers |
| View Revenue | 3 | Calculated automatically |

## Data Flow

```
User (Organizer) 
    ↓
OrganizerRoute (Checks role)
    ↓
OrganizerDashboard Component
    ↓
    ├─→ User Profile Data (getUserProfile)
    ├─→ Slot Data (getAllSlots)
    └─→ Booking Data (getAllBookings)
    ↓
Display in Tabs with Material-UI
```

## API Calls Made by Dashboard

### Profile Management
```
GET  /api/users/profile/me
PUT  /api/users/profile/update
```

### Slot Management
```
GET    /api/slots
DELETE /api/slots/:id
```

### Booking Management
```
GET /api/bookings
```

All requests include authentication token from localStorage.

## Error Handling

The dashboard handles errors gracefully:
- **Network Errors**: "Failed to load data" toast
- **Update Failures**: "Failed to update profile" toast
- **Deletion Failures**: "Failed to delete slot" toast
- **Unauthorized**: Automatic redirect via OrganizerRoute

## Notifications

Toast notifications appear for:
- ✅ Profile updated successfully
- ✅ Slot deleted successfully
- ❌ Failed operations with error messages
- ⏳ Loading states during data fetch

## Styling & Design

- **Theme Colors**: Gold (#ffc107) for organizer branding
- **Components**: Material-UI tabs, buttons, tables
- **Layout**: Card-based, responsive grid
- **Icons**: Emoji for quick visual reference
- **Tables**: Clean data presentation with hover effects

## Browser Compatibility

The Organizer Dashboard works on:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (responsive design)

## Performance

- Data loaded on tab change (not all at once)
- Proper loading states prevent UI blocking
- Error states handled gracefully
- Toast notifications don't block UI

## Security

- Protected by OrganizerRoute component
- Requires valid authentication token
- Backend validates organizer role
- Password updates are hashed
- All sensitive data excluded from responses

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't access dashboard | Ensure you're logged in as organizer |
| Data not loading | Check internet connection, refresh page |
| Changes not saving | Check browser console for errors, retry |
| Redirected to /temples | Verify your role is "organizer" |
| No slots visible | Create slots first in slot management |

## Future Enhancements

🎯 Planned Features:
- Create new slots directly in dashboard
- Advanced booking analytics with charts
- Export data to CSV/PDF
- Email notifications
- Custom dashboard widgets
- Organizer performance metrics
- Payment settlement tracking
