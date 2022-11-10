("use strict");
require("dotenv").config({ path: "../.env" });
const { log } = require("../logger");
const pgPool = require("../db/pg-pool");

async function getExistingDates(sme) {
  const text =
    "SELECT host_date FROM philips_mri_monitoring_data WHERE equipment_id = ($1)";
  const v = [sme];
  const systemDates = await pgPool.query(text, v);
  const systemDatesToArray = [];
  for await (const date of systemDates.rows) {
    systemDatesToArray.push(date.host_date);
  }
  return systemDatesToArray;
}

async function updateTable(col_name, arr) {
  const queryStr = `UPDATE philips_mri_monitoring_data SET ${col_name} = $1 WHERE equipment_id = $2 AND host_date = $3`;
  await pgPool.query(queryStr, arr);
}

async function insertData(col_name, arr) {
  const queryStr = `INSERT INTO philips_mri_monitoring_data(equipment_id, host_date, ${col_name}) VALUES($1, $2, $3)`;
  await pgPool.query(queryStr, arr);
}

module.exports = { getExistingDates, updateTable, insertData };
