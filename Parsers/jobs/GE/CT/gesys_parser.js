("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const fs = require("node:fs").promises;
const groupsToArrayObj = require("../../../parse/prep-groups-for-array");
const { ge_re } = require("../../../parse/parsers");
const mapDataToSchema = require("../../../persist/map-data-to-schema");
const { ge_ct_gesys_schema } = require("../../../persist/pg-schemas");
const bulkInsert = require("../../../persist/queryBuilder");
const convertDates = require("../../../utils/dates");
const {
  isFileModified,
  updateFileModTime,
} = require("../../../utils/isFileModified");
const {
  getCurrentFileSize,
  getRedisFileSize,
  updateRedisFileSize,
} = require("../../../utils/redis");

async function ge_ct_gesys(jobId, sysConfigData, fileToParse) {
  const dateTimeVersion = fileToParse.datetimeVersion;
  const sme = sysConfigData.id;

  const data = [];

  try {
    await log("info", jobId, sme, "ge_ct_gesys", "FN CALL");
    const updateSizePath = "./read/sh/readFileSize.sh";
    const fileSizePath = "./read/sh/readFileSize.sh";

    let complete_file_path = `${sysConfigData.hhm_config.file_path}/${fileToParse.file_name}`;

    // TEMP
    //await updateRedisFileSize(sme, updateSizePath, sysConfigData.hhm_config.file_path, fileToParse.file_name);

    const currentFileSize = await getCurrentFileSize(
      fileSizePath,
      sysConfigData.hhm_config.file_path,
      fileToParse.file_name
    );
    console.log("CURRENT FILE SIZE: " + currentFileSize);

    const prevFileSize = await getRedisFileSize(sme, fileToParse.file_name);
    console.log("PREV FILE SIZE: " + prevFileSize);

    const delta = currentFileSize - prevFileSize;
    console.log(delta);

    return;

    const fileData = (await fs.readFile(complete_file_path)).toString();

    let matches = fileData.match(ge_re.ct.gesys.block);
    for await (let match of matches) {
      const matchGroups = match.match(ge_re.ct.gesys.new);
      convertDates(matchGroups.groups, dateTimeVersion);
      const matchData = groupsToArrayObj(sme, matchGroups.groups);
      data.push(matchData);
    }

    const mappedData = mapDataToSchema(data, ge_ct_gesys_schema);
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
  } catch (error) {
    await log("error", sme, "ge_ct_gesys", "FN CALL", {
      error: error,
    });
  }
}

module.exports = ge_ct_gesys;
