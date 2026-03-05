const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createTemple,
  getTemples,
  getTempleById,
  updateTemple,
  deleteTemple
} = require("../controllers/templeController");

router.post("/", authMiddleware, createTemple);
router.get("/", getTemples);
router.get("/:id", getTempleById);
router.put("/:id", authMiddleware, updateTemple);
router.delete("/:id", authMiddleware, deleteTemple);

module.exports = router;