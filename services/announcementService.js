const Announcement = require('../models/Announcement');
const logger = require('../utils/logger');

const getAnnouncementCount = async (vendorId) => {
    try {
    return await Announcement.countDocuments({ vendorId, isDeleted: false });
    } catch(err) {
        logger.logException(`announcementService: getAnnouncementCount - Exception while getting Announcement count`)
    }
};

const addAnnouncement = async (vendorId, announcementData, existingCount) => {
    try {
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
} catch (err) {
    logger.logException(`announcementService: addAnnouncement - Exception while adding thew announcement ${err, vendorId}`);
}
};

const softDeleteAnnouncement = async (vendorId, announcementId) => {
    try {
        const announcement = await Announcement.findOne({ _id: announcementId, vendorId, isDeleted: false });
        if (!announcement) return { notFound: true };

        // Soft delete
        announcement.isDeleted = true;
        announcement.isDefault = false;
        await announcement.save();

        // If deleted announcement was default, auto-assign lowest precedence remaining as new default
        if (announcement.isDefault) {
            const nextDefault = await Announcement.findOne(
                { vendorId, isDeleted: false },
                null,
                { sort: { precedence: 1 } }
            );
            if (nextDefault) {
                nextDefault.isDefault = true;
                await nextDefault.save();
                logger.logInfo('New default announcement assigned', { vendorId, announcementId: nextDefault._id });
            }
        }

        // Re-order remaining announcements to fill precedence gaps cleanly
        const remaining = await Announcement.find(
            { vendorId, isDeleted: false },
            null,
            { sort: { precedence: 1 } }
        );

        const bulkOps = remaining.map((ann, index) => ({
            updateOne: {
                filter: { _id: ann._id },
                update: { $set: { precedence: index + 1 } }
            }
        }));

        if (bulkOps.length > 0) {
            await Announcement.bulkWrite(bulkOps);
        }

        logger.logInfo('Announcement soft deleted and precedences re-ordered', { vendorId, announcementId });
        return { deleted: true };
    } catch (err) {
        logger.logException(`announcementService: softDeleteAnnouncement - Exception while deleting the announcement ${vendorId, announcementId}`);
    }
};

module.exports = {
    addAnnouncement,
    getAnnouncementCount,
    softDeleteAnnouncement
};