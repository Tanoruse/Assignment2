// seedAdmin.js
require("dotenv").config();
const mongoose = require("mongoose");
const configureMongoose = require("./config/mongoose");
const User = require("./models/user");

async function seedAdmin() {
  await configureMongoose();

  const adminEmail = "admin@example.com";
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = new User({
      username: "AdminUser",
      email: adminEmail,
      password: "admin123", // Will be hashed in pre-save
      role: "Admin",
    });
    await admin.save();
    console.log("Admin user created:", adminEmail);
  } else {
    console.log("Admin user already exists:", adminEmail);
  }
  mongoose.connection.close();
}

seedAdmin();
