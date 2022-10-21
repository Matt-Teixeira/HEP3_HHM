("use strict");
require("dotenv").config();
const { log } = require("../../logger");
const ge_mri_gesys = require("./gesys_parser")


const runJob = async (filePath) => {
  await log("info", "NA", "NA", "runJob", "FN CALL", {
    file: filePath,
  });

  try {
    const parsed_data = await ge_mri_gesys(filePath);
    //const parsed_data = await eal_info_parser(filePath);
  } catch (error) {
    await log("error", "NA", "NA", "runJob", "FN CATCH", {
      error: error,
    });
  }
};

const onBoot = async (filePath) => {
  try {
    await log("info", "NA", "NA", "onBoot", `FN CALL`);
    await runJob(filePath);
  } catch (error) {
    await log("error", "NA", "NA", "runJob", "FN CATCH", {
      error: error,
    });
  }
};

module.exports = onBoot;