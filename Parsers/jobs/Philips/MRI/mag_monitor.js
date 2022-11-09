("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const fs = require("node:fs").promises;
const { philips_re } = require("../../../parse/parsers");
const insertJsonB = require("../../../persist/phil_mri_monitor_data_insert");
const pgPool = require("../../../db/pg-pool");
const { DateTime } = require("luxon");

async function phil_mri_monitor(jobId, filePath, sysConfigData) {
  const sme = sysConfigData[0].id;
  const manufacturer = sysConfigData[0].manufacturer;
  const modality = sysConfigData[0].modality;

  try {
    await log("info", jobId, sme, "phil_mri_monitor", "FN CALL", {
      sme: sme,
      modality,
      file: filePath,
    });

    const jsonData = {};

    let files = await fs.readdir(filePath);

    let monitorFileTest = /monitor/;

    const monitorFiles = files.filter(
      (file) => monitorFileTest.test(file) === true
    );

    for await (const file of monitorFiles) {
      const fileName = file.split(".")[0];
      jsonData[fileName] = [];
    }

    for await (const file of monitorFiles) {
      const fileName = file.split(".")[0];
      const fileData = (await fs.readFile(`${filePath}/${file}`)).toString();
      const matchGroups = fileData.matchAll(philips_re.mri.monitor[fileName]);

      for await (const group of matchGroups) {
        // console.log(JSON.stringify(group.groups));
        jsonData[fileName].push(JSON.stringify(group.groups));
      }
    }

    //await insertJsonB(jobId, [sme, jsonData]);

    let count = 0;
    for (const prop in jsonData) {

      let queryString = "SELECT * FROM philips_mri_monitoring_data"
      let value = [prop];
      let queryData = await pgPool.query(queryString)

      console.log(queryData.rows[0].host_date);
      const fileData = jsonData[prop];
      //console.log(prop, fileData);
      for await (const data of fileData) {
        let d2 = DateTime.fromISO(queryData.rows[0].host_date);
        console.log(d2)
        const dataPoint = JSON.parse(data);
        //console.log(prop, dataPoint)
        
        let d1 = DateTime.fromISO(dataPoint.host_date);
        let dateIncremented = d1.toMillis() - d2.toMillis();
        if (dateIncremented === 86400000) {
          console.log(dataPoint);
        }
        count++;
        if (count === 500) {
          return;
        }
      }
      return;
      let lastDataPoint = JSON.parse(jsonData[prop][jsonData[prop].length - 1]);
    }
  } catch (error) {
    console.log(error);
    await log("error", jobId, sme, "phil_mri_monitor", "FN CALL", {
      sme: sme,
      modality,
      file: filePath,
      error: error,
    });
  }
}

module.exports = phil_mri_monitor;
/*
const data = {
  file_name: [
    {
      host_date: "2016-07-31",
      host_time: "18:34:20",
      tech_room_humidity: "64.2",
    },
    {
      host_date: "2016-11-17",
      host_time: "08:23:55",
      tech_room_humidity: "76.2",
    },
  ],
};
*/
