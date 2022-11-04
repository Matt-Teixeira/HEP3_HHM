("use strict");
require("dotenv").config();
const { log } = require("../../../logger");
const eal_info_parser = require("./eal_info_parser");
const phil_ct_events = require("./events_parser");

const philips_ct_parsers = async (filePath, file_type) => {
  try {
    await log("info", "NA", "NA", "philips_ct_parsers", "FN CALL", {
      file: filePath,
    });
    switch (file_type) {
      case "ealinfo":
        await eal_info_parser(filePath);
        break;
      case "events":
        await phil_ct_events(filePath);
        break;
      default:
        break;
    }
  } catch (error) {
    await log("error", "NA", "NA", "philips_ct_parsers", "FN CATCH", {
      error: error,
      file: filePath,
      type: file_type
    });
  }
};

module.exports = philips_ct_parsers;
