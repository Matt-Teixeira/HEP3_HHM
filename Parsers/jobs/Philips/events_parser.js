("use strict");
require("dotenv").config({ path: "../../.env" });
const fs = require("node:fs");
const readline = require("readline");
const { log } = require("../../logger");
const { get_sme_modality } = require("../../utils/regExHelpers");
const bulkInsert = require("../../utils/queryBuilder");

async function phil_ct_events(filePath) {
  const version = "eal_info";
  const data = [];
  const sme_modality = get_sme_modality(filePath);
  const SME = sme_modality.groups.sme;
  const modality = sme_modality.groups.modality;

  await log("info", "NA", `${SME}`, "phil_ct_eal_info", "FN CALL", {
    sme: SME,
    modality,
    file: filePath,
  });

  const ct_events_re =
    /(?<EventTime>.*?)[|](?<Blob>.*?)[|](?<Type>.*?)[|](?<TStampNum>.*?)[|](?<EAL>.*?)[|](?<Level>.*?)[|](?<ErModulerNum>.*?)[|](?<DateTime>.*?)[|](?<Msg>.*)?/;

  try {
    const rl = readline.createInterface({
      input: fs.createReadStream(filePath),
      crlfDelay: Infinity,
    });

    let count = 0;
    for await (const line of rl) {
      const row = [];
      if (count <= 15) {
        if (line.match(ct_events_re) === null) {
          continue;
        }
        let matches = line.match(ct_events_re).groups;
        row.push(
          SME,
          matches.EventTime,
          matches.Blob,
          matches.Type,
          matches.TStampNum,
          matches.EAL,
          matches.Level,
          matches.ErModulerNum,
          matches.DateTime,
          matches.Msg
        );
        console.log(row);
        data.push(row);
        count++;
      }
    }
    data.shift();
    await bulkInsert(data, modality, filePath, version, SME);
  } catch (error) {
    await log("error", "NA", `${SME}`, "phil_ct_eal_info", "FN CALL", {
      sme: SME,
      modality,
      file: filePath,
      error: error.message,
    });
  }
}

module.exports = phil_ct_events;
