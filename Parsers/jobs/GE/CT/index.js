("use strict");
require("dotenv").config();
const { log } = require("../../../logger");
const ge_ct_gesys = require("./gesys_parser");

const ge_ct_parsers = async (jobId, filePath, sysConfigData) => {
  try {
    await log("info", jobId, "NA", "ge_ct_parsers", "FN CALL", {
      file: filePath,
    });
    switch (sysConfigData[0].process_data_config.file_type) {
      case "gesys":
        console.log("Running gesys");
        await ge_ct_gesys(jobId, filePath, sysConfigData);
        break;
      default:
        break;
    }
  } catch (error) {
    await log("error", jobId, "NA", "ge_ct_parsers", "FN CATCH", {
      error: error,
      file: filePath,
    });
  }
};

module.exports = ge_ct_parsers;
