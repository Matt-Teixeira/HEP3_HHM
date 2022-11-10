("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const pgPool = require("../../../db/pg-pool");
const {
  getExistingDates,
  updateTable,
  insertData,
} = require("../../../utils/phil_mri_monitor_helpers"); //tech_room_humidity

async function tech_room_humidity(sme, data) {
  try {
    // Get all rows/dates for this sme
    const systemDates = await getExistingDates(sme);

    let bucket = [];
    let prevData = data[0].host_date; //Set to first date in file data(file capture groups)

    for await (const obs of data) {
      let currentDate = obs.host_date;

      if (currentDate === prevData) {
        bucket.push(obs.tech_room_humidity);
        prevData = currentDate;
        continue;
      }
      if (currentDate !== prevData) {
        // Not equal means a change in dates
        const minValue = Math.max(...bucket);

        if (systemDates.includes(prevData)) {
          // If date exists for sme: UPDATE row
          await updateTable("tech_room_humidity", [minValue, sme, prevData]);
          bucket = [];
          prevData = obs.host_date;
          bucket.push(obs.tech_room_humidity);
        } else {
          // If date dose not exist: INSERT new row
          await insertData("tech_room_humidity", [sme, prevData, minValue]);
          bucket = [];
          prevData = obs.host_date;
          bucket.push(obs.tech_room_humidity);
        }
      }
    }

    // Deal with last set of dates in array
    if (systemDates.includes(prevData)) {
      // If date exists for sme: UPDATE row
      const minValue = Math.max(...bucket);
      await updateTable("tech_room_humidity", [
        minValue,
        sme,
        data[data.length - 1].host_date,
      ]);
    } else {
      // If date dose not exist: INSERT new row
      const minValue = Math.max(...bucket);
      await insertData("tech_room_humidity", [
        sme,
        data[data.length - 1].host_date,
        minValue,
      ]);
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = tech_room_humidity;
