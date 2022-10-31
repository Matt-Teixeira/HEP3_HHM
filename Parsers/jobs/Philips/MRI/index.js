("use strict");
require("dotenv").config();
const { log } = require("../../../logger");
const phil_mri_logcurrent = require("./logcurrent");
const phil_mri_rmmu_short = require("./rmmu_short_cryogenic")


const philips_mri_parsers = async (filePath, file_type) => {
  try {
    await log("info", "NA", "NA", "philips_mri_parsers", "FN CALL", {
      file: filePath,
    });
    console.log(file_type)
    switch (file_type) {
      case "logcurrent":
        await phil_mri_logcurrent(filePath);
        break;
      case "rmmu_short_cryogenic20210430030544":
        await phil_mri_rmmu_short(filePath);
        break;
      default:
        break;
    }
  } catch (error) {
    await log("error", "NA", "NA", "philips_mri_parsers", "FN CATCH", {
      error: error,
    });
  }
};

module.exports = philips_mri_parsers;