("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const fs = require("node:fs").promises;
const groupsToArrayObj = require("../../../parse/prep-groups-for-array");
const { ge_re } = require("../../../parse/parsers");
const mapDataToSchema = require("../../../persist/map-data-to-schema");
const { ge_ct_gesys_schema } = require("../../../persist/pg-schemas");
const bulkInsert = require("../../../persist/queryBuilder");
const { convertDates } = require("../../../utils/dates");
const {
  isFileModified,
  updateFileModTime,
} = require("../../../utils/isFileModified");
const {
  getCurrentFileSize,
  getRedisFileSize,
  updateRedisFileSize,
} = require("../../../utils/redis");
const execTail = require("../../../read/exec-tail");

async function ge_ct_gesys(jobId, sysConfigData, fileToParse) {
  const dateTimeVersion = fileToParse.datetimeVersion;
  const sme = sysConfigData.id;

  const updateSizePath = "./read/sh/readFileSize.sh";
  const fileSizePath = "./read/sh/readFileSize.sh";
  const tailPath = "./read/sh/tail.sh";

  const data = [];

  try {
    await log("info", jobId, sme, "ge_ct_gesys", "FN CALL");

    let complete_file_path = `${sysConfigData.hhm_config.file_path}/${fileToParse.file_name}`;

    const prevFileSize = await getRedisFileSize(sme, fileToParse.file_name);
    console.log("Redis File Size: " + prevFileSize);

    let fileData;
    if (prevFileSize === null) {
      console.log("This needs to be read from file");
      fileData = (await fs.readFile(complete_file_path)).toString();
    }

    if (prevFileSize > 0 && prevFileSize !== null) {
      console.log("File Size prev saved in Redis");

      const currentFileSize = await getCurrentFileSize(
        sme,
        fileSizePath,
        sysConfigData.hhm_config.file_path,
        fileToParse.file_name
      );
      console.log("CURRENT FILE SIZE: " + currentFileSize);

      const delta = currentFileSize - prevFileSize;
      await log("info", jobId, sme, "delta", "FN CALL", {delta: delta});
      console.log("DELTA: " + delta);

      if (delta === 0) {
        await log("warn", jobId, sme, "delta-0", "FN CALL");
        return;
      }

      let tailDelta = await execTail(tailPath, delta, complete_file_path);

      fileData = tailDelta.toString();
      console.log(fileData);
    }

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
      await updateRedisFileSize(
        sme,
        updateSizePath,
        sysConfigData.hhm_config.file_path,
        fileToParse.file_name
      );
    }
  } catch (error) {
    await log("error", "NA", sme, "ge_ct_gesys", "FN CALL", {
      error: error,
    });
  }
}

module.exports = ge_ct_gesys;
