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
const {
  isFileModified,
  updateFileModTime,
} = require("../../utils/isFileModified");

const parse_win_10 = async (jobId, sysConfigData, fileToParse) => {
  const dateTimeVersion = sysConfigData.hhm_config.dateTimeVersion;
  const sme = sysConfigData.id;
  const dirPath = sysConfigData.hhm_config.file_path;

  const data = [];

  let line_num = 1;
  try {
    await log("info", jobId, sme, "parse_win_10", "FN CALL");

    const complete_file_path = `${dirPath}/${fileToParse.file_name}`;

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
      let matches = line.match(win_10_re.re_v1);
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
      }
      convertDates(matches.groups, dateTimeVersion);
      const matchData = groupsToArrayObj(sme, matches.groups);
      data.push(matchData);
      line_num++;
    }

    const mappedData = mapDataToSchema(data, siemens_ct_mri);
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

    return true;
  } catch (error) {
    await log("error", jobId, sme, "parse_win_10", "FN CATCH", {
      line: line_num,
      error: error,
      file: fileToParse,
    });
  }
};

module.exports = parse_win_10;
// /(?<host_state>\w+)\t(?<host_date>\d{4}-\d{1,2}-\d{1,2})\t(?<host_time>\d{2}:\d{2}:\d{2})\t(?<host_col_1>(.*?)(\.\d\.\d)?)\t?\s?(?<host_col_2>(\d{1,5}))\t(?<host_info>.*)/;
