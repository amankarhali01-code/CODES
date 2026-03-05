const Contact = require("../models/Contact");

const submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    const savedEntry = await Contact.create({ name, email, message });

    return res.status(201).json({
      message: "Thank you! Your message has been submitted.",
      id: savedEntry._id,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error while saving contact form." });
  }
};

const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return res.status(200).json(contacts);
  } catch (error) {
    return res.status(500).json({ message: "Server error while fetching contacts." });
  }
};

module.exports = {
  submitContactForm,
  getAllContacts,
};
