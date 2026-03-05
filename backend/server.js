const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
const contactRoutes = require("./routes/contactRoutes");
const authRoutes = require("./routes/authRoutes");
const { ensureAdminExists } = require("./controllers/authController");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB().then(() => ensureAdminExists());

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);

const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.get("*", (req, res) => {
  res.status(404).sendFile(path.join(frontendPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
