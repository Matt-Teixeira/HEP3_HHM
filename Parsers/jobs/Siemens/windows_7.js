("use strict");
require("dotenv").config({ path: "../../.env" });
const fs = require("node:fs").promises;
const { log } = require("../../logger");
const { get_sme_modality } = require("../../utils/regExHelpers");
const { win_7_re } = require("../../utils/parsers");
const bulkInsert = require("../../utils/queryBuilder");
const convertDates = require("../../utils/dates");
const groupsToArrayObj = require("../../utils/prep-groups-for-array");
const mapDataToSchema = require("../../utils/map-data-to-schema");
const { siemens_ct_mri } = require("../../utils/pg-schemas");

const parse_win_7 = async (filePath) => {
  const manufacturer = "siemens";
  const version = "windows";
  const dateTimeVersion = "siemens_7"
  const data = [];
  const sme_modality = get_sme_modality(filePath);
  const SME = sme_modality.groups.sme;
  const modality = sme_modality.groups.modality;

  try {
    await log("info", "NA", "NA", "parse_win_7", "FN CALL", {
      sme: SME,
      modality,
      file: filePath,
    });

    const fileData = (await fs.readFile(filePath)).toString();

    let matches = fileData.matchAll(win_7_re.big_group);
    let matchesArray = [...matches];

    for await (let match of matchesArray) {
      let matchGroups = match.groups.big_group.match(win_7_re.small_group);
      convertDates(matchGroups.groups, dateTimeVersion);
      const matchData = groupsToArrayObj(SME, matchGroups.groups);
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

  } catch (error) {
    await log("error", "NA", `${SME}`, "parse_win_7", "FN CATCH", {
      error: error,
    });
  }
};

module.exports = parse_win_7;
