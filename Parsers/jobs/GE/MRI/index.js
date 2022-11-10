("use strict");
require("dotenv").config();
const { log } = require("../../../logger");
const ge_mri_gesys = require("./gesys_parser")


const ge_mri_parsers = async (jobId, filePath, sysConfigData, file_type) => {
  try {
    await log("info", "NA", "NA", "ge_mri_parsers", "FN CALL", {
      file: filePath,
    });
    const gesysLogTest = /gesys/
    if (gesysLogTest.test(file_type)) {
      ge_mri_gesys(jobId, filePath, sysConfigData);
    }
    console.log(file_type)
    /* switch (file_type) {
      case "gesys":
        await ge_mri_gesys(jobId, filePath, sysConfigData);
        break;
      default:
        break;
    } */
  } catch (error) {
    await log("error", "NA", "NA", "ge_mri_parsers", "FN CATCH", {
      error: error,
      file: filePath,
      type: file_type
    });
  }
};

module.exports = ge_mri_parsers;