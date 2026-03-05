const express = require("express");
const { submitContactForm, getAllContacts } = require("../controllers/contactController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", submitContactForm);
router.get("/", protect, getAllContacts);

module.exports = router;
