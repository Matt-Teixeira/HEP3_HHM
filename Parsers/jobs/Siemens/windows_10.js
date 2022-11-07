("use strict");
require("dotenv").config({ path: "../../.env" });
const fs = require("fs");
const readline = require("readline");
const { log } = require("../../logger");
const { testTabs } = require("../../utils/regExHelpers");
const { win_10_re } = require("../../utils/parsers");
const bulkInsert = require("../../utils/queryBuilder");
const convertDates = require("../../utils/dates");
const groupsToArrayObj = require("../../utils/prep-groups-for-array");
const mapDataToSchema = require("../../utils/map-data-to-schema");
const { siemens_ct_mri } = require("../../utils/pg-schemas");

const parse_win_10 = async (jobId, filePath, sysConfigData) => {
  const version = "windows";
  const dateTimeVersion = "type_3";
  const sme = sysConfigData[0].id;
  const manufacturer = sysConfigData[0].manufacturer;
  const modality = sysConfigData[0].modality;

  const data = [];
  try {
    await log("info", jobId, sme, "parse_win_10", "FN CALL", {
      sme: sme,
      modality,
      file: filePath,
    });

    const rl = readline.createInterface({
      input: fs.createReadStream(filePath),
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      let matches = line.match(win_10_re.re_v1);
      // Test for tabs
      await testTabs(matches, sme);
      convertDates(matches.groups, dateTimeVersion);
      const matchData = groupsToArrayObj(sme, matches.groups);
      data.push(matchData);
    }

    const mappedData = mapDataToSchema(data, siemens_ct_mri);
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
    return true;
  } catch (error) {
    console.log(error);
    await log("error", jobId, sme, "parse_win_10", "FN CATCH", {
      error: error,
    });
  }
};

module.exports = parse_win_10;
// /(?<host_state>\w+)\t(?<host_date>\d{4}-\d{1,2}-\d{1,2})\t(?<host_time>\d{2}:\d{2}:\d{2})\t(?<host_col_1>(.*?)(\.\d\.\d)?)\t?\s?(?<host_col_2>(\d{1,5}))\t(?<host_info>.*)/;
