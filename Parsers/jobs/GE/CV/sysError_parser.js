("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const fs = require("node:fs");
const readline = require("readline");
const { ge_re } = require("../../../parse/parsers");
const groupsToArrayObj = require("../../../parse/prep-groups-for-array");
const mapDataToSchema = require("../../../persist/map-data-to-schema");
const { ge_cv_syserror_schema } = require("../../../persist/pg-schemas");
const bulkInsert = require("../../../persist/queryBuilder");
const { blankLineTest } = require("../../../utils/regExHelpers");
const {convertDates} = require("../../../utils/dates");
const {
  isFileModified,
  updateFileModTime,
} = require("../../../utils/isFileModified");

async function ge_cv_sys_error(jobId, sysConfigData, fileToParse) {
  const dateTimeVersion = fileToParse.datetimeVersion;
  const sme = sysConfigData.id;

  const data = [];

  try {
    await log("info", jobId, sme, "ge_ct_gesys", "FN CALL");

    let complete_file_path = `${sysConfigData.hhm_config.file_path}/${fileToParse.file_name}`;

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
      let matches = line.match(ge_re.cv.sys_error);
      if (matches === null) {
        const isNewLine = blankLineTest(line);
        if (isNewLine) {
          continue;
        } else {
          await log("error", jobId, sme, "Not_New_Line", "FN CALL", {
            message: "This is not a blank new line - Bad Match",
            line: line,
          });
        }
      } else {
        convertDates(matches.groups, dateTimeVersion);
        const matchData = groupsToArrayObj(sme, matches.groups);
        data.push(matchData);
      }
    }

    console.log(data[1])

    data.shift();

    const mappedData = mapDataToSchema(data, ge_cv_syserror_schema);
    const dataToArray = mappedData.map(({ ...rest }) => Object.values(rest));

    const insertSuccess = await bulkInsert(
      jobId,
      dataToArray,
      sysConfigData,
      fileToParse
    );
    if (insertSuccess) {
      await updateFileModTime(jobId, sme, complete_file_path, fileToParse);
      console.log("Insert Success")
    }
  } catch (error) {
    await log("error", jobId, sme, "ge_cv_sys_error", "FN CALL", {
      error: error,
    });
  }
}

module.exports = ge_cv_sys_error;
