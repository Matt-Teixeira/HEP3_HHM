("use strict");
require("dotenv").config({ path: "../../.env" });
const fs = require("fs");
const readline = require("readline");
const { log } = require("../../logger");
const { testTabs, get_sme_modality } = require("../../utils/regExHelpers");
const { win_10_re } = require("../../utils/parsers");
const bulkInsert = require("../../utils/queryBuilder");
const convertDates = require("../../utils/dates");
const groupsToArrayObj = require("../../utils/prep-groups-for-array");
const mapDataToSchema = require("../../utils/map-data-to-schema");
const { siemens_ct_mri } = require("../../utils/pg-schemas");

const parse_win_10 = async (filePath) => {
  // Data will be populated with the row array to set up bulk insert
  const manufacturer = "siemens";
  const version = "windows";
  const dateTimeVersion = "siemens_10";
  const data = [];
  const sme_modality = get_sme_modality(filePath);
  const SME = sme_modality.groups.sme;
  const modality = sme_modality.groups.modality;

  await log("info", "NA", `${SME}`, "parse_win_10", "FN CALL", {
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
      let matches = line.match(win_10_re.re_v1);
      // Test for tabs
      await testTabs(matches, SME);
      convertDates(matches.groups, dateTimeVersion);
      const matchData = groupsToArrayObj(SME, matches.groups);
      data.push(matchData);
    }

    const mappedData = mapDataToSchema(data, siemens_ct_mri);
    const dataToArray = mappedData.map(({ ...rest }) => Object.values(rest));

    await bulkInsert(
      dataToArray,
      manufacturer,
      modality,
      filePath,
      version,
      SME
    );
    return true;
  } catch (error) {
    await log("error", "NA", `${SME}`, "parse_win_10", "FN CATCH", {
      error: error,
    });
  }
};

module.exports = parse_win_10;
// /(?<host_state>\w+)\t(?<host_date>\d{4}-\d{1,2}-\d{1,2})\t(?<host_time>\d{2}:\d{2}:\d{2})\t(?<host_col_1>(.*?)(\.\d\.\d)?)\t?\s?(?<host_col_2>(\d{1,5}))\t(?<host_info>.*)/;
