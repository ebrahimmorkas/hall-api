const Announcement = require('../models/Announcement');
const logger = require('../utils/logger');

const addAnnouncement = async (vendorId, announcementData, existingCount) => {
    // First announcement ever → isDefault true, else false
    const isDefault = existingCount === 0;

    // Precedence handling
    let { precedence } = announcementData;

    if (!precedence) {
        // Auto-assign as last
        precedence = existingCount + 1;
    } else {
        // Check if given precedence already exists for this vendor
        const conflictExists = await Announcement.exists({
            vendorId,
            precedence,
            isDeleted: false
        });

        if (conflictExists) {
            // Shift all announcements with precedence >= given precedence by 1
            await Announcement.updateMany(
                { vendorId, precedence: { $gte: precedence }, isDeleted: false },
                { $inc: { precedence: 1 } }
            );
        }
    }

    const announcement = new Announcement({
        vendorId,
        name: announcementData.name,
        heading: announcementData.heading || null,
        content: announcementData.content,
        startDate: announcementData.startDate,
        endDate: announcementData.endDate,
        isDefault,
        precedence
    });

    const saved = await announcement.save();
    logger.logInfo('Announcement added successfully', { vendorId, announcementId: saved._id });
    return saved;
};

const getAnnouncementCount = async (vendorId) => {
    return await Announcement.countDocuments({ vendorId, isDeleted: false });
};

module.exports = {
    addAnnouncement,
    getAnnouncementCount
};