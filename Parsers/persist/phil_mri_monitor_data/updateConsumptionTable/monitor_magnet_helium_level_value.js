("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const pgPool = require("../../../db/pg-pool");
const {
  getExistingDates,
  updateTable,
  insertData,
} = require("../../../utils/phil_mri_monitor_helpers");

async function helium_level(sme, data) {
  try {
    // Get all rows/dates for this sme
    const systemDates = await getExistingDates(sme);

    let bucket = [];
    let prevData = data[0].host_date; //Set to first date in file data(file capture groups)

    for await (const obs of data) {
      let currentDate = obs.host_date;

      if (currentDate === prevData) {
        bucket.push(obs.helium_level_value);
        prevData = currentDate;
        continue;
      }
      if (currentDate !== prevData) { // Not equal means a change in dates
        const minValue = Math.min(...bucket);

        if (systemDates.includes(prevData)) {
          // If date exists for sme: UPDATE row
          await updateTable("helium_level_value", [minValue, sme, prevData]);
          bucket = [];
          prevData = obs.host_date;
          bucket.push(obs.helium_level_value);
        } else {
          // If date dose not exist: INSERT new row
          await insertData("helium_level_value", [sme, prevData, minValue]);
          bucket = [];
          prevData = obs.host_date;
          bucket.push(obs.helium_level_value);
        }
      }
    }

    // Deal with last set of dates in array
    if (systemDates.includes(prevData)) {
      // If date exists for sme: UPDATE row
      const minValue = Math.min(...bucket);
      await updateTable("helium_level_value", [
        minValue,
        sme,
        data[data.length - 1].host_date,
      ]);
    } else {
      // If date dose not exist: INSERT new row
      const minValue = Math.min(...bucket);
      await insertData("helium_level_value", [
        sme,
        data[data.length - 1].host_date,
        minValue,
      ]);
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = helium_level;
