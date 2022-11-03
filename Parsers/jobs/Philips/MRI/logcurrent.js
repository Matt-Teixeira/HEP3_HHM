("use strict");
require("dotenv").config({ path: "../../.env" });
const fs = require("node:fs");
const readline = require("readline");
const { log } = require("../../../logger");
const {
  get_sme_modality,
  blankLineTest,
} = require("../../../utils/regExHelpers");
const bulkInsert = require("../../../utils/queryBuilder");
const convertDates = require("../../../utils/dates");
const groupsToArrayObj = require("../../../utils/prep-groups-for-array");
const mapDataToSchema = require("../../../utils/map-data-to-schema");
const { phil_mri_logcurrent_schema } = require("../../../utils/pg-schemas");
const { philips_re } = require("../../../utils/parsers");

async function phil_mri_logcurrent(filePath) {
  const manufacturer = "philips";
  const version = "logcurrent";
  const dateTimeVersion = "type_3";
  const sme_modality = get_sme_modality(filePath);
  const SME = sme_modality.groups.sme;
  const modality = sme_modality.groups.modality;

  const data = [];
  try {
    await log("info", "NA", `${SME}`, "phil_mri_logcurrent", "FN CALL", {
      sme: SME,
      modality,
      file: filePath,
    });

    const rl = readline.createInterface({
      input: fs.createReadStream(filePath),
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      let matches = line.match(philips_re.mri_logcurrent);

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

    // homogenize data to prep for insert to db (may remove this step )
    const mappedData = mapDataToSchema(data, phil_mri_logcurrent_schema);

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
    await log("error", "NA", `${SME}`, "phil_mri_logcurrent", "FN CALL", {
      sme: SME,
      modality,
      file: filePath,
      error: error.message,
    });
  }
}

module.exports = phil_mri_logcurrent;
