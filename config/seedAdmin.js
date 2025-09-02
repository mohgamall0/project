const User = require("../models/User");

const createFirstAdminIfNeeded = async () => {
  try {
    const count = await User.countDocuments({ role: "admin" });
    if (count > 0) return;
    const name = process.env.ADMIN_NAME || "Admin";
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password) {
      console.warn(
        "ADMIN_EMAIL or ADMIN_PASSWORD missing. Skipping admin seeding."
      );
      return;
    }
    await User.create({ name, email, password, role: "admin" });
    console.log(`First admin created: ${email}`);
  } catch (err) {
    console.error("Error seeding admin:", err.message);
  }
};

module.exports = createFirstAdminIfNeeded;
