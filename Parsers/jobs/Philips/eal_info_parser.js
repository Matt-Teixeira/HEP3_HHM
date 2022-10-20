("use strict");
require("dotenv").config({ path: "../../.env" });
const fs = require("node:fs");
const readline = require("readline");
const { log } = require("../../logger");
const { get_sme_modality } = require("../../utils/regExTests");

async function phil_ct_eal_info(filePath) {
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

  const ct_eal_re =
    /(?<line>.*?)[|](?<error_type>.*?)[|](?<time_stamp>.*?)[|](?<file>.*?)[|](?<data_dype>.*?)[|](?<Param1>.*?)[|](?<ErrNum>.*?)[|](?<Info>.*?)(\s+)?[|](?<DTime>.*?)[|](?<EalTime>.*?)[|](?<LogNumber>.*?)[|](?<Param2>.*?)[|](?<vxwErrNo>.*?)[|](?<Controller>.*?)?/;

  try {
    const rl = readline.createInterface({
      input: fs.createReadStream(filePath),
      crlfDelay: Infinity,
    });

    let count = 0;
    for await (const line of rl) {
      if (count <= 4) {
        if(line.match(ct_eal_re) === null) {
            continue
        }
        console.log(line.match(ct_eal_re).groups);
        count++;
      } else {
        return;
      }
    }
  } catch (error) {
    await log("error", "NA", `${SME}`, "phil_ct_eal_info", "FN CALL", {
      sme: SME,
      modality,
      file: filePath,
      error: error.message,
    });
  }
}

module.exports = phil_ct_eal_info;
