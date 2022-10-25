const pgPool = require("../db/pg-pool");
const { log } = require("../logger");
const convertRowsToColumns = require("./convert-rows-to-columns");
const queries = require("./queries");
const { ge_mri_gesys, siemens_ct_win_7 } = require("./pg-schemas");

async function bulkInsert(data, manufacturer, modality, file, version, sme) {
  try {
    const query = queries[`${manufacturer}`][`${modality}`][`${version}`];

    console.log("Version: " + version);
    console.log(
      "SME: " + sme,
      "Manufacturer: " + manufacturer,
      "Modality: " + modality,
      "File Path: " + file
    );

    console.log(query);

    const allData = [];
    for (let i = 0; i < data.length; i++) {
      for (const [groupName, groupValue] of Object.entries(data[i])) {
        siemens_ct_win_7[groupName] = groupValue;
      }
      allData.push(siemens_ct_win_7);
    }

    console.log(allData[0])

    const dataToArray = allData.map(({ ...rest }) => Object.values(rest));
    const payload = await convertRowsToColumns("1", sme, dataToArray, file);

    await pgPool.query(query, payload);
  } catch (error) {
    console.log(error);
    await log("error", "NA", "NA", "bulkInsert", `FN CALL`, {
      error,
      file: file,
    });
  }
}

/* async function bulkInsert(data, modality, columns, file) {
  try {
    let groupArray = [];

    for await (let group of data) {
      for (let string in group) {
        group[string] = group[string].replace(/['"]+/g, "");
        group[string] = "'" + group[string] + "'";
      }
      let string = `(${[...group]})`;
      groupArray.push(string);
    }

    const query = `
  INSERT INTO ${modality}(${[...columns]})
  VALUES
  ${[...groupArray]}
  `;

    await pgPool.query(query);
  } catch (error) {
    await log("error", "NA", "NA", "bulkInsert", `FN CALL`, {
      error,
      file: file,
    });
  }
} */

module.exports = bulkInsert;
