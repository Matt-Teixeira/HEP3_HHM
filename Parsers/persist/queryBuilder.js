const pgPool = require("../db/pg-pool");
const { log } = require("../logger");
const convertRowsToColumns = require("../utils/convert-rows-to-columns");
const queries = require("./queries");

async function bulkInsert(
  data,
  manufacturer,
  modality,
  version,
  sme,
  file,
  jobId
) {
  try {
    console.log("SME: " + sme);
    console.log("Manufacturer: " + manufacturer);
    console.log("Modality: " + modality);
    console.log("Version: " + version);
    const query = queries[`${manufacturer}`][`${modality}`][`${version}`];
    console.log(query);

    const payload = await convertRowsToColumns(jobId, sme, data, file);
    const insertData = await pgPool.query(query, payload);

    await log("info", jobId, sme, "bulkInsert", "FN CALL", {
      file: file,
      query: JSON.stringify(query),
      rowsInserted: insertData.rowCount,
    });
  } catch (error) {
    console.log(error);
    await log("error", jobId, "NA", "bulkInsert", `FN CALL`, {
      error,
      file: file,
    });
  }
}

module.exports = bulkInsert;
