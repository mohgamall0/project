const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const bcrypt = require("bcryptjs");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

const rateLimiter = require("./middleware/rateLimiter");

const app = express();

app.use("/", rateLimiter);

app.use(express.json());

app.use(
  "/uploads/posts",
  express.static(path.join(__dirname, "uploads/posts"))
);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Blog API Running..." });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("MongoDB connected");

    const User = require("./models/User");
    const adminEmail = "admin@example.com";

    try {
      const existingAdmin = await User.findOne({ email: adminEmail });
      if (!existingAdmin) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("admin123", salt);

        await User.create({
          name: "Admin User",
          email: adminEmail,
          password: hashedPassword,
          role: "admin",
          bio: "Chief Administrator",
        });

        console.log(
          "First admin user created: admin@example.com / password: admin123"
        );
      } else {
        console.log("Admin already exists, skipping creation.");
      }
    } catch (error) {
      console.error("Error creating admin:", error.message);
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Base URL: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });
