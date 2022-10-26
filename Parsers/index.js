("use strict");
require("dotenv").config();
const { log } = require("./logger");
const siemens_parser = require("./jobs/Siemens");
const philips_parser = require("./jobs/Philips");
const ge_parser = require("./jobs/GE")
const pgPool = require("./db/pg-pool");
const { get_sme } = require("./utils/regExHelpers");

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
  ge: "ge",
  philips: "philips",
};

const filePaths = {
  philips: {
    ct_eal: "./test_data/Philips/CT/SME00246/ealinfo.csv",
    ct_events: "./test_data/Philips/CT/SME00246/events.csv",
  },
  ge: {
    gesys: "./test_data/GE/MRI/SME01096/gesys_mroc.log",
  },
  siemens: {
    ct_7: "./test_data/SME00001_CT.txt",
    ct_10: "/opt/mirror/C0137/SHIP009/SME00811/CT/EvtApplication_Today.txt",
    mri_10: "/opt/mirror/C0137/SHIP009/SME01112/MRI/EvtApplication_Today.txt"
  }
};

const runJob = async (filePath, manufacturer) => {
  await log("info", "NA", "NA", "runJob", "FN CALL", {
    file: filePath,
  });

  try {
    console.log(manufacturer, filePath);
    switch (manufacturer) {
      case "siemens":
        await siemens_parser(filePath);
        break;
      case "philips":
        await philips_parser(filePath);
        break;
        case "ge":
        await ge_parser(filePath);
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
