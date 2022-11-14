("use strict");
require("dotenv").config({ path: "../.env" });
const { log } = require("../logger");
const pgPool = require("../db/pg-pool");

async function getSystemDbData(sme) {
  const queryStr =
    "SELECT * FROM philips_mri_monitoring_data WHERE equipment_id = ($1)";
  return await pgPool.query(queryStr, [sme]);
}

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

async function getDateRanges(jobId, sme, values) {
  try {
    await log("info", jobId, sme, "getDateRanges", "FN CALL", {
      sme: sme,
    });

    let queryStr = `SELECT host_date FROM philips_mri_monitoring_data WHERE equipment_id = $1 AND host_date BETWEEN $2 AND $3`;

    const systemDates = await pgPool.query(queryStr, values);
    const systemDatesToArray = [];

    for await (const date of systemDates.rows) {
      systemDatesToArray.push(date.host_date);
    }
    return systemDatesToArray;
  } catch (error) {
    await log("error", jobId, sme, "getDateRanges", "FN CALL", {
      sme: sme,
      values: values,
      error: error,
    });
  }
}

async function getExistingNotNullDates(jobId, sme, col_name) {
  try {
    await log("info", jobId, sme, "getExistingDates", "FN CALL", {
      sme: sme,
    });
    const queryStr = `SELECT host_date FROM philips_mri_monitoring_data WHERE equipment_id = ($1) AND ${col_name} IS NOT NULL ORDER BY host_date DESC LIMIT 1`;
    const v = [sme];
    const systemDates = await pgPool.query(queryStr, v);
    const systemDatesToArray = [];
    for await (const date of systemDates.rows) {
      systemDatesToArray.push(date.host_date);
    }
    return systemDatesToArray;
  } catch (error) {
    await log("error", jobId, sme, "getExistingDates", "FN CALL", {
      sme: sme,
      error: error,
    });
  }
}

async function updateTable(jobId, col_name, arr) {
  try {
    await log("info", jobId, arr[1], "updateTable", "FN CALL", {
      sme: arr[1],
    });
    const queryStr = `UPDATE philips_mri_monitoring_data SET ${col_name} = $1 WHERE equipment_id = $2 AND host_date = $3`;
    await pgPool.query(queryStr, arr);
  } catch (error) {
    await log("error", jobId, arr[1], "updateTable", "FN CALL", {
      sme: arr[1],
      error: error,
    });
  }
}

async function insertData(jobId, col_name, arr) {
  try {
    await log("info", jobId, arr[0], "insertData", "FN CALL", {
      sme: arr[0],
    });
    const queryStr = `INSERT INTO philips_mri_monitoring_data(equipment_id, host_date, ${col_name}) VALUES($1, $2, $3)`;
    await pgPool.query(queryStr, arr);
  } catch (error) {
    await log("error", jobId, arr[0], "insertData", "FN CALL", {
      sme: arr[0],
      error: error,
    });
  }
}

const process_file_config = {
  monitor_System_HumTechRoom: {
    type: "max",
    col: "tech_room_humidity",
  },
  monitor_System_TempTechRoom: {
    type: "max",
    col: "tech_room_temp",
  },
  monitor_magnet_lt_boiloff: {
    type: "max",
    col: "long_term_boil_off",
  },
  monitor_cryocompressor_time_status: {
    type: "max",
    col: "cryo_comp_malf_minutes",
  },
  monitor_magnet_pressure_dps: {
    type: "max",
    col: "mag_dps_status_minutes",
  },
  monitor_cryocompressor_cerr: {
    type: "bool",
    col: "cryo_comp_comm_error",
  },
  monitor_cryocompressor_palm: {
    type: "bool",
    col: "cryo_comp_press_alarm",
  },
  monitor_cryocompressor_talm: {
    type: "bool",
    col: "cryo_comp_temp_alarm",
  },
  monitor_magnet_quench: {
    type: "bool",
    col: "quenched",
  },
  monitor_magnet_helium_level_value: {
    type: "min",
    col: "helium_level_value",
  },
};

module.exports = {
  getSystemDbData,
  getExistingDates,
  getDateRanges,
  getExistingNotNullDates,
  updateTable,
  insertData,
  process_file_config,
};
