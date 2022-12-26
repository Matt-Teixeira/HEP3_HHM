("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../logger");
const fs = require("node:fs").promises;
const { win_7_re } = require("../../parse/parsers");
const groupsToArrayObj = require("../../parse/prep-groups-for-array");
const mapDataToSchema = require("../../persist/map-data-to-schema");
const { siemens_cv_schema } = require("../../persist/pg-schemas");
const bulkInsert = require("../../persist/queryBuilder");
const convertDates = require("../../utils/dates");

const parse_win_7 = async (jobId, sysConfigData, fileToParse) => {
  const dateTimeVersion = fileToParse.datetimeVersion;
  const sme = sysConfigData.id;
  const dirPath = sysConfigData.hhm_config.file_path;

  const data = [];

  try {
    await log("info", jobId, sme, "parse_win_7", "FN CALL");

    const complete_file_path = `${dirPath}/${fileToParse.file_name}`;

    const fileData = (await fs.readFile(complete_file_path)).toString();

    let matches = fileData.match(
      /(?<big_group>Source.*(\r\n)Domain:.*(\r\n)Type:.*(\r\n)ID:.*(\r\n)Date:.*(\r\n)Text:.*)/g
    );

    for await (let match of matches) {
      //console.log(match + "\n")
      if (match === null) {
        throw new Error("Bad match");
      }
      let matchGroups = match.match(
        /Source:(?<source_group>.*)(\r\n)Domain:(?<domain_group>.*)(\r\n)Type:(?<type_group>.*)(\r\n)ID:(?<id_group>.*)(\r\n)(Date:.*\s(?<month>\w+)\s(?<day>\d+),\s(?<year>\d+),\s(?<host_time>.*))(\r\n)Text:(?<text_group>.*)\n?/
      );

      convertDates(matchGroups.groups, dateTimeVersion);
      const matchData = groupsToArrayObj(sme, matchGroups.groups);
      data.push(matchData);
    }

    const mappedData = mapDataToSchema(data, siemens_cv_schema);
    const dataToArray = mappedData.map(({ ...rest }) => Object.values(rest));

    const insertSuccess = await bulkInsert(
      jobId,
      dataToArray,
      sysConfigData,
      fileToParse
    );
  } catch (error) {
    await log("error", jobId, sme, "parse_win_7", "FN CATCH", {
      error: error,
    });
  }
};

module.exports = parse_win_7;
