const redisKeys = {
  companySettings: (vendorId) => `company-settings:${vendorId}`,
  companyMaster: (vendorId) => `company-master-configuration:${vendorId}`,
  announcement: (vendorID) => `annouuncement:${vendorID}`,
};

module.exports = redisKeys;