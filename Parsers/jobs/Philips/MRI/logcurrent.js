("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const fs = require("node:fs");
const readline = require("readline");
const { philips_re } = require("../../../parse/parsers");
const groupsToArrayObj = require("../../../parse/prep-groups-for-array");
const mapDataToSchema = require("../../../persist/map-data-to-schema");
const { phil_mri_logcurrent_schema } = require("../../../persist/pg-schemas");
const bulkInsert = require("../../../persist/queryBuilder");
const { blankLineTest } = require("../../../utils/regExHelpers");
const convertDates = require("../../../utils/dates");
const constructFilePath = require("../../../utils/constructFilePath");
const {
  isFileModified,
  updateFileModTime,
} = require("../../../utils/isFileModified");

async function phil_mri_logcurrent(jobId, sysConfigData, fileToParse) {
  const dateTimeVersion = fileToParse.datetimeVersion;
  const sme = sysConfigData.id;

  const data = [];

  try {
    await log("info", jobId, sme, "phil_mri_logcurrent", "FN CALL");

    const complete_file_path = await constructFilePath(
      sysConfigData.hhm_config.file_path,
      fileToParse,
      fileToParse.regEx
    );

    const isUpdatedFile = await isFileModified(
      jobId,
      sme,
      complete_file_path,
      fileToParse
    );

    // dont continue if file is not updated
    if (!isUpdatedFile) return;

    const rl = readline.createInterface({
      input: fs.createReadStream(complete_file_path),
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      let matches = line.match(philips_re.mri_logcurrent);

      if (matches === null) {
        const isNewLine = blankLineTest(line);
        if (isNewLine) {
          continue;
        } else {
          await log("error", jobId, sme, "Not_New_Line", "FN CALL", {
            message: "This is not a blank new line - Bad Match",
            line,
          });
        }
      } else {
        convertDates(matches.groups, dateTimeVersion);
        const matchData = groupsToArrayObj(sme, matches.groups);
        data.push(matchData);
      }
    }

    // homogenize data to prep for insert to db
    const mappedData = mapDataToSchema(data, phil_mri_logcurrent_schema);
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
  } catch (error) {
    await log("error", jobId, sme, "phil_mri_logcurrent", "FN CALL", {
      sme: sme,
      modality,
      file: filePath,
      error: error.message,
    });
  }
}

module.exports = phil_mri_logcurrent;
