require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Sequelize, DataTypes, Op } = require("sequelize");

// Database Configuration
const sequelize = new Sequelize(
  process.env.DB_NAME || "finance_tracker",
  process.env.DB_USER || "root",
  process.env.DB_PASS || "",
  {
    dialect: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    logging: console.log,
  }
);

const connect = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL Connection Established Successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error.message);
    process.exit(1);
  }
};
connect();

// Models
const User = sequelize.define("User", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
});

const Income = sequelize.define("Income", {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATE, allowNull: false },
});

const Expense = sequelize.define("Expense", {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATE, allowNull: false },
});

User.hasMany(Income, { foreignKey: "userId" });
User.hasMany(Expense, { foreignKey: "userId" });

sequelize.sync();

// Express App Setup
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Register User
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ error: "User already exists!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword});
    res.json({ message: "✅ User registered successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error, please try again" });
  }
});

// Login User
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, name: user.name }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
    res.json({ token, name: user.name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Authentication Middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET || "secret", (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
};

// Get Home Page Data
app.get("/api/home", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const totalIncome = await Income.sum("amount", { where: { userId } }) || 0;
    const totalExpenses = await Expense.sum("amount", { where: { userId } }) || 0;
    const totalAmount = totalIncome - totalExpenses;

    res.json({ name: user.name, totalAmount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Reports API
app.get("/api/reports/:type", authenticate, async (req, res) => {
  const { type } = req.params;
  const { id } = req.user;
  let startDate;

  if (type === "yearly") startDate = new Date(new Date().getFullYear(), 0, 1);
  else if (type === "monthly") startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  else if (type === "weekly") startDate = new Date(new Date().setDate(new Date().getDate() - 7));
  else return res.status(400).json({ message: "Invalid report type" });

  const incomes = await Income.findAll({ where: { userId: id, date: { [Op.gte]: startDate } } });
  const expenses = await Expense.findAll({ where: { userId: id, date: { [Op.gte]: startDate } } });

  res.json({ incomes, expenses });
});

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
