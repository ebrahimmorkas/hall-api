const announcementService = require('../services/announcementService');
const logger = require('../utils/logger');
const common = require('../utils/common');

const addAnnouncement = async (req, res) => {
    const vendorId = req.vendorId;
    try {
        // console.log("Request received for adding announcement");
        // Step 1: Check WebsiteMaster (platform-level kill switch)
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
        console.log('ACTUAL ERROR MESSAGE:', error.message);
        console.log('ACTUAL ERROR STACK:', error.stack);
        logger.logException('announementController - exception in adding announcement', { vendorId, error });
        return common.sendError(res, 500, 'Failed to add announcement');
    }
};

module.exports = {
    addAnnouncement
};