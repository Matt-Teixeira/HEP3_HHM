("use strict");
require("dotenv").config();
const { log } = require("../../logger");
const parse_win_7 = require("./windows_7");
const parse_win_10 = require("./windows_10");

const runJob = async (filePath) => {
  await log("info", "NA", "NA", "runJob", "FN CALL", {
    file: filePath,
  });

  try {
    const parsed_data = await parse_win_10(filePath);
    console.log(parsed_data);
    if (parsed_data === undefined) {
      await parse_win_7(filePath);
    }
  } catch (error) {
    await log("error", "NA", "NA", "runJob", "FN CATCH", {
      error: error,
    });
  }
};

module.exports = runJob;
