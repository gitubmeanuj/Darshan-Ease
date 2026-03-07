# 🏛️ Temple Images - Complete Setup Guide

## Current Status
✅ **Seed script updated** - Ready to use new image filenames  
✅ **Image mapping updated** - Each temple has dedicated image file  
✅ **All images created** - 9 temple images ready to use

---

## Image Files Setup

### All Temple Images (9 total)
All images are now present in your system:
- ✅ `Badrinath.jpg` → Badrinath Temple
- ✅ `Rameswaram.jpg` → Rameswaram Temple  
- ✅ `temple1.jpg` → Vaishno Devi Temple
- ✅ `Vrindavan.jpg` → Prem Mandir (Mathura)
- ✅ `Kedarnath.jpg` → Kedarnath Temple
- ✅ `Somnath.jpg` → Somnath Temple
- ✅ `KamakhyaDevi.jpg` → Kamakhya Devi Temple
- ✅ `KashiVishwanath.jpg` → Kashi Vishwanath Temple
- ✅ `Meenakshi.jpg` → Meenakshi Temple

| Temple Name | Image Filename | Search Term |
|---|---|---|
| Kedarnath | `Kedarnath.jpg` | "Kedarnath Temple Uttarakhand" |
| Somnath | `Somnath.jpg` | "Somnath Temple Gujarat" |
| Kamakhya Devi | `KamakhyaDevi.jpg` | "Kamakhya Temple Assam" |
| Kashi Vishwanath | `KashiVishwanath.jpg` | "Kashi Vishwanath Temple Varanasi" |
| Meenakshi Temple | `Meenakshi.jpg` | "Meenakshi Temple Madurai" |

---

## Step-by-Step Setup Instructions

### Step 1: All Images Ready ✅
All 9 temple images are already configured and ready to use.

### Step 2: Run Seed Script
```powershell
cd .\darshan-backend
node seed.js
```

### Step 3: Start Servers
**Terminal 1 - Backend:**
```powershell
cd .\darshan-backend
npm start
```

**Terminal 2 - Frontend:**
```powershell
cd .\Frontend
npm run dev
```

### Step 4: View Temples
Navigate to the temples page to see all 9 temples with their matching images displayed in cards!

---

## Image Matching
The mapping is now configured as follows:

| Temple | Image File | Status |
|---|---|---|
| Badrinath | Badrinath.jpg | ✅ Matched |
| Rameswaram | Rameswaram.jpg | ✅ Matched |
| Vaishno Devi | temple1.jpg | ✅ Matched |
| **Prem Mandir (Mathura)** | **Vrindavan.jpg** | ✅ Matched |
| **Kedarnath** | **Kedarnath.jpg** | ✅ Matched |
| **Somnath** | **Somnath.jpg** | ✅ Matched |
| **Kamakhya Devi** | **KamakhyaDevi.jpg** | ✅ Matched |
| **Kashi Vishwanath** | **KashiVishwanath.jpg** | ✅ Matched |
| **Meenakshi Temple** | **Meenakshi.jpg** | ✅ Matched |

---

## Image Specifications
- **Format**: JPG recommended (PNG also works)
- **Size**: Minimum 400x300px (recommended 800x600px)
- **File Size**: Keep under 1MB for faster loading
- **Quality**: High resolution (300dpi or higher preferred)

---

## Troubleshooting

### Images not showing on Temples page?
1. Check image filenames are **exact match** (case-sensitive!)
2. Verify images are in `darshan-backend/assets/images/`
3. Backend must be running on port 5000
4. Hard refresh browser (Ctrl+Shift+R)

### Wrong image shows for a temple?
1. Check `templeImageMap.js` for correct mapping
2. Verify database has correct image path (run seed.js again)
3. Clear browser cache and refresh

### Image file giving error?
- Ensure filename has no extra spaces
- Use only alphanumeric characters and hyphens
- Example: `Kedarnath.jpg` ✅ (not `Kedarnath Temple.jpg`)

---

## Quick Reference
```
Download 5 images → Place in assets/images/ → Run seed.js → Restart servers → Done!
```
