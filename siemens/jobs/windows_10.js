("use strict");
require("dotenv").config({ path: "../../.env" });
const fs = require("fs");
const readline = require("readline");
const { log } = require("../logger");
const { testTabs, get_sme_modality } = require("../utils/regExTests");
const { win_10_re } = require("../utils/regEx");
const bulkInsert = require("../utils/queryBuilder");

const parse_win_10 = async (filePath) => {
  // Data will be populated with the row array to set up bulk insert
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
      // Row will contain capture groups from line and push to data array.
      let row = [];

      let matches = line.match(win_10_re.re_v1);

      // Test for tabs
      await testTabs(matches, SME);

      row.push(
        SME,
        matches.groups.host_state,
        matches.groups.host_date,
        matches.groups.host_time,
        matches.groups.source_group,
        matches.groups.type_group,
        matches.groups.text_group
      );

      data.push(row);

      await log("info", "NA", `${SME}`, "parse_win_10", "readline", {
        host_state: matches.groups.host_state,
        host_date: matches.groups.host_date,
        host_time: matches.groups.host_time,
        source_group: matches.groups.source_group,
        type_group: matches.groups.type_group,
        text_group: matches.groups.text_group,
      });
    }
    await bulkInsert(
      data,
      modality,
      [
        "equipment_id",
        "host_state",
        "host_date",
        "host_time",
        "source_group",
        "type_group",
        "text_group",
      ],
      filePath
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
