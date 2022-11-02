("use strict");
require("dotenv").config({ path: "../../.env" });
const fs = require("node:fs").promises;
const { log } = require("../../../logger");
const { get_sme_modality } = require("../../../utils/regExHelpers");
const convertDates = require("../../../utils/dates");
const groupsToArrayObj = require("../../../utils/prep-groups-for-array");
const bulkInsert = require("../../../utils/queryBuilder");
const mapDataToSchema = require("../../../utils/map-data-to-schema");
const { ge_re } = require("../../../utils/parsers");
const { ge_ct_gesys_schema } = require("../../../utils/pg-schemas");

async function ge_ct_gesys(filePath) {
  const manufacturer = "ge";
  const version = "gesys";
  const dateTimeVersion = "type_2";
  const sme_modality = get_sme_modality(filePath);
  const SME = sme_modality.groups.sme;
  const modality = sme_modality.groups.modality;
  const data = [];

  await log("info", "NA", `${SME}`, "ge_ct_gesys", "FN CALL", {
    sme: SME,
    modality,
    file: filePath,
  });

  try {

    const fileData = (await fs.readFile(filePath)).toString();

    let matches = fileData.match(ge_re.ct.gesys.block);
    for await (let match of matches) {
      if (ge_re.test.for_exception_class.test(match)) {
        const matchGroups = match.match(ge_re.ct.gesys.exception_class);
        convertDates(matchGroups.groups, dateTimeVersion);
        const matchData = groupsToArrayObj(SME, matchGroups.groups);
        data.push(matchData);
      } else {
        const matchGroups = match.match(ge_re.ct.gesys.no_box);
        convertDates(matchGroups.groups, dateTimeVersion);
        const matchData = groupsToArrayObj(SME, matchGroups.groups);
        data.push(matchData);
      }
    }
    const mappedData = mapDataToSchema(data, ge_ct_gesys_schema);
    const dataToArray = mappedData.map(({ ...rest }) => Object.values(rest));
    console.log(mappedData[0])
    
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
    await log("error", "NA", `${SME}`, "ge_ct_gesys", "FN CALL", {
      sme: SME,
      manufacturer,
      modality,
      file: filePath,
      error: error.message,
    });
  }
}

module.exports = ge_ct_gesys;
