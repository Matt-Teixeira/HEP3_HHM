("use strict");
require("dotenv").config();
const { log } = require("../../../logger");
const phil_cv_eventlog = require("./eventlog");



const philips_cv_parsers = async (filePath, file_type) => {
  try {
    await log("info", "NA", "NA", "philips_cv_parsers", "FN CALL", {
      file: filePath,
    });
    console.log(file_type)
    switch (file_type) {
      case "EventLog":
        await phil_cv_eventlog(filePath);
        break;
      default:
        break;
    }
  } catch (error) {
    await log("error", "NA", "NA", "philips_cv_parsers", "FN CATCH", {
      error: error,
    });
  }
};

module.exports = philips_cv_parsers;