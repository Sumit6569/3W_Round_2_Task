const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bankRoutes = require("./routes/bank"); // ✅ Correct path
const authRoutes = require("./routes/auth"); // ✅ Correct path

const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/banks", bankRoutes); // ✅ This is critical
app.use("/api/auth", authRoutes); // ✅ This is critical

// Example DB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"),console.log("MongoDB connection successful",process.env.MONGO_URI))
  .catch((err) => console.log("MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
