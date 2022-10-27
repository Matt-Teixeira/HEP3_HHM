("use strict");
require("dotenv").config({ path: "../../.env" });
const fs = require("node:fs");
const readline = require("readline");
const { log } = require("../../../logger");
const { get_sme_modality } = require("../../../utils/regExHelpers");
const bulkInsert = require("../../../utils/queryBuilder");
const convertDates = require("../../../utils/dates");
const groupsToArrayObj = require("../../../utils/prep-groups-for-array");
const mapDataToSchema = require("../../../utils/map-data-to-schema");
const { philips_re } = require("../../../utils/parsers");
const { philips_ct_eal_schema } = require("../../../utils/pg-schemas");

async function phil_ct_eal_info(filePath) {
  try {
    const manufacturer = "philips";
    const version = "eal_info";
    const dateTimeVersion = "type_1";
    const sme_modality = get_sme_modality(filePath);
    const SME = sme_modality.groups.sme;
    const modality = sme_modality.groups.modality;

    const data = [];

    await log("info", "NA", `${SME}`, "phil_ct_eal_info", "FN CALL", {
      sme: SME,
      modality,
      file: filePath,
    });

    const rl = readline.createInterface({
      input: fs.createReadStream(filePath),
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      let matches = line.match(philips_re.ct_eal);

      convertDates(matches.groups, dateTimeVersion);
      const matchData = groupsToArrayObj(SME, matches.groups);
      data.push(matchData);
    }

    data.shift();

    // homogenize data to prep for insert to db (may remove this step )
    const mappedData = mapDataToSchema(data, philips_ct_eal_schema);
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
    await log("error", "NA", `${SME}`, "phil_ct_eal_info", "FN CALL", {
      sme: SME,
      modality,
      file: filePath,
      error: error.message,
    });
  }
}

module.exports = phil_ct_eal_info;
