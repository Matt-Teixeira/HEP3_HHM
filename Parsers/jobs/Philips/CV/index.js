("use strict");
require("dotenv").config();
const { log } = require("../../../logger");
const phil_cv_eventlog = require("./eventlog");

const philips_cv_parsers = async (
  jobId,
  filePath,
  sysConfigData,
  file_type
) => {
  try {
    await log("info", "NA", "NA", "philips_cv_parsers", "FN CALL", {
      file: filePath,
    });
    console.log(file_type)
    switch (file_type) {
      case "EventLog":
        await phil_cv_eventlog(jobId, filePath, sysConfigData);
        break;
      default:
        break;
    }
  } catch (error) {
    console.log(error)
    await log("error", "NA", "NA", "philips_cv_parsers", "FN CATCH", {
      error: error,
      file: filePath,
      type: file_type,
    });
  }
};

module.exports = philips_cv_parsers;
