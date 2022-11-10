const tech_room_humidity = require("./monitor_System_HumTechRoom");
const helium_level = require("./monitor_magnet_helium_level_value");
const tech_room_temp = require("./monitor_System_TempTechRoom");
const long_term_boil_off = require("./monitor_magnet_lt_boiloff");
const cryo_comp_malf_minutes = require("./monitor_cryocompressor_time_status");
const cryo_comp_comm_error = require("./monitor_cryocompressor_cerr");
const cryo_comp_press_alarm = require("./monitor_cryocompressor_palm");
const cryo_comp_temp_alarm = require("./monitor_cryocompressor_talm");
const mag_dps_status_minutes = require("./monitor_magnet_pressure_dps");
const quenched = require("./monitor_magnet_quench");

async function initialUpdate(sme, fileName, data) {
  switch (fileName) {
    case "monitor_System_HumTechRoom":
      await tech_room_humidity(sme, data);
      break;
    case "monitor_magnet_helium_level_value":
      await helium_level(sme, data);
      break;
    case "monitor_System_TempTechRoom":
      await tech_room_temp(sme, data);
      break;
    case "monitor_magnet_lt_boiloff":
      await long_term_boil_off(sme, data);
      break;
    case "monitor_cryocompressor_time_status":
      await cryo_comp_malf_minutes(sme, data);
      break;
    case "monitor_cryocompressor_cerr":
      await cryo_comp_comm_error(sme, data);
      break;
    case "monitor_cryocompressor_palm":
      await cryo_comp_press_alarm(sme, data);
      break;
    case "monitor_cryocompressor_talm":
      await cryo_comp_temp_alarm(sme, data);
      break;
    case "monitor_magnet_pressure_dps":
      await mag_dps_status_minutes(sme, data);
      break;
    case "monitor_magnet_quench":
      await quenched(sme, data);
      break;
    default:
      break;
  }
}

module.exports = initialUpdate;
