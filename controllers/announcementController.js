const announcementService = require('../services/announcementService');
const logger = require('../utils/logger');
const common = require('../utils/common');

const addAnnouncement = async (req, res) => {
    const vendorId = req.vendorId;
    try {
        // Step 1: Check WebsiteMaster 
        const websiteMasterData = req.websiteMasterData;
        // console.log(`Here is your website msater data ${websiteMasterData.isAnnouncementFeatureOn}`)
        if (!websiteMasterData?.isAnnouncementFeatureOn) {
            return common.sendError(res, 403, 'This feature is temporarily off');
        }

        // Step 2: Check CompanyMaster (vendor-level toggle)
        const companyMasterData = req.companyMasterData;
        if (!companyMasterData?.isAnnouncementFeatureOn) {
            return common.sendError(res, 403, 'This feature is disabled in your plan');
        }

        // Step 3: Check announcement count against allowed limit
        const { numberOfAnnouncementsAllowed } = companyMasterData;
        const existingCount = await announcementService.getAnnouncementCount(vendorId);
        if (existingCount >= numberOfAnnouncementsAllowed) {
            return common.sendError(res, 403, 'You have exceeded the number of announcements allowed');
        }

        // Step 4: Add announcement
        const announcement = await announcementService.addAnnouncement(vendorId, req.body, existingCount);
        return common.sendSuccess(res, 201, 'Announcement added successfully', announcement);

    } catch (error) {
        logger.logException('announementController - exception in adding announcement', { vendorId, error });
        return common.sendError(res, 500, 'Failed to add announcement');
    }
};

const deleteAnnouncement = async (req, res) => {
    const vendorId = req.vendorId;
    const { announcement_id } = req.body;
    try {
        const result = await announcementService.softDeleteAnnouncement(vendorId, announcement_id);

        if (result.notFound) {
            return common.sendError(res, 404, 'Announcement not found');
        }

        return common.sendSuccess(res, 200, 'Announcement deleted successfully');
    } catch (error) {
        logger.logException('announcementController: deleteAnnouncment - exception in deleting announcement', { vendorId, error });
        return common.sendError(res, 500, 'Failed to delete announcement');
    }
};

const updateAnnouncement = async (req, res) => {
    try {
    const vendorId = req.vendorId;
    const { id: announcement_id } = req.body;
    try {
        const updated = await announcementService.updateAnnouncement(vendorId, announcement_id, req.body);

        if (!updated) {
            return common.sendError(res, 404, 'Announcement not found');
        }

        return common.sendSuccess(res, 200, 'Announcement updated successfully', updated);
    } catch (error) {
        logger.logException('announcementController - exception in updating announcement', { vendorId, error });
        return common.sendError(res, 500, 'Failed to update announcement');
    }
} catch (err) {
    logger.logException(`announcementController: updateAnnouncement - Exception while updating the announcement from controller ${err}`)
}
};

module.exports = {
    addAnnouncement,
    deleteAnnouncement,
    updateAnnouncement
};