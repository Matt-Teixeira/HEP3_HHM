("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const {
  getExistingDates,
  updateTable,
  insertData,
} = require("../../../utils/phil_mri_monitor_helpers"); //quenched

async function quenched(sme, data) {
  try {
    // Get all rows/dates for this sme
    const systemDates = await getExistingDates(sme);

    let bucket = [];
    let prevData = data[0].host_date; //Set to first date in file data(file capture groups)

    for await (const obs of data) {
      let currentDate = obs.host_date;

      if (currentDate === prevData) {
        bucket.push(obs.quenched);
        prevData = currentDate;
        continue;
      }
      if (currentDate !== prevData) {
        // Not equal means a change in dates
        let maxValue = Math.max(...bucket);

        if (maxValue > 0) {
          maxValue = 1;
        } else {
          maxValue = 0;
        }

        if (systemDates.includes(prevData)) {
          // If date exists for sme: UPDATE row
          await updateTable("quenched", [maxValue, sme, prevData]);
          bucket = [];
          prevData = obs.host_date;
          bucket.push(obs.quenched);
        } else {
          // If date dose not exist: INSERT new row
          await insertData("quenched", [sme, prevData, maxValue]);
          bucket = [];
          prevData = obs.host_date;
          bucket.push(obs.quenched);
        }
      }
    }

    // Deal with last set of dates in array
    if (systemDates.includes(prevData)) {
      // If date exists for sme: UPDATE row
      let maxValue = Math.max(...bucket);

      if (maxValue > 0) {
        maxValue = 1;
      } else {
        maxValue = 0;
      }

      await updateTable("quenched", [
        maxValue,
        sme,
        data[data.length - 1].host_date,
      ]);
    } else {
      // If date dose not exist: INSERT new row
      let maxValue = Math.max(...bucket);

      if (maxValue > 0) {
        maxValue = 1;
      } else {
        maxValue = 0;
      }

      await insertData("quenched", [
        sme,
        data[data.length - 1].host_date,
        maxValue,
      ]);
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = quenched;
