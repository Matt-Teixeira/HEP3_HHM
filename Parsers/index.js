("use strict");
require("dotenv").config();
const { log } = require("./logger");
const pgPool = require("./db/pg-pool");
const siemens_parser = require("./jobs/Siemens");
const philips_parser = require("./jobs/Philips");
const ge_parser = require("./jobs/GE");
const { get_sme } = require("./utils/regExHelpers");

// CT: SME00811 SME00812(syntax error at or near "(") SME00816
// MRI: SME01107 SME01109 SME01112
// /opt/hhm-files/C0137/SHIP009/SME00812/EvtApplication_Today.txt
// /opt/hhm-files/C0137/SHIP009/SME01107/EvtApplication_Today.txt
// /opt/mirror/C0137/SHIP009/SME01112/MRI/EvtApplication_Today.txt
// /opt/mirror/C0137/SHIP009/SME00811/CT/EvtApplication_Today.txt
// ./test_data/SME00001_CT.txt

const manufacturers = {
  siemens: "siemens",
  ge: "ge",
  philips: "philips",
};

const filePaths = {
  philips: {
    ct_eal: "./test_data/Philips/CT/SME00246/ealinfo.csv",
    ct_events: "./test_data/Philips/CT/SME00246/events.csv",
    mri_logcurrent: "./test_data/Philips/MR/SME01401/logcurrent.log",
    mri_rmmu_short:
      "./test_data/Philips/MR/SME01399/rmmu_short_cryogenic20210430030544.log",
    mri_rmmu_long:
      "./test_data/Philips/MR/SME01399/rmmu_long_cryogenic20201017030621.log",
    cv_eventlog_1: "./test_data/Philips/CV/SME00001/EventLog.txe",
    cv_eventlog_2: "./test_data/Philips/CV/SME00003/EventLog.txe",
    cv_eventlog_3: "./test_data/Philips/CV/SME00004/EventLog.txe",
  },
  ge: {
    ct_gesys_1: "./test_data/GE/CT/SME00821/gesys_PFRT16.log",
    ct_gesys_2: "./test_data/GE/CT/SME00847/gesys_ct99.log",
    ct_gesys_3: "./test_data/GE/CT/SME00847/gesys_mcvct.log",
    ct_gesys_4: "./test_data/GE/CT/SME00867/gesys_HRTCT.log",
    mri_gesys_1: "./test_data/GE/MRI/SME01096/gesys_mroc.log",
    mri_gesys_2: "./test_data/GE/MRI/SME01096/gesys_PARMR002.log",
    mri_gesys_3: "./test_data/GE/MRI/SME01140/gesys_RDMCOPMR.log",
    mri_gesys_4: "./test_data/GE/MRI/SME01141/gesys_RDMCIPMR.log",
    cv_sysError_1: "./test_data/GE/CV/SME00843/sysError.log",
    cv_sysError_2: "./test_data/GE/CV/SME01442/sysError.log",
    cv_sysError_3: "./test_data/GE/CV/SME02481/sysError.log",
  },
  siemens: {
    ct_7: "./test_data/SME00005_CT.txt",
    ct_10_1: "/opt/mirror/C0137/SHIP009/SME01112/MRI/EvtApplication_Today.txt",
    ct_10_2: "/opt/hhm-files/C0137/SHIP009/SME00812/EvtApplication_Today.txt",
    ct_10_3: "/opt/hhm-files/C0137/SHIP009/SME01112/EvtApplication_Today.txt",
    ct_10_4: "/opt/hhm-files/C0137/SHIP009/SME08712/EvtApplication_Today.txt",
    mri_10: "/opt/hhm-files/C0137/SHIP019/SME01101/EvtApplication_Today.txt",
  },
};

const determinManufacturer = async (jobId, filePath) => {
  try {
    const sme = get_sme(filePath);
    let string = "SELECT * from systems WHERE id = $1";
    let value = [sme];
    const sysConfigData = await pgPool.query(string, value);

    await log("info", jobId, sme, "determinManufacturer", "FN CALL", {
      file: filePath,
    });

    switch (sysConfigData.rows[0].manufacturer) {
      case "Siemens":
        console.log("In Siemens")
        await siemens_parser(jobId, filePath, sysConfigData.rows);
        break;
      case "Philips":
        await philips_parser(jobId, filePath, sysConfigData.rows);
        break;
      case "GE":
        await ge_parser(jobId, filePath, sysConfigData.rows);
        break;
      default:
        break;
    }
  } catch (error) {
    await log("error", "NA", "NA", "determinManufacturer", "FN CATCH", {
      error: error,
    });
  }
};

const onBoot = async (filePath) => {
  try {
    let jobId = 0;
    await log("info", "NA", "NA", "onBoot", `FN CALL`);
    await determinManufacturer(jobId++, filePath);
  } catch (error) {
    await log("error", "NA", "NA", "onBoot", "FN CATCH", {
      error: error,
    });
  }
};

onBoot(filePaths.siemens.mri_10);
