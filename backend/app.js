const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const profileRoutes = require("./routes/profileRoutes");
const dns = require("dns");

app.use(express.json());
app.use(cors());
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const mongoUrl = process.env.MONGODB_URL;
mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Mongodb connected...");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/profile", profileRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "../frontend/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html")),
  );
}

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Backend is running on port ${port}`);
});
