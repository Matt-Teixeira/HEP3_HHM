("use strict");
require("dotenv").config({ path: "../../.env" });
const fs = require("node:fs").promises;
const { log } = require("../../logger");
const { get_sme_modality } = require("../../utils/regExHelpers");
const { win_7_re } = require("../../utils/parsers");
const bulkInsert = require("../../utils/queryBuilder");
const convertDates = require("../../utils/dates");

const parse_win_7 = async (filePath) => {
  const version = 7;
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
      let row = [];

      let matchGroups = match.groups.big_group.match(win_7_re.small_group);

      convertDates(matchGroups.groups);

      row.push(
        SME,
        matchGroups.groups.source_group,
        matchGroups.groups.host_date,
        matchGroups.groups.time,
        matchGroups.groups.domain_group,
        matchGroups.groups.type_group,
        matchGroups.groups.id_group,
        matchGroups.groups.text_group
      );
      data.push(row);

      await log("info", "NA", `${SME}`, "readFile", "FN CALL", {
        source_group: matchGroups.groups.source_group,
        domain_group: matchGroups.groups.domain_group,
        type_group: matchGroups.groups.type_group,
        id_group: matchGroups.groups.id_group,
        month: matchGroups.groups.month,
        day: matchGroups.groups.day,
        year: matchGroups.groups.year,
        text_group: matchGroups.groups.text_group,
      });
    }
    await bulkInsert(
      data,
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
