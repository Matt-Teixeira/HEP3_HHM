("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const fs = require("node:fs").promises;
const { philips_re } = require("../../../parse/parsers");
const groupsToArrayObj = require("../../../parse/prep-groups-for-array");
const mapDataToSchema = require("../../../persist/map-data-to-schema");
const {
  philips_mri_rmmu_magnet_schema,
} = require("../../../persist/pg-schemas");
const bulkInsert = require("../../../persist/queryBuilder");
const convertDates = require("../../../utils/dates");
const constructFilePath = require("../../../utils/constructFilePath");

async function phil_mri_rmmu_magnet(jobId, sysConfigData, fileToParse) {
  const dateTimeVersion = fileToParse.datetimeVersion;
  const sme = sysConfigData.id;

  const data = [];

  try {
    await log("info", jobId, sme, "phil_mri_rmmu_magnet", "FN CALL");

    const completeFilePath = await constructFilePath(
      sysConfigData.hhm_config.file_path,
      fileToParse,
      fileToParse.regEx
    );

    const fileData = (await fs.readFile(completeFilePath)).toString();

    let matches = fileData.matchAll(philips_re.mri.rmmu_magnet);
    let metaData = fileData.match(philips_re.mri.rmmu_meta_data);

    for await (let match of matches) {
      convertDates(match.groups, dateTimeVersion);
      match.groups.system_reference_number =
        metaData.groups.system_reference_number;
      match.groups.hospital_name = metaData.groups.hospital_name;
      match.groups.serial_number_magnet = metaData.groups.serial_number_magnet;
      match.groups.serial_number_meu = metaData.groups.serial_number_meu;
      const matchData = groupsToArrayObj(sme, match.groups);
      data.push(matchData);
    }

    const mappedData = mapDataToSchema(data, philips_mri_rmmu_magnet_schema);
    const dataToArray = mappedData.map(({ ...rest }) => Object.values(rest));

    await bulkInsert(jobId, dataToArray, sysConfigData, fileToParse);
  } catch (error) {
    await log("error", jobId, sme, "phil_mri_rmmu_magnet", "FN CALL", {
      sme: sme,
      modality,
      file: filePath,
      error: error.message,
    });
  }
}

module.exports = phil_mri_rmmu_magnet;
