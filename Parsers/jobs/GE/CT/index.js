("use strict");
require("dotenv").config();
const { log } = require("../../../logger");
const ge_ct_gesys = require("./gesys_parser");

const ge_ct_parsers = async (jobId, sysConfigData) => {
  try {
    await log("info", jobId, "NA", "ge_ct_parsers", "FN CALL");

    const file_list = sysConfigData.hhm_config.file_types;

    for await (const file of file_list) {
      switch (file.file) {
        case "gesys":
          console.log("In gesys");
          await ge_ct_gesys(jobId, sysConfigData, file);
          break;

        default:
          break;
      }
    }
  } catch (error) {
    await log("error", jobId, "NA", "ge_ct_parsers", "FN CATCH", {
      error: error,
    });
  }
};

module.exports = ge_ct_parsers;
