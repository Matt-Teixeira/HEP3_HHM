("use strict");
require("dotenv").config();
const { log } = require("../../../logger");
const eal_info_parser = require("./eal_info_parser");
const phil_ct_events = require("./events_parser");

const philips_ct_parsers = async (jobId, filePath, sysConfigData, file_type) => {

  try {
    await log("info", jobId, "NA", "philips_ct_parsers", "FN CALL", {
      file: filePath,
    });
    switch (file_type) {
      case "ealinfo":
        await eal_info_parser(jobId, filePath, sysConfigData);
        break;
      case "events":
        await phil_ct_events(jobId, filePath, sysConfigData);
        break;
      default:
        break;
    }
  } catch (error) {
    await log("error", jobId, "NA", "philips_ct_parsers", "FN CATCH", {
      error: error,
      file: filePath,
      type: file_type,
    });
  }
};

module.exports = philips_ct_parsers;
