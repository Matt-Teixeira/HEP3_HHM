("use strict");
require("dotenv").config();
const { log } = require("../../logger");
const eal_info_parser = require("./eal_info_parser");
const phil_ct_events = require("./events_parser");

const runJob = async (filePath) => {
  await log("info", "NA", "NA", "runJob", "FN CALL", {
    file: filePath,
  });

  try {
    const parsed_data = await eal_info_parser(filePath);
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
