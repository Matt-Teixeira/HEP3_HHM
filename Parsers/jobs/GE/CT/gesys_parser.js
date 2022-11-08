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

async function ge_ct_gesys(jobId, filePath, sysConfigData, file_type) {
  const version = "gesys";
  const dateTimeVersion = "type_2";
  const sme = sysConfigData[0].id;
  const manufacturer = sysConfigData[0].manufacturer;
  const modality = sysConfigData[0].modality;
  const data = [];

  await log("info", jobId, sysConfigData[0].id, "ge_ct_gesys", "FN CALL", {
    sme: sysConfigData[0].id,
    modality: sysConfigData[0].modality,
    file: filePath,
  });

  try {
    const fileData = (await fs.readFile(filePath)).toString();

    let matches = fileData.match(ge_re.ct.gesys.block);
    for await (let match of matches) {
      const matchGroups = match.match(ge_re.ct.gesys.new);
      convertDates(matchGroups.groups, dateTimeVersion);
      const matchData = groupsToArrayObj(
        sysConfigData[0].id,
        matchGroups.groups
      );
      data.push(matchData);
    }
    const mappedData = mapDataToSchema(data, ge_ct_gesys_schema);
    const dataToArray = mappedData.map(({ ...rest }) => Object.values(rest));

    await bulkInsert(
      dataToArray,
      manufacturer,
      modality,
      version,
      sme,
      filePath,
      jobId
    );
  } catch (error) {
    await log("error", jobId, sysConfigData[0].id, "ge_ct_gesys", "FN CALL", {
      sme: sysConfigData[0].id,
      manufacturer: sysConfigData[0].manufacturer,
      modality: sysConfigData[0].modality,
      file: filePath,
      error: error.message,
    });
  }
}

module.exports = ge_ct_gesys;
