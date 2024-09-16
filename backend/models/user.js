const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    is_admin: { type: Boolean, default: false }, // Add is_admin field
});

module.exports = mongoose.model('User', UserSchema);
