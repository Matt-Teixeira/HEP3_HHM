("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const fs = require("node:fs").promises;
const { ge_re } = require("../../../parse/parsers");
const groupsToArrayObj = require("../../../parse/prep-groups-for-array");
const mapDataToSchema = require("../../../persist/map-data-to-schema");
const { ge_mri_gesys_schema } = require("../../../persist/pg-schemas");
const bulkInsert = require("../../../persist/queryBuilder");
const convertDates = require("../../../utils/dates");
const isFileModified = require("../../../utils/isFileModified");

async function ge_mri_gesys(jobId, sysConfigData, fileToParse) {
  const dateTimeVersion = fileToParse.datetimeVersion;
  const sme = sysConfigData.id;

  const data = [];

  try {
    await log("info", sme, "ge_mri_gesys", "FN CALL");

    // Check mod date/time

    let complete_file_path = `${sysConfigData.hhm_config.file_path}/${fileToParse.file_name}`;

    const isUpdatedFile = await isFileModified(
      jobId,
      sme,
      complete_file_path,
      fileToParse
    );

    // dont continue if file is not updated
    if (!isUpdatedFile) return;

    const fileData = (await fs.readFile(complete_file_path)).toString();

    let matches = fileData.match(ge_re.mri.gesys.block);
    for await (let match of matches) {
      const matchGroups = match.match(ge_re.mri.gesys.new);
      convertDates(matchGroups.groups, dateTimeVersion);
      const matchData = groupsToArrayObj(sme, matchGroups.groups);
      data.push(matchData);
    }

    const mappedData = mapDataToSchema(data, ge_mri_gesys_schema);
    const dataToArray = mappedData.map(({ ...rest }) => Object.values(rest));

    await bulkInsert(jobId, dataToArray, sysConfigData, fileToParse);

    // Set mod date-time
  } catch (error) {
    console.log(error);
    await log("error", sme, "ge_mri_gesys", "FN CALL", {
      error: error,
    });
  }
}

module.exports = ge_mri_gesys;
