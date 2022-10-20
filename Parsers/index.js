("use strict");
require("dotenv").config();
const { log } = require("./logger");
const siemens_parser = require("./jobs/Siemens");
const philips_parser = require("./jobs/Philips");

// CT: SME00811 SME00812(syntax error at or near "(") SME00816
// MRI: SME01107 SME01109 SME01112
// /opt/hhm-files/C0137/SHIP009/SME00812/EvtApplication_Today.txt
//const path = "/opt/hhm-files/C0137/SHIP009/SME01107/EvtApplication_Today.txt";

const newPath =
  "/opt/mirror/C0137/SHIP009/SME01112/MRI/EvtApplication_Today.txt";
//const newPath = "/opt/mirror/C0137/SHIP009/SME00811/CT/EvtApplication_Today.txt"

const oldPath = "./test_data/SME00001_CT.txt";

const manufacturers = {
  siemens: "siemens",
  ge: "GE",
  philips: "philips",
};

const filePaths = {
  philips: {
    ct_eal: "./test_data/Philips/CT/SME00246/ealinfo.csv",
    ct_events: "./test_data/Philips/CT/SME00246/events.csv"
  },
};

const runJob = async (filePath, manufacturer) => {
  await log("info", "NA", "NA", "runJob", "FN CALL", {
    file: filePath,
  });

  try {
    console.log(manufacturer);
    switch (manufacturer) {
      case "siemens":
        await siemens_parser(filePath);
        break;
      case "philips":
        await philips_parser(filePath);
        break;
      default:
        break;
    }
  } catch (error) {
    await log("error", "NA", "NA", "runJob", "FN CATCH", {
      error: error,
    });
  }
};

const onBoot = async (filePath, manufacturer) => {
  try {
    await log("info", "NA", "NA", "onBoot", `FN CALL`);
    await runJob(filePath, manufacturer);
  } catch (error) {
    await log("error", "NA", "NA", "runJob", "FN CATCH", {
      error: error,
    });
  }
};

onBoot(filePaths.philips.ct_events, manufacturers.philips);
