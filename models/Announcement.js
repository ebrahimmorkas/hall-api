const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    vendorId: {
        type: mongoose.Types.ObjectId,
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20,
        trim: true
    },
    heading: {
        type: String,
        minlength: 2,
        maxlength: 20,
        trim: true,
        default: null
    },
    content: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 200,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isDefault: {
        type: Boolean,
        default: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    precedence: {
        type: Number,
        min: 1
    }
}, {
    timestamps: true
});


announcementSchema.pre('validate', function(next) {
  if (this.endDate <= this.startDate) {
    return next(new Error('endDate must be greater than startDate'));
  }
  next();
});

module.exports = mongoose.model("Announcement", announcementSchema);