("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const {
  getExistingDates,
  updateTable,
  insertData,
} = require("../../../utils/phil_mri_monitor_helpers"); //mag_dps_status_minutes

async function mag_dps_status_minutes(sme, data) {
  try {
    // Get all rows/dates for this sme
    const systemDates = await getExistingDates(sme);

    let bucket = [];
    let prevData = data[0].host_date; //Set to first date in file data(file capture groups)

    for await (const obs of data) {
      let currentDate = obs.host_date;

      if (currentDate === prevData) {
        bucket.push(obs.mag_dps_status_minutes);
        prevData = currentDate;
        continue;
      }
      if (currentDate !== prevData) {
        // Not equal means a change in dates
        let maxValue = Math.max(...bucket);

        if (systemDates.includes(prevData)) {
          // If date exists for sme: UPDATE row
          await updateTable("mag_dps_status_minutes", [
            maxValue,
            sme,
            prevData,
          ]);
          bucket = [];
          prevData = obs.host_date;
          bucket.push(obs.mag_dps_status_minutes);
        } else {
          // If date dose not exist: INSERT new row
          await insertData("mag_dps_status_minutes", [sme, prevData, maxValue]);
          bucket = [];
          prevData = obs.host_date;
          bucket.push(obs.mag_dps_status_minutes);
        }
      }
    }

    // Deal with last set of dates in array
    if (systemDates.includes(prevData)) {
      // If date exists for sme: UPDATE row
      let maxValue = Math.max(...bucket);

      await updateTable("mag_dps_status_minutes", [
        maxValue,
        sme,
        data[data.length - 1].host_date,
      ]);
    } else {
      // If date dose not exist: INSERT new row
      let maxValue = Math.max(...bucket);

      await insertData("mag_dps_status_minutes", [
        sme,
        data[data.length - 1].host_date,
        maxValue,
      ]);
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = mag_dps_status_minutes;
