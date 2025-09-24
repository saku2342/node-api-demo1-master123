const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middleware

// Allow all origins (for testing)
app.use(cors());

// Or restrict to your frontend domain
// app.use(cors({ origin: "https://your-frontend.com" }));

app.use(express.json());

// Health endpoint
app.get("/health", (req, res) => {
  res.json({ status: "API is healthy 🚀! - hurrrryyyyyyyy !" });
});

// Routes
app.use("/api/users", userRoutes);

module.exports = app;
