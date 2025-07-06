const mongoose = require("mongoose");

mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;

db.on("connected", () => {
    console.log("Database connected successfully");
})

db.on("err", () => {
    console.log("Database connection failed");
})

module.exports = db;