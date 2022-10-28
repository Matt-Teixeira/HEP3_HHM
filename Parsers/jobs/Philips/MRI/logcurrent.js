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

    const mri_logcurrent_re =
      /((?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2}\.\d+)\s(?<data_1>\w+)\s(?<data_2>\w+)\s(?<data_3>.*?)\s+(?<data_4>\w+)\s(?<data_5>\w+)(\s(?<data_6>\w+))?\s+(?<data_7>.*))|(Number\sof\sPackets\sCreated\s:\s(?<packets_created>\d*\.?\d*)|Total\sSize\sof\sData\sCreated\s:\s(?<data_created_gb>\d*\.?\d*)\s[A-Z]+|Size\sof\sCopy\sDone\s:\s(?<size_copy_gb>\d*\.?\d*)\s[A-Z]+|(?<data_8>>.*)|(?<reconstructor>[A-Za-z].*))/;

    //const blankLineTest = /^[ \t\n]*$/;

    const rl = readline.createInterface({
      input: fs.createReadStream(filePath),
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      let matches = line.match(mri_logcurrent_re);

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
        data.push(matches.groups);
      }
    }
    console.log(data);
    return;

    data.shift();

    // homogenize data to prep for insert to db (may remove this step )
    const mappedData = mapDataToSchema(data, philips_ct_eal_schema);
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
