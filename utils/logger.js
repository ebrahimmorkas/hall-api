const logger = require('../config/loggerConfig');

function logInfo(message, meta = {}) {
  logger.info(meta, message);
}

function logWarning(message, meta = {}) {
  logger.warn(meta, message);
}

function logError(message, meta = {}) {
  console.log("I will throw error")
  logger.error(meta, message);
}

function logException(message, err = {}) {
  const errorData = err instanceof Error
    ? {
        message: err.message,
        stack: err.stack,
        name: err.name
      }
    : err;

  logger.error({ error: errorData }, message);
}

module.exports = {
  logInfo,
  logWarning,
  logError,
  logException
};