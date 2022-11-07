("use strict");
require("dotenv").config();
const { log } = require("../../logger");
const parse_win_7 = require("./windows_7");
const parse_win_10 = require("./windows_10");

const runJob = async (jobId, filePath, sysConfigData) => {
  await log("info", jobId, "NA", "runJob", "FN CALL", {
    file: filePath,
  });
  console.log(sysConfigData[0].hhm_config[0].file_type);
  switch (sysConfigData[0].hhm_config[0].file_type) {
    case "win_7":
      parse_win_7(jobId, filePath, sysConfigData);
      break;
    case "win_10":
      parse_win_10(jobId, filePath, sysConfigData);
      break;
    default:
      break;
  }
  try {
  } catch (error) {
    await log("error", jobId, "NA", "runJob", "FN CATCH", {
      error: error,
    });
  }
};

module.exports = runJob;

/* const parsed_data = await parse_win_10(filePath);
    console.log(parsed_data);
    if (parsed_data === undefined) {
      await parse_win_7(filePath);
    } */
