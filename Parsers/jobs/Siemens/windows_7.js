("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../logger");
const fs = require("node:fs").promises;
const { win_7_re } = require("../../parse/parsers");
const groupsToArrayObj = require("../../parse/prep-groups-for-array");
const mapDataToSchema = require("../../persist/map-data-to-schema");
const { siemens_ct_mri } = require("../../persist/pg-schemas");
const bulkInsert = require("../../persist/queryBuilder");
const convertDates = require("../../utils/dates");

const parse_win_7 = async (jobId, filePath, sysConfigData) => {
  const version = "windows";
  const dateTimeVersion = "type_2";
  const sme = sysConfigData[0].id;
  const manufacturer = sysConfigData[0].manufacturer;
  const modality = sysConfigData[0].modality;

  const data = [];

  try {
    await log("info", jobId, sme, "parse_win_7", "FN CALL", {
      sme: sme,
      modality,
      file: filePath,
    });

    const fileData = (await fs.readFile(filePath)).toString();

    let matches = fileData.matchAll(win_7_re.big_group);
    let matchesArray = [...matches];

    for await (let match of matchesArray) {
      if(match === null) {
        throw new Error("Bad match")
      }
      let matchGroups = match.groups.big_group.match(win_7_re.small_group);
      convertDates(matchGroups.groups, dateTimeVersion);
      const matchData = groupsToArrayObj(sme, matchGroups.groups);
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
  } catch (error) {
    await log("error", jobId, sme, "parse_win_7", "FN CATCH", {
      error: error,
    });
  }
};

module.exports = parse_win_7;
