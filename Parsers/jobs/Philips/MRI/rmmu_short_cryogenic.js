("use strict");
require("dotenv").config({ path: "../../.env" });
const fs = require("node:fs").promises;
const { log } = require("../../../logger");
const { get_sme_modality } = require("../../../utils/regExHelpers");
const bulkInsert = require("../../../utils/queryBuilder");
const convertDates = require("../../../utils/dates");
const groupsToArrayObj = require("../../../utils/prep-groups-for-array");
const mapDataToSchema = require("../../../utils/map-data-to-schema");
const { phil_mri_rmmu_short_schema } = require("../../../utils/pg-schemas");
const { philips_re } = require("../../../utils/parsers");

async function phil_mri_rmmu_short(filePath) {
  try {
    const manufacturer = "philips";
    const version = "rmmu_short";
    const dateTimeVersion = "type_4";
    const sme_modality = get_sme_modality(filePath);
    const SME = sme_modality.groups.sme;
    const modality = sme_modality.groups.modality;

    const data = [];

    await log("info", "NA", `${SME}`, "phil_mri_rmmu_short", "FN CALL", {
      sme: SME,
      modality,
      file: filePath,
    });

    const fileData = (await fs.readFile(filePath)).toString();

    let matches = fileData.matchAll(philips_re.mri.rmmu_short_re);
    let metaData = fileData.match(philips_re.mri.rmmu_meta_data);

    for await (let match of matches) {
      convertDates(match.groups, dateTimeVersion);
      match.groups.system_reference_number =
        metaData.groups.system_reference_number;
      match.groups.hospital_name = metaData.groups.hospital_name;
      match.groups.serial_number_magnet = metaData.groups.serial_number_magnet;
      match.groups.serial_number_meu = metaData.groups.serial_number_meu;
      const matchData = groupsToArrayObj(SME, match.groups);
      data.push(matchData);
    }

    const mappedData = mapDataToSchema(data, phil_mri_rmmu_short_schema);
    const dataToArray = mappedData.map(({ ...rest }) => Object.values(rest));

    await bulkInsert(
      dataToArray,
      manufacturer,
      modality,
      filePath,
      version,
      SME
    );
  } catch (error) {
    await log("error", "NA", `${SME}`, "phil_mri_rmmu_short", "FN CALL", {
      sme: SME,
      modality,
      file: filePath,
      error: error.message,
    });
  }
}

module.exports = phil_mri_rmmu_short;
