("use strict");
require("dotenv").config();
const { log } = require("../../../logger");
const phil_mri_logcurrent = require("./logcurrent");
const phil_mri_rmmu_short = require("./rmmu_short_cryogenic");
const phil_mri_rmmu_long = require("./rmmu_long_cryogenic");
const phil_mri_monitor = require("./mag_monitor");

const philips_mri_parsers = async (
  jobId,
  filePath,
  sysConfigData,
  file_type
) => {
  try {
    await log("info", "NA", "NA", "philips_mri_parsers", "FN CALL", {
      file: filePath,
    });
    switch (file_type) {
      case "logcurrent":
        await phil_mri_logcurrent(jobId, filePath, sysConfigData);
        break;
      case "rmmu_short_cryogenic20210430030544":
        await phil_mri_rmmu_short(jobId, filePath, sysConfigData);
        break;
      case "rmmu_long_cryogenic20201017030621":
        await phil_mri_rmmu_long(jobId, filePath, sysConfigData);
        break;
      case "monitor":
        await phil_mri_monitor(jobId, filePath, sysConfigData);
        break;
      default:
        break;
    }
  } catch (error) {
    await log("error", "NA", "NA", "philips_mri_parsers", "FN CATCH", {
      error: error,
      file: filePath,
      type: file_type,
    });
  }
};

module.exports = philips_mri_parsers;
