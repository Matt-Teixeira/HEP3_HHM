("use strict");
require("dotenv").config();
const { log } = require("../../../logger");
const ge_ct_gesys = require("./gesys_parser");


const ge_ct_parsers = async (filePath, file_type) => {
  try {
    await log("info", "NA", "NA", "ge_ct_parsers", "FN CALL", {
      file: filePath,
    });
    console.log(filePath, file_type)
    switch (file_type) {
      case "gesys":
        await ge_ct_gesys(filePath);
        break;
      default:
        break;
    }
  } catch (error) {
    await log("error", "NA", "NA", "ge_ct_parsers", "FN CATCH", {
      error: error,
    });
  }
};

module.exports = ge_ct_parsers;