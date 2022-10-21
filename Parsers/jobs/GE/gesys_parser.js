("use strict");
require("dotenv").config({ path: "../../.env" });
const fs = require("node:fs").promises;
const { log } = require("../../logger");
const { get_sme_modality } = require("../../utils/regExHelpers");
const bulkInsert = require("../../utils/queryBuilder");

async function ge_mri_gesys(filePath) {
  const version = "gesys";
  const data = [];
  const sme_modality = get_sme_modality(filePath);
  const SME = sme_modality.groups.sme;
  const modality = sme_modality.groups.modality;

  await log("info", "NA", `${SME}`, "ge_mri_gesys", "FN CALL", {
    sme: SME,
    modality,
    file: filePath,
  });

  const ge_gesys_re =
    /(?<block>SR.*[\r\n].*[\r\n].*[\r\n].*([\r\n]+).*([\r\n]+).*[\r\n].*?([\r\n]+)EN\s\d+)/g; ///(?<block>SR.*\n.*\n.*\n.*\n+.*\n+.*)/g;

  const ge_gesys_2 =
    /(?<prefix>[A-Z]+)\s(?<num_1>\d+)\s(?<time_stamp>\d+)\s+(?<num_2>\d+)\s+(?<num_3>\d+)\s+\w+\s(?<month>\w+)\s+(?<day>\d+)\s(?<time>\d{1,2}:\d{1,2}:\d{1,2})\s(?<year>\d+)\s+(?<num_4>\d+)\s(?<num_5>\d+)\s+(?<data_1>\w+)\s+(?<data_2>\w+)\s+(?<data_3>.*?)\s+(?<num_6>\d+)\s+(?<data_4>.*)([\r\n]+)?\s(?<data_5>.*)/g;

    const re = //g;
  try {
    const fileData = (await fs.readFile(filePath)).toString();

    let matches = fileData.matchAll(ge_gesys_re);
    let matchesArray = [...matches];

    let count = 0;
    for await (let match of matchesArray) {
      if (count < 10) {
        let matchGroups = match.groups.block.match(ge_gesys_2);
        console.log(matchGroups)
        count++;
      }
    } 
  } catch (error) {
    await log("error", "NA", `${SME}`, "ge_mri_gesys", "FN CALL", {
      sme: SME,
      modality,
      file: filePath,
      error: error.message,
    });
  }
}

module.exports = ge_mri_gesys;
