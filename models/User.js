const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "User name is required"] },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
    },
    bio: { type: String },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      required: true,
    },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.correctPassword = async function (candidate, hashed) {
  return bcrypt.compare(candidate, hashed);
};

module.exports = mongoose.model("User", userSchema);
