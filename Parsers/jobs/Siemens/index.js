("use strict");
require("dotenv").config();
const { log } = require("../../logger");
const parse_win_7 = require("./windows_7");
const parse_win_10 = require("./windows_10");

const determineOsVersion = async (jobId, sysConfigData) => {
  await log("info", jobId, sysConfigData.id, "determineOsVersion", "FN CALL");

  for await (const file of sysConfigData.file_config) {
    switch (sysConfigData.hhm_config.windowsVersion) {
      case "win_7":
        await parse_win_7(jobId, sysConfigData, file);
        break;
      case "win_10":
        await parse_win_10(jobId, sysConfigData, file);
        break;
      default:
        break;
    }
  }

  try {
  } catch (error) {
    await log(
      "error",
      jobId,
      sysConfigData.id,
      "determineOsVersion",
      "FN CATCH",
      {
        error: error,
      }
    );
  }
};

module.exports = determineOsVersion;

/* const parsed_data = await parse_win_10(filePath);
    console.log(parsed_data);
    if (parsed_data === undefined) {
      await parse_win_7(filePath);
    } */
