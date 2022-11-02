("use strict");
require("dotenv").config({ path: "../../.env" });
const fs = require("node:fs").promises;
const { log } = require("../../../logger");
const filterToArrays = require("../../../utils/GE/geys_mroc_helpers");
const { get_sme_modality } = require("../../../utils/regExHelpers");
const convertDates = require("../../../utils/dates");
const groupsToArrayObj = require("../../../utils/prep-groups-for-array");
const bulkInsert = require("../../../utils/queryBuilder");
const mapDataToSchema = require("../../../utils/map-data-to-schema");
const { ge_re } = require("../../../utils/parsers");
const { ge_ct_gesys_schema } = require("../../../utils/pg-schemas");

async function ge_ct_gesys(filePath) {
  const manufacturer = "ge";
  const version = "gesys";
  const dateTimeVersion = "type_2";
  const sme_modality = get_sme_modality(filePath);
  const SME = sme_modality.groups.sme;
  const modality = sme_modality.groups.modality;
  const data = [];

  await log("info", "NA", `${SME}`, "ge_ct_gesys", "FN CALL", {
    sme: SME,
    modality,
    file: filePath,
  });

  try {
    const block = /SR\s(\d+).*?EN\s\1/gs;
    const no_box =
      /SR\s(?<sr>\d+)[\n\r](?<epoch>\d+)\s+(?<record_number_concurrent>\d+)\s+(?<misc_param_1>\d+)\s+\w+\s(?<month>\w+)\s+(?<day>\d+)\s(?<host_time>\d{1,2}:\d{1,2}:\d{1,2})\s(?<year>\d+)\s+(?<message_number>(-)?\d+)\s(?<misc_param_2>(-)?\d+)\s+(?<type>.+?)[\n\r](?<data_1>.*?)\s+(?<num_1>\d+)[\n\r]\s(?<message>(.+)((\r?\n.+)*))[\n\r]+\s?EN\s(?<en>\d+)/s;
    const exception_class =
      /SR\s(?<sr>\d+)[\n\r](?<epoch>\d+)\s+(?<record_number_concurrent>\d+)\s+(?<misc_param_1>\d+)\s+\w+\s(?<month>\w+)\s+(?<day>\d+)\s(?<host_time>\d{1,2}:\d{1,2}:\d{1,2})\s(?<year>\d+)\s+(?<message_number>(-)?\d+)\s(?<misc_param_2>(-)?\d+)\s+(?<type>.+?)[\n\r](?<data_1>.*?)\s+(?<num_1>\d+)[\n\r]\s(?<date_2>.+?)[\n\r](?:Host\s:\s(?<host>.+?))\s+(?:Ermes\s\#\s:\s(?<ermes_number>.+?))[\n\r](?:Exception Class\s:\s(?<exception_class>.+?)\s+)(?:Severity\s:\s(?<severity>.+?))[\n\r](?:File\s:\s(?<file>.+?)\s+)(?:Line\#\s:\s(?<line_number>\d+))[\n\r](?:Function\s:\s(.+?))[\n\r](?:Scan\sType\s:\s(.+?))([\n\r]+)(?<message>.+?)([\n\r]+)(?:EN\s(?<en>\d+))/s;

    const fileData = (await fs.readFile(filePath)).toString();

    let matches = fileData.match(block);
    for await (let match of matches) {
      if (ge_re.gesys_mroc.test.for_exception_class.test(match)) {
        const matchGroups = match.match(exception_class);
        convertDates(matchGroups.groups, dateTimeVersion);
        const matchData = groupsToArrayObj(SME, matchGroups.groups);
        data.push(matchData);
      } else {
        const matchGroups = match.match(no_box);
        convertDates(matchGroups.groups, dateTimeVersion);
        const matchData = groupsToArrayObj(SME, matchGroups.groups);
        data.push(matchData);
      }
    }
    const mappedData = mapDataToSchema(data, ge_ct_gesys_schema);
    const dataToArray = mappedData.map(({ ...rest }) => Object.values(rest));
    console.log(mappedData[0])
    
    await bulkInsert(
      dataToArray,
      manufacturer,
      modality,
      filePath,
      version,
      SME
    );

  } catch (error) {
    console.log(error);
    await log("error", "NA", `${SME}`, "ge_ct_gesys", "FN CALL", {
      sme: SME,
      manufacturer,
      modality,
      file: filePath,
      error: error.message,
    });
  }
}

module.exports = ge_ct_gesys;
