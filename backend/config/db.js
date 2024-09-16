const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await initAdmin();
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const initAdmin = async () => {
    try {
        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminUsername || !adminPassword) {
            throw new Error('Admin username or password not provided in .env');
            process.exit(1);
        }

        // Check if an admin user already exists
        const adminExists = await User.findOne({ is_admin: true });

        if (!adminExists) {
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            const admin = new User({ username: adminUsername, password: hashedPassword, is_admin: true });
            await admin.save();
            console.log('Admin user created');
        } else {
            console.log('Admin user already exists');
        }
    } catch (err) {
        console.error('Error initializing admin user:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;