const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const User = require("./models/User");
const verifyToken = require("./middleware/authMiddleware");
const allowRoles = require("./middleware/roleMiddleware");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

app.get("/", (req, res) => {
  res.send("Backend running...");
});

app.get("/seed", async (req, res) => {
  try {
    await User.deleteMany({});

    const adminPassword = await bcrypt.hash("admin123", 10);
    const userPassword = await bcrypt.hash("user123", 10);

    await User.insertMany([
      {
        username: "admin1",
        email: "admin@gmail.com",
        password: adminPassword,
        role: "admin"
      },
      {
        username: "user1",
        email: "user@gmail.com",
        password: userPassword,
        role: "user"
      }
    ]);

    res.json({ message: "Seed users created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error seeding users", error });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

app.get("/admin", verifyToken, allowRoles("admin"), (req, res) => {
  res.json({
    message: "Welcome Admin! You have access to admin dashboard."
  });
});

app.get("/dashboard", verifyToken, allowRoles("admin", "user"), (req, res) => {
  res.json({
    message: `Welcome ${req.user.role}! This is your dashboard.`
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});