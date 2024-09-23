// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');  // Ensure the correct path to your User model

const app = express();  

// Middleware to parse JSON
app.use(express.json());  

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/UserData', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("MongoDB Connection Error:", err));

// Create User Endpoint
app.post('/create-user', async (req, res) => {
    try {
        const existingUser = await User.findOne({ $or: [{ id: req.body.id }, { rollNo: req.body.rollNo }] });
        if (existingUser) {
            return res.status(400).json({ message: "User with this ID or Roll No already exists" });
        }

        const newUser = new User(req.body);  // Create a new User instance
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);  
    } catch (err) {
        console.error("Error Creating User:", err);
        res.status(500).json({ message: "Error creating user", error: err.message });
    }
});

// Update User Endpoint
app.put('/update-user/:id', async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(updatedUser);  
    } catch (err) {
        console.error("Error Updating User:", err);
        res.status(500).json({ message: "Error updating user", error: err.message });
    }
});

// Get All Users Endpoint
app.get('/get-students', async (req, res) => {
    try {
        const users = await User.find();  // Fetch all users from the database
        res.status(200).json(users);  // Return the users in the response
    } catch (err) {
        console.error("Error Fetching Users:", err);
        res.status(500).json({ message: "Error fetching users", error: err.message });
    }
});

// Get Specific User Endpoint
app.get('/get-student/:id', async (req, res) => {
    try {
        const user = await User.findOne({ id: req.params.id });  // Find user by ID

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);  // Return the user data
    } catch (err) {
        console.error("Error Fetching User:", err);
        res.status(500).json({ message: "Error fetching user", error: err.message });
    }
});

// Delete User Endpoint
app.delete('/delete-user/:id', async (req, res) => {
    try {
        const deletedUser = await User.findOneAndDelete({ id: req.params.id });

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully", deletedUser });  
    } catch (err) {
        console.error("Error Deleting User:", err);
        res.status(500).json({ message: "Error deleting user", error: err.message });
    }
});

// Start the Express server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
