("use strict");
require("dotenv").config();
const { log } = require("../../../logger");
const ge_mri_gesys = require("./gesys_parser")


const ge_mri_parsers = async (jobId, sysConfigData) => {
  try {
    await log("info", jobId, "NA", "ge_ct_parsers", "FN CALL");

    const file_list = sysConfigData.hhm_config.file_types;

    for await (const file of file_list) {
      switch (file.file) {
        case "gesys":
          await ge_mri_gesys(jobId, sysConfigData, file);
          break;

        default:
          break;
      }
    }

  } catch (error) {
    await log("error", "NA", "NA", "ge_mri_parsers", "FN CATCH", {
      error: error,
      file: filePath,
      type: file_type
    });
  }
};

module.exports = ge_mri_parsers;