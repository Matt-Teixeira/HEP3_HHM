("use strict");
require("dotenv").config();
const { log } = require("../../../logger");
const phil_cv_eventlog = require("./eventlog");

const philips_cv_parsers = async (jobId, sysConfigData) => {
  const file_types = sysConfigData.hhm_config.file_types;

  try {
    await log("info", "NA", "NA", "philips_cv_parsers", "FN CALL");
    for await (const file of file_types) {
      switch (file) {
        case "EventLog.txe":
          await phil_cv_eventlog(jobId, sysConfigData, file);
          break;
        default:
          break;
      }
    }
  } catch (error) {
    console.log(error);
    await log("error", "NA", "NA", "philips_cv_parsers", "FN CATCH", {
      error: error,
      file: filePath,
      type: file_type,
    });
  }
};

module.exports = philips_cv_parsers;
