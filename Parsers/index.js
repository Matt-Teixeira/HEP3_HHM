("use strict");
require("dotenv").config();
const { log } = require("./logger");
const parse_win_7 = require("./jobs/Siemens/windows_7");
const parse_win_10 = require("./jobs/Siemens/windows_10");
// CT: SME00811 SME00812(syntax error at or near "(") SME00816
// MRI: SME01107 SME01109 SME01112
// /opt/hhm-files/C0137/SHIP009/SME00812/EvtApplication_Today.txt
//const path = "/opt/hhm-files/C0137/SHIP009/SME01107/EvtApplication_Today.txt";

const newPath =
  "/opt/mirror/C0137/SHIP009/SME01112/MRI/EvtApplication_Today.txt";
//const newPath = "/opt/mirror/C0137/SHIP009/SME00811/CT/EvtApplication_Today.txt"

const oldPath = "SME00817_CT.txt";

const runJob = async (filePath) => {
  await log("info", "NA", "NA", "runJob", "FN CALL", {
    // sme: SME,

    file: filePath,
  });

  try {
    const parsed_data = await parse_win_10(filePath);
    console.log(parsed_data);
    if (!parsed_data) {
      await parse_win_7(filePath);
    }
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

onBoot(oldPath);
