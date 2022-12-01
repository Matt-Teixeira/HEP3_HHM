("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../logger");
const fs = require("fs");
const readline = require("readline");
const { win_10_re } = require("../../parse/parsers");
const groupsToArrayObj = require("../../parse/prep-groups-for-array");
const mapDataToSchema = require("../../persist/map-data-to-schema");
const { siemens_ct_mri } = require("../../persist/pg-schemas");
const bulkInsert = require("../../persist/queryBuilder");
const { blankLineTest } = require("../../utils/regExHelpers");
const convertDates = require("../../utils/dates");
const constructFilePath = require("../../utils/constructFilePath");

const parse_win_10 = async (jobId, sysConfigData, fileToParse) => {
  const dateTimeVersion = sysConfigData.hhm_config.dateTimeVersion;
  const sme = sysConfigData.id;
  const dirPath = sysConfigData.hhm_config.file_path;

  const data = [];
  // console.log(sysConfigData);
  // console.log(fileToParse);

  try {
    await log("info", jobId, sme, "parse_win_10", "FN CALL");

    /* const completeFilePath = await constructFilePath(
      dirPath,
      fileToParse,
      sysConfigData.hhm_config.regExFileStr
    ); */

    const rl = readline.createInterface({
      input: fs.createReadStream(`${dirPath}/${fileToParse}`),
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      let matches = line.match(win_10_re.re_v1);
      if (matches === null) {
        const isNewLine = blankLineTest(line);
        if (isNewLine) {
          continue;
        } else {
          await log("error", jobId, "NA", "Not_New_Line", "FN CALL", {
            message: "This is not a blank new line - Bad Match",
            line: line,
          });
        }
      }
      convertDates(matches.groups, dateTimeVersion);
      const matchData = groupsToArrayObj(sme, matches.groups);
      data.push(matchData);
    }

    const mappedData = mapDataToSchema(data, siemens_ct_mri);
    const dataToArray = mappedData.map(({ ...rest }) => Object.values(rest));

    await bulkInsert(jobId, dataToArray, sysConfigData, fileToParse);
    return true;
  } catch (error) {
    await log("error", jobId, sme, "parse_win_10", "FN CATCH", {
      error: error,
      file: fileToParse,
    });
  }
};

module.exports = parse_win_10;
// /(?<host_state>\w+)\t(?<host_date>\d{4}-\d{1,2}-\d{1,2})\t(?<host_time>\d{2}:\d{2}:\d{2})\t(?<host_col_1>(.*?)(\.\d\.\d)?)\t?\s?(?<host_col_2>(\d{1,5}))\t(?<host_info>.*)/;
