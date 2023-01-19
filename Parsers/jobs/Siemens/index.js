("use strict");
require("dotenv").config();
const { log } = require("../../logger");
const fs = require("node:fs").promises;
const parse_win_7 = require("./windows_7");
const parse_win_10 = require("./windows_10");

const determineOsVersion = async (jobId, sysConfigData) => {
  await log("info", jobId, sysConfigData.id, "determineOsVersion", "FN CALL");

  const files = await fs.readdir(sysConfigData.hhm_config.file_path);
  if (files.length === 0) {
    await log("warn", jobId, sysConfigData.id, "determineOsVersion", "FN CALL", {message: "No files in directory"});
    return;
  }

  const fileConfig = sysConfigData.hhm_file_config;

  switch (sysConfigData.hhm_config.windowsVersion) {
    case "win_7":
      for await (let file of files) {
        await parse_win_7(jobId, sysConfigData, fileConfig, file);
      }
      break;
    case "win_10":
      for await (let file of files) {
        await parse_win_10(jobId, sysConfigData, fileConfig, file);
      }
      break;
    default:
      break;
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
