("use strict");
require("dotenv").config();
const crypto = require("crypto");
const { log } = require("./logger");
const pgPool = require("./db/pg-pool");
const siemens_parser = require("./jobs/Siemens");
const philips_parser = require("./jobs/Philips");
const ge_parser = require("./jobs/GE");
const { get_sme } = require("./utils/regExHelpers");

const filePaths = {
  philips: {
    ct_eal: "./test_data/Philips/CT/SME00246/ealinfo.csv",
    ct_events: "./test_data/Philips/CT/SME00246/events.csv",
    mri_logcurrent: "./test_data/Philips/MR/SME01401/logcurrent.log",
    mri_rmmu_short:
      "./test_data/Philips/MR/SME01399/rmmu_short_cryogenic20210430030544.log",
    mri_rmmu_long:
      "./test_data/Philips/MR/SME01399/rmmu_long_cryogenic20201017030621.log",
    mri_monitor_1: "./test_data/Philips/MR/SME01406/monitor",
    mri_monitor_2: "./test_data/Philips/MR/SME01401/monitor",
    cv_eventlog_1: "./test_data/Philips/CV/SME00001/EventLog.txe",
    cv_eventlog_2: "./test_data/Philips/CV/SME00003/EventLog.txe",
    cv_eventlog_3: "./test_data/Philips/CV/SME00004/EventLog.txe",
    cv_eventlog_4:
      "/opt/hhm-files/C0051/SHIP003/SME00444/daily_2022_11_22/EventLog.txe",
    cv_systems: [
      "SME00444",
      "SME02535",
      "SME00445",
      "SME00446",
      "SME07761",
      "SME00782",
      "SME00784",
      "SME00785",
      "SME00786",
      "SME01227",
      "SME02548",
      "SME02377",
      "SME02378",
      "SME02579",
      "SME02580",
      "SME00886",
      "SME00888",
    ],
    mri_systems: ["SME01138"],
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
    systems: [
      "SME01136", //MRI
      "SME08716",
      "SME01101",
      "SME01125",
      "SME00885", //CT
      "SME00894",
      "SME00868",
      "SME00854",
      "SME00855",
      "SME00856",
      "SME01129",
      "SME00871",
      "SME01092",
      // "SME01094", 12 Gb
      "SME01112",
      "SME08712",
    ],
  },
};

const systems = [
  "SME00894",
  "SME00868",
  "SME00854",
  "SME00855",
  "SME00856",
  "SME01129",
  "SME00871",
  "SME00885",
  "SME08716",
  "SME01101",
  "SME01125",
  "SME01136",
  "SME00444",
  "SME02535",
  "SME00445",
  "SME00446",
  "SME07761",
  "SME00782",
  "SME00784",
  "SME00785",
  "SME00786",
  "SME01227",
  "SME02548",
  "SME02377",
  "SME02378",
  "SME02579",
  "SME02580",
  "SME00886",
  "SME00888",
  "SME01138",
];

const determineManufacturer = async (jobId, sme) => {
  try {
    let queryString =
      "SELECT id, manufacturer, hhm_config from systems WHERE id = $1";
    let value = [sme];
    const sysConfigData = await pgPool.query(queryString, value);

    await log("info", jobId, sme, "determineManufacturer", "FN CALL");

    switch (sysConfigData.rows[0].manufacturer) {
      case "Siemens":
        await siemens_parser(jobId, sysConfigData.rows[0]);
        break;
      case "Philips":
        await philips_parser(jobId, sysConfigData.rows[0]);
        break;
      case "GE":
        await ge_parser(jobId, sysConfigData.rows[0]);
        break;
      default:
        break;
    }
  } catch (error) {
    await log("error", "NA", "NA", "determineManufacturer", "FN CATCH", {
      error: error,
    });
  }
};

const onBoot = async (arrayOfSystems) => {
  try {
    await log("info", "NA", "NA", "onBoot", `FN CALL`);
    console.time();
    for await (const system of arrayOfSystems) {
      let jobId = crypto.randomUUID();
      await determineManufacturer(jobId, system);
    }
    console.log("*************** END **************");
    console.timeEnd();
    return;
  } catch (error) {
    await log("error", "NA", "NA", "onBoot", "FN CATCH", {
      error: error,
    });
  }
};

onBoot(filePaths.siemens.systems);
