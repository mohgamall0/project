const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

dotenv.config();

const connectDB = require("./config/db");
const seedAdmin = require("./config/seedAdmin");
const { notFound, globalError } = require("./middlewares/errorMiddleware");

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

// Rate Limiter (Bonus)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/posts", require("./routes/postRoutes"));

// Health check
app.get("/", (req, res) => res.json({ status: "OK", ts: Date.now() }));

// Error handling
app.use(notFound);
app.use(globalError);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(seedAdmin)
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to start server", err);
    process.exit(1);
  });
