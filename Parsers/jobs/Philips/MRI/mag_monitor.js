const fs = require("node:fs").promises;
const { philips_re } = require("../../../parse/parsers");
const pgPool = require("../../../db/pg-pool");

async function phil_mri_monitor(jobId, filePath, sysConfigData) {
  const data = [];
  const jsonData = {};
  try {
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

    const jData = JSON.stringify(jsonData);

    const date = new Date();
    const string =
      "INSERT INTO philips_mri_monitor(id, equipment_id, monitoring_data) VALUES($1, $2, $3)";
    const value = [date, "SME00001", jData];
    const insertedData = await pgPool.query(string, value);
    console.log(insertedData);
  } catch (error) {
    console.log(error);
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
