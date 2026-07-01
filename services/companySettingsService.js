const CompanySettings = require('../models/CompanySetting');
const logger = require('../utils/logger');

const fetchCompanySettingsByVendorId = async (vendorId) => {
    try {
        logger.logInfo('Fetching company settings from DB', { vendorId });
        const settings = await CompanySettings.findOne({ vendorId });
        if (!settings) {
            logger.logError('Company settings not found', { vendorId });
            return null;
        }
        logger.logInfo('Company settings fetched successfully', { vendorId });
        return settings;
    } catch (err) {
        logger.logException(`Exception while fetching company settings from DB in service`, {err});
        return null;
    }
}

module.exports = {
  fetchCompanySettingsByVendorId
};