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
const convertDates = require("../../../utils/dates");

async function ge_cv_sys_error(jobId, filePath, sysConfigData) {
  const version = "sysError";
  const dateTimeVersion = "type_3";
  const sme = sysConfigData[0].id;
  const manufacturer = sysConfigData[0].manufacturer;
  const modality = sysConfigData[0].modality;
  const data = [];

  try {
    await log("info", jobId, sme, "ge_cv_sys_error", "FN CALL", {
      sme: sme,
      modality,
      file: filePath,
    });

    const rl = readline.createInterface({
      input: fs.createReadStream(filePath),
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

    data.shift();

    const mappedData = mapDataToSchema(data, ge_cv_syserror_schema);
    const dataToArray = mappedData.map(({ ...rest }) => Object.values(rest));

    await bulkInsert(
      dataToArray,
      manufacturer,
      "CV",
      version,
      sme,
      filePath,
      jobId
    );
  } catch (error) {
    await log("error", jobId, sme, "ge_cv_sys_error", "FN CALL", {
      error: error,
      sme: sme,
      manufacturer,
      modality,
      file: filePath,
    });
  }
}

module.exports = ge_cv_sys_error;

// insert into ge_cv_syserror(equipment_id, sequencenumber, host_date, host_time) VALUES('SME00843', '1', '2021-04-23', '07:49:05:103')
