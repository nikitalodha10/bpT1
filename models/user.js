// models/user.js
const mongoose = require('mongoose');

// Define the schema
const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    rollNo: {
        type: Number,
        required: true,
        unique: true
    },
    phoneNo: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /\d{10}/.test(v); // Ensures it's a 10-digit phone number
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    address: {
        type: String,
        required: true
    },
    parentsPhoneNo: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /\d{10}/.test(v); // Validates it's a 10-digit number
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    std: {
        type: String,
        required: true
    }
});

// Create a model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
