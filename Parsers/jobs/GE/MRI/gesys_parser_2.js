("use strict");
require("dotenv").config({ path: "../../.env" });
const fs = require("node:fs").promises;
const { log } = require("../../../logger");
const convertDates = require("../../../utils/dates");
const groupsToArrayObj = require("../../../utils/prep-groups-for-array");
const { get_sme_modality } = require("../../../utils/regExHelpers");
const bulkInsert = require("../../../utils/queryBuilder");
const { ge_re } = require("../../../utils/parsers");
const mapDataToSchema = require("../../../utils/map-data-to-schema");
const { ge_mri_gesys_2_schema } = require("../../../utils/pg-schemas");

async function ge_mri_gesys_2(filePath) {
  const manufacturer = "ge";
  const version = "gesys";
  const dateTimeVersion = "type_2";
  const data = [];
  const sme_modality = get_sme_modality(filePath);
  const SME = sme_modality.groups.sme;
  const modality = sme_modality.groups.modality;

  await log("info", "NA", `${SME}`, "ge_mri_gesys_2", "FN CALL", {
    sme: SME,
    modality,
    file: filePath,
  });

  try {
    const fileData = (await fs.readFile(filePath)).toString();

    let matches = fileData.match(ge_re.mri.gesys.block);

    for await (let match of matches) {
      // Step to filter regEx permutations into arrays and combine later
      const matchGroups = match.match(ge_re.mri.gesys.new);
      convertDates(matchGroups.groups, dateTimeVersion);
      const matchData = groupsToArrayObj(SME, matchGroups.groups);
      data.push(matchData);
    }

    const mappedData = mapDataToSchema(data, ge_mri_gesys_2_schema);

    console.log(mappedData);

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
    console.log(error);
    await log("error", "NA", `${SME}`, "ge_mri_gesys_2", "FN CALL", {
      sme: SME,
      manufacturer,
      modality,
      file: filePath,
      error: error.message,
    });
  }
}

module.exports = ge_mri_gesys_2;
