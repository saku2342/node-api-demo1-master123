const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    age: { type: Number, required: true },
    imageUrl: { type: String }   // store S3 file URL
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);