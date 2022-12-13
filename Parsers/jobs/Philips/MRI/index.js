("use strict");
require("dotenv").config();
const { log } = require("../../../logger");
const phil_mri_logcurrent = require("./logcurrent");
const phil_mri_rmmu_short = require("./rmmu_short_cryogenic");
const phil_mri_rmmu_long = require("./rmmu_long_cryogenic");
const phil_mri_monitor_jsonb = require("./insert_jsonb_data");
const phil_mri_monitor_display = require("./insert_display_data");
const phil_mri_rmmu_magnet = require("./rmmu_magnet");
const phil_mri_rmmu_history = require("./rmmu_history");

const philips_mri_parsers = async (jobId, sysConfigData) => {
  const file_types = sysConfigData.hhm_config.file_types;
  try {
    await log("info", jobId, "NA", "philips_mri_parsers", "FN CALL");
    

    console.log(file_types)

    for await (const file of file_types) {
      //console.log(file)
      switch (file.file) {
        case "logcurrent":
          await phil_mri_logcurrent(jobId, sysConfigData, file);
          break;
        case "rmmu_short_":
          await phil_mri_rmmu_short(jobId, sysConfigData, file);
          break;
        case "rmmu_long_":
          await phil_mri_rmmu_long(jobId, sysConfigData, file);
          break;
        case "rmmu_magnet":
          await phil_mri_rmmu_magnet(jobId, sysConfigData, file);
          break;
        /* case "rmmu_history.log":
          await phil_mri_rmmu_history(jobId, sysConfigData, file);
          break; */
        case "monitor":
          const data = await phil_mri_monitor_jsonb(
            jobId,
            filePath,
            sysConfigData
          );
          await phil_mri_monitor_display(jobId, filePath, sysConfigData, data);
          break;
        default:
          break;
      }
    }
  } catch (error) {
    console.log(error)
    await log("error", jobId, "NA", "philips_mri_parsers", "FN CATCH", {
      error: error,
      type: file_types.file,
    });
  }
};

module.exports = philips_mri_parsers;
