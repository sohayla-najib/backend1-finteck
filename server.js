require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { sequelize, connectDB } = require("./config/database");
const authenticate = require("./src/config/middleware/authMiddleware"); // ✅ Fixed import
const authRoutes = require("./src/config/routes/auth");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to DB
connectDB();

// Sync Database (only use in development)
sequelize.sync({ alter: true });

// Routes
app.use("/api/auth", authRoutes);

// Protected Home Route
app.get("/api/home", authenticate, async (req, res) => { // ✅ Now authenticate is defined
  try {
    res.json({ message: `Welcome, ${req.user.name}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error, please try again" });
  }
});

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
