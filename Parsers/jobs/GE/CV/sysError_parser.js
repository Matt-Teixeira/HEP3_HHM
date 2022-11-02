("use strict");
require("dotenv").config({ path: "../../.env" });
const fs = require("node:fs");
const readline = require("readline");
const { log } = require("../../../logger");
const { get_sme_modality, blankLineTest } = require("../../../utils/regExHelpers");
const convertDates = require("../../../utils/dates");
const groupsToArrayObj = require("../../../utils/prep-groups-for-array");
const bulkInsert = require("../../../utils/queryBuilder");
const mapDataToSchema = require("../../../utils/map-data-to-schema");
const { ge_re } = require("../../../utils/parsers");
const { ge_cv_syserror_schema } = require("../../../utils/pg-schemas");

async function ge_cv_sys_error(filePath) {
  const manufacturer = "ge";
  const version = "gesys";
  const dateTimeVersion = "type_3";
  const sme_modality = get_sme_modality(filePath);
  const SME = sme_modality.groups.sme;
  const modality = sme_modality.groups.modality;
  const data = [];

  await log("info", "NA", `${SME}`, "ge_cv_sys_error", "FN CALL", {
    sme: SME,
    modality,
    file: filePath,
  });

  try {
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
          await log("error", "NA", "NA", "Not_New_Line", "FN CALL", {
            message: "This is not a blank new line - Bad Match",
            line,
          });
        }
      } else {
        convertDates(matches.groups, dateTimeVersion);
        const matchData = groupsToArrayObj(SME, matches.groups);
        data.push(matchData);
      }
    }
    
    const mappedData = mapDataToSchema(data, ge_cv_syserror_schema);
    const dataToArray = mappedData.map(({ ...rest }) => Object.values(rest));
    console.log(dataToArray);
    // Need to build query
    return;

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
    await log("error", "NA", `${SME}`, "ge_cv_sys_error", "FN CALL", {
      sme: SME,
      manufacturer,
      modality,
      file: filePath,
      error: error.message,
    });
  }
}

module.exports = ge_cv_sys_error;
