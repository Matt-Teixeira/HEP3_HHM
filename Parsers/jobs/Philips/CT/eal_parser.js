("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const { philips_re } = require("../../../parse/parsers");
const groupsToArrayObj = require("../../../parse/prep-groups-for-array");
const mapDataToSchema = require("../../../persist/map-data-to-schema");
const { philips_ct_eal_schema } = require("../../../persist/pg-schemas");
const bulkInsert = require("../../../persist/queryBuilder");
const convertDates = require("../../../utils/dates");

async function phil_ct_eal(
  jobId,
  sysConfigData,
  fileToParse,
  ct_eal_events_blocks
) {
  const sme = sysConfigData.id;
  const data = [];

  try {
    await log("info", jobId, sme, "phil_ct_eal", "FN CALL");

    const eal_block_groups =
      ct_eal_events_blocks.matchAll(
        philips_re.ct_eal_new
      );

    for (let match of eal_block_groups) {
      const matchData = groupsToArrayObj(sme, match.groups);
      data.push(matchData);
    }
    console.log(data);

    const mappedData = mapDataToSchema(data, philips_ct_eal_schema);
    const dataToArray = mappedData.map(({ ...rest }) => Object.values(rest));
    
    const query = {query: fileToParse.query.eal}

    const insertSuccess = await bulkInsert(
      jobId,
      dataToArray,
      sysConfigData,
      query
    );


    /* 
      convertDates(matches.groups, dateTimeVersion);
      const matchData = groupsToArrayObj(sme, matches.groups);
      data.push(matchData);


    //const mappedData = mapDataToSchema(data, philips_cteal_schema);

    const dataToArray = mappedData.map(({ ...rest }) => Object.values(rest)); */
  } catch (error) {
    console.log(error);
    await log("error", jobId, sme, "phil_ct_eal", "FN CALL", {
      error,
    });
  }
}

module.exports = phil_ct_eal;
