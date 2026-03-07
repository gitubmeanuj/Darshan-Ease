// Map temple names to their image paths
const TEMPLE_IMAGE_MAP = {
  // Original Temples
  "Badrinath": "/assets/images/Badrinath.jpg",
  "Rameswaram": "/assets/images/Rameswaram.jpg",
  "Vaishno Devi": "/assets/images/temple1.jpg",
  "Prem Mandir": "/assets/images/Vrindavan.jpg",
  
  // New Temples - Each with dedicated image
  "Kedarnath": "/assets/images/Kedarnath.jpg",
  "Somnath": "/assets/images/Somnath.jpg",
  "Kamakhya Devi": "/assets/images/KamakhyaDevi.jpg",
  "Kashi Vishwanath": "/assets/images/KashiVishwanath.jpg",
  "Meenakshi Temple": "/assets/images/Meenakshi.jpg",
};

export const getTempleImageUrl = (temple) => {
  if (!temple) return "/assets/images/temple1.jpg";
  
  // If temple has an image path stored in database, use it
  if (temple.image && temple.image.trim()) {
    const imagePath = temple.image;
    // Ensure it's a full URL or properly formatted
    if (imagePath.startsWith("http")) {
      return imagePath;
    }
    // If it starts with /, prepend the API base URL
    if (imagePath.startsWith("/")) {
      return `http://localhost:5000${imagePath}`;
    }
    // Otherwise, assume it's just a path and prepend the assets URL
    return `http://localhost:5000/assets/images/${imagePath}`;
  }
  
  // Fall back to temple name mapping
  const templateName = temple.templeName || temple.name;
  if (TEMPLE_IMAGE_MAP[templateName]) {
    return `http://localhost:5000${TEMPLE_IMAGE_MAP[templateName]}`;
  }
  
  // Default fallback image
  return `http://localhost:5000/assets/images/temple1.jpg`;
};

export default TEMPLE_IMAGE_MAP;
