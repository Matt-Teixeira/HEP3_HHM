("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../logger");
const fs = require("node:fs").promises;
const { win_7_re } = require("../../parse/parsers");
const groupsToArrayObj = require("../../parse/prep-groups-for-array");
const mapDataToSchema = require("../../persist/map-data-to-schema");
const { siemens_cv_schema } = require("../../persist/pg-schemas");
const bulkInsert = require("../../persist/queryBuilder");
const convertDates = require("../../utils/dates");
const {
  isFileModified,
  updateFileModTime,
} = require("../../utils/isFileModified");

const parse_win_7 = async (jobId, sysConfigData, fileToParse) => {
  const dateTimeVersion = fileToParse.datetimeVersion;
  const sme = sysConfigData.id;
  const dirPath = sysConfigData.hhm_config.file_path;

  const data = [];

  try {
    await log("info", jobId, sme, "parse_win_7", "FN CALL");

    const complete_file_path = `${dirPath}/${fileToParse.file_name}`;

    const isUpdatedFile = await isFileModified(
      jobId,
      sme,
      complete_file_path,
      fileToParse
    );

    // dont continue if file is not updated
    if (!isUpdatedFile) return;

    const fileData = (await fs.readFile(complete_file_path)).toString();

    let matches = fileData.match(win_7_re.big_group);

    for await (let match of matches) {
      //console.log(match + "\n")
      if (match === null) {
        throw new Error("Bad match");
      }
      let matchGroups = match.match(win_7_re.small_group);

      convertDates(matchGroups.groups, dateTimeVersion);
      const matchData = groupsToArrayObj(sme, matchGroups.groups);
      data.push(matchData);
    }

    const mappedData = mapDataToSchema(data, siemens_cv_schema);
    const dataToArray = mappedData.map(({ ...rest }) => Object.values(rest));

    const insertSuccess = await bulkInsert(
      jobId,
      dataToArray,
      sysConfigData,
      fileToParse
    );
    if (insertSuccess) {
      await updateFileModTime(jobId, sme, complete_file_path, fileToParse);
    }

    return true;
  } catch (error) {
    await log("error", jobId, sme, "parse_win_7", "FN CATCH", {
      error: error,
    });
  }
};

module.exports = parse_win_7;
