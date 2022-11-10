("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const {
  getExistingDates,
  updateTable,
  insertData,
} = require("../../../utils/phil_mri_monitor_helpers"); //long_term_boil_off

async function long_term_boil_off(sme, data) {
  try {
    // Get all rows/dates for this sme
    const systemDates = await getExistingDates(sme);

    let bucket = [];
    let prevData = data[0].host_date; //Set to first date in file data(file capture groups)

    for await (const obs of data) {
      let currentDate = obs.host_date;

      if (currentDate === prevData) {
        bucket.push(obs.long_term_boil_off);
        prevData = currentDate;
        continue;
      }
      if (currentDate !== prevData) {
        // Not equal means a change in dates
        const minValue = Math.max(...bucket);

        if (systemDates.includes(prevData)) {
          // If date exists for sme: UPDATE row
          await updateTable("long_term_boil_off", [minValue, sme, prevData]);
          bucket = [];
          prevData = obs.host_date;
          bucket.push(obs.long_term_boil_off);
        } else {
          // If date dose not exist: INSERT new row
          await insertData("long_term_boil_off", [sme, prevData, minValue]);
          bucket = [];
          prevData = obs.host_date;
          bucket.push(obs.long_term_boil_off);
        }
      }
    }

    // Deal with last set of dates in array
    if (systemDates.includes(prevData)) {
      // If date exists for sme: UPDATE row
      const minValue = Math.max(...bucket);
      await updateTable("long_term_boil_off", [
        minValue,
        sme,
        data[data.length - 1].host_date,
      ]);
    } else {
      // If date dose not exist: INSERT new row
      const minValue = Math.max(...bucket);
      await insertData("long_term_boil_off", [
        sme,
        data[data.length - 1].host_date,
        minValue,
      ]);
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = long_term_boil_off;
