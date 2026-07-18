const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    vendorId: {
        type: mongoose.Types.ObjectId,
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 20,
    },
    username: {
        type: String,
        unnique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone_no: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 14,
        unique: true
    },
    whatsapp_no: {
        type: String,
        required: false,
        trim: true,
        minlength: 10,
        maxlength: 14
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    role: {
        type: String,
        enum: ["user", "vendor", "admin"],
        default: "user",
        required: true,
    },
    updated_by: {
        type: mongoose.Types.ObjectId,
        required: true,
        index: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedBy: {
        type: mongoose.Types.ObjectId,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);