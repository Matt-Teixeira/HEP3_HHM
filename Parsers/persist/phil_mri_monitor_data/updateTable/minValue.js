("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const {
  getExistingDates,
  updateTable,
  insertData,
} = require("../../../utils/phil_mri_monitor_helpers");

async function minValue(jobId, sme, data, column) {
  try {
    await log("info", jobId, sme, "minValue", "FN CALL", {
      sme: sme,
    });
    // Get all rows/dates for this sme
    const startDate = data[data.length - 1].host_date;
    const endDate = data[0].host_date;
    
    const values = [sme, startDate, endDate];
    const systemDates = await getExistingDates(jobId, sme, values, 2);

    let bucket = [];
    let prevData = data[0].host_date; //Set to first date in file data(file capture groups)

    for await (const obs of data) {
      let currentDate = obs.host_date;

      if (currentDate === prevData) {
        bucket.push(obs[column]);
        prevData = currentDate;
        continue;
      }
      if (currentDate !== prevData) {
        // Not equal means a change in dates
        const minValue = Math.min(...bucket);

        if (systemDates.includes(prevData)) {
          // If date exists for sme: UPDATE row
          await updateTable(jobId, column, [minValue, sme, prevData]);
          bucket = [];
          prevData = obs.host_date;
          bucket.push(obs[column]);
        } else {
          // If date dose not exist: INSERT new row
          await insertData(jobId, column, [sme, prevData, minValue]);
          bucket = [];
          prevData = obs.host_date;
          bucket.push(obs[column]);
        }
      }
    }

    // Work with last set of dates in array
    if (systemDates.includes(prevData)) {
      // If date exists for sme: UPDATE row
      const minValue = Math.min(...bucket);
      await updateTable(jobId, column, [
        minValue,
        sme,
        data[data.length - 1].host_date,
      ]);
    } else {
      // If date dose not exist: INSERT new row
      const minValue = Math.min(...bucket);
      await insertData(jobId, column, [
        sme,
        data[data.length - 1].host_date,
        minValue,
      ]);
    }
  } catch (error) {
    await log("error", jobId, sme, "minValue", "FN CALL", {
      sme: sme,
      column: column,
      error: error,
    });
  }
}

module.exports = minValue;
