const CompanySettings = require('../models/CompanySetting');
const logger = require('../utils/logger.js');
const common = require('../utils/common');

const getCompanySettings = async (req, res) => {
    const vendorId = req.vendorId;
  try {
    console.log(`getCompanySettings function is called`);
    logger.logInfo('Fetching company settings from DB', { vendorId });
    
    const settings = await CompanySettings.findOne({ vendorId });
    
    if (!settings) {
      logger.logFailure('Company settings not found', { vendorId });
      return null;
    }
    
    logger.logSuccess('Company settings fetched successfully', { vendorId });
    return common.sendSuccess(res, 200, "Company Settings fecthed successfully", settings);
  } catch (error) {
    logger.logException('Error fetching company settings', { vendorId, error });
    throw error;
  }
};

module.exports = {
  getCompanySettings
};