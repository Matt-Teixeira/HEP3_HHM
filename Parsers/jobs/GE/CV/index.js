("use strict");
require("dotenv").config();
const { log } = require("../../../logger");
const ge_cv_sysError = require("./sysError_parser");

const ge_mri_parsers = async (jobId, filePath, sysConfigData, file_type) => {
  try {
    await log("info", "NA", "NA", "ge_mri_parsers", "FN CALL", {
      file: filePath,
    });
    switch (file_type) {
      case "sysError":
        await ge_cv_sysError(jobId, filePath, sysConfigData);
        break;
      default:
        break;
    }
  } catch (error) {
    await log("error", "NA", "NA", "ge_mri_parsers", "FN CATCH", {
      error: error,
    });
  }
};

module.exports = ge_mri_parsers;
