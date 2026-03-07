const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createTemple,
  getTemples,
  getTempleById,
  updateTemple,
  deleteTemple,
  getOrganizerTemple
} = require("../controllers/templeController");

router.post("/", authMiddleware, createTemple);
router.get("/", getTemples);
router.get("/organizer/my-temple", authMiddleware, getOrganizerTemple);
router.get("/:id", getTempleById);
router.put("/:id", authMiddleware, updateTemple);
router.delete("/:id", authMiddleware, deleteTemple);

module.exports = router;