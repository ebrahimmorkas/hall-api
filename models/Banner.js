const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
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
    image: {
        type: String,
        required: true
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


bannerSchema.pre('validate', function() {
  if (this.endDate <= this.startDate) {
    throw new Error('endDate must be greater than startDate');
  }
});

module.exports = mongoose.model("Banner", bannerSchema);