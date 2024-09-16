const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors');
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const groupRoutes = require("./routes/group");
const messageRoutes = require("./routes/message");

dotenv.config();
connectDB();

// Temporary cors
const corsOptions = {
  origin: "*", // Replace with your client's origin or use '*' for all origins
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type, Authorization",
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/messages", messageRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
