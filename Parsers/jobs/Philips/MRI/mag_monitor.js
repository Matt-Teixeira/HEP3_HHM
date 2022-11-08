const path = require("path");
const fs = require("node:fs").promises;

async function getMonitorFiles() {
  const directoryPath =
    "/home/matt-teixeira/hep3/hhm_parsers/Parsers/test_data/Philips/MR/SME01406";

  let files = await fs.readdir(directoryPath);
  //console.log(files);
  let monitorFileTest = /monitor/;

  const monitorFiles = files.filter(
    (file) => monitorFileTest.test(file) === true
  );

  for (const file of monitorFiles) {
    console.log(file);
  }
}

getMonitorFiles();
