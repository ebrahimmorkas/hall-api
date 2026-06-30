const CompanyMaster = require('../models/CompanyMaster');
const logger = require('../utils/logger.js');
const common = require('../utils/common');

const getCompanyMasterData = async (req, res) => {
  try {
    const vendorId = req.vendorId;
    logger.logInfo('Fetching company master data from DB', { vendorId });
    
    const companyMasterData = await CompanyMaster.findOne({ vendorId });
    
    if (!companyMasterData) {
      logger.logFailure('Company master data not found', { vendorId });
      return null;
    }
    
    logger.logSuccess('Company master data fetched successfully', { vendorId });
    common.sendSuccess(res, 200, "Company master data fecthed successfully", companyMasterData);
  } catch (error) {
    logger.logException('Error fetching company settings', { vendorId, error });
    throw error;
  }
};

module.exports = {
  getCompanyMasterData
};