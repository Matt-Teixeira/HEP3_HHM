const pgPool = require("../db/pg-pool");
const { log } = require("../logger");
const convertRowsToColumns = require("../utils/convert-rows-to-columns");
const queries = require("./queries");

async function bulkInsert(jobId, data, sysConfigData, fileToParse) {
  try {
    const fileVersion = fileToParse.file.split(".")[0];

    /* console.log(sysConfigData.manufacturer)
    console.log(sysConfigData.hhm_config.modality)
    console.log(fileVersion); */

    const query =
      queries[`${sysConfigData.manufacturer}`][`${sysConfigData.hhm_config.modality}`][`${fileVersion}`];
    // console.log(query);

    const payload = await convertRowsToColumns(jobId, sysConfigData.id, data);
    const insertData = await pgPool.query(query, payload);

    await log("info", jobId, sysConfigData.id, "bulkInsert", "FN CALL", {
      query: JSON.stringify(query),
      rowsInserted: insertData.rowCount,
    });
  } catch (error) {
    await log("error", jobId, sysConfigData.id, "bulkInsert", `FN CALL`, {
      error,
    });
  }
}

module.exports = bulkInsert;
