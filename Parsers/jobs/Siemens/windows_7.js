("use strict");
require("dotenv").config({ path: "../../.env" });
const fs = require("node:fs").promises;
const { log } = require("../../logger");
const { win_7_re } = require("../../utils/parsers");
const bulkInsert = require("../../utils/queryBuilder");
const convertDates = require("../../utils/dates");
const groupsToArrayObj = require("../../utils/prep-groups-for-array");
const mapDataToSchema = require("../../utils/map-data-to-schema");
const { siemens_ct_mri } = require("../../utils/pg-schemas");

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
