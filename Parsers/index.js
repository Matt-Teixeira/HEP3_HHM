("use strict");
require("dotenv").config();
const crypto = require("crypto");
const { log } = require("./logger");
const pgPool = require("./db/pg-pool");
const siemens_parser = require("./jobs/Siemens");
const philips_parser = require("./jobs/Philips");
const ge_parser = require("./jobs/GE");

const filePaths = {
  philips: {
    cv_systems: [
      "SME00444",
      "SME00445",
      "SME00446",
      "SME00349",
      "SME00527",
      "SME00508",
      "SME00509",
      "SME00510",
      "SME00511"
    ],
    mri_systems: ["SME01138"],
  },
  ge: {
    ct_systems: ["SME12446", "SME01096", "SME01091", "SME00847", "SME10071"],
    mri_systems: ["SME00896", "SME12424"],
  },
  siemens: {
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
    console.log("*************** END ***************");
    console.timeEnd();
    return;
  } catch (error) {
    await log("error", "NA", "NA", "onBoot", "FN CATCH", {
      error: error,
    });
  }
};

onBoot(filePaths.siemens.systems);
