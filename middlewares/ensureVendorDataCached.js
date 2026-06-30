const redisService = require('../services/redisService');
const redisKeys = require('../utils/redisKeys');
const { getCompanySettings } = require('../controllers/companySettingsController');
const { getCompanyMasterData } = require('../controllers/companyMasterController');
const logger = require('../utils/logger');
const common = require('../utils/common');

const ensureVendorDataCached = async (req, res, next) => {
    try {
        const vendorId = req.vendorId;
        if (!vendorId) {
            logger.logInfo(`Vendor ID not found`);
            return common.sendError(res, 400, `Vendor identification failed`);
        }

        const companySettings = await redisService.getOrSet(
            redisKeys.companySettings(vendorId),
            async () => await getCompanySettings(),
            3600
        );

        const companyMasterData = await redisService.getOrSet(
            redisKeys.companyMaster(vendorId),
            async () => await getCompanyMasterData(),
            3600
        );

        if (!companySettings || !companyMasterData) {
            return common.sendError(res, 500, `Failed to load vendor configuration`);
        }

        req.companySettings = companySettings;
        req.companyMasterData = companyMasterData;
        next();

    } catch (error) {
        logger.logException("Exception in ensuredVendorDataCached middleware", error);
        return res.status(500).json({
            success: false,
            message: 'Failed to load vendor configuration'
        });
    }
};

module.exports = ensureVendorDataCached;