("use strict");
require("dotenv").config({ path: "../../.env" });
const fs = require("node:fs");
const readline = require("readline");
const { log } = require("../../../logger");
const {
  get_sme_modality,
  blankLineTest,
} = require("../../../utils/regExHelpers");
const bulkInsert = require("../../../utils/queryBuilder");
const convertDates = require("../../../utils/dates");
const groupsToArrayObj = require("../../../utils/prep-groups-for-array");
const mapDataToSchema = require("../../../utils/map-data-to-schema");
const { philips_cv_eventlog_schema } = require("../../../utils/pg-schemas");
const { philips_re } = require("../../../utils/parsers");

async function phil_cv_eventlog(filePath) {
  try {
    const manufacturer = "philips";
    const version = "eventlog";
    const dateTimeVersion = "type_3";
    const sme_modality = get_sme_modality(filePath);
    const SME = sme_modality.groups.sme;
    const modality = sme_modality.groups.modality;

    const data = [];

    await log("info", "NA", `${SME}`, "phil_cv_eventlog", "FN CALL", {
      sme: SME,
      modality,
      file: filePath,
    });

    const rl = readline.createInterface({
      input: fs.createReadStream(filePath),
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      let matches = line.match(philips_re.cv.eventlog);
      if (matches === null) {
        const isNewLine = blankLineTest(line);
        if (isNewLine) {
          continue;
        } else {
          await log("error", "NA", "NA", "Not_New_Line", "FN CALL", {
            message: "This is not a blank new line - Bad Match",
            line,
          });
        }
      } else {
        convertDates(matches.groups, dateTimeVersion);
        const matchData = groupsToArrayObj(SME, matches.groups);
        data.push(matchData);
      }
    }

    // homogenize data to prep for insert to db
    const mappedData = mapDataToSchema(data, philips_cv_eventlog_schema);
    const dataToArray = mappedData.map(({ ...rest }) => Object.values(rest));

    await bulkInsert(
      dataToArray,
      manufacturer,
      modality,
      filePath,
      version,
      SME
    );
  } catch (error) {
    await log("error", "NA", `${SME}`, "phil_cv_eventlog", "FN CALL", {
      sme: SME,
      modality,
      file: filePath,
      error: error.message,
    });
  }
}

module.exports = phil_cv_eventlog;

/* XDDS�2022-03-02�08:40:26�Information�20481�TechnicalEventID: 840000104 �Description: XDDS discovered a new device �Channel Identification: X-Ray Channel Undefined �Module: XDDS �Source file: .\XDDSDeviceFinder.cpp �Line Number: 990 �Memo: DHCP server file: C:\Program files\DHCPServer\dhcpsrv.ini is already up to date for device: ID IP address: 172.22.1.6 MAC address: 00:E0:4B:49:88:D7 providing 1 services: XDDSServiceTypeImageDetectionLateral
CAHost�2022-03-02�08:40:40�Information�200�TechnicalEventID: 220200 �Description: Client status changed �Channel Identification: X-Ray Channel Undefined �Module: CAHost �Source file: t:\houston_cos_inc2_ec_build_1211834\uos\os\configassist\src\cahost\computer.cpp �Line Number: 402 �Memo: Status of GEOIPC changed to Running
Archiving & Networking�2022-03-01�20:10:35�Information�20481�Technical Event ID:   570000024�Description: Archiving configuration data�Channel Identification: X-Ray Channel Undefined�Module: C:\Program Files\PMS\Fusion\Ar_archnetwork_prod\ArArchNetworkServer_ur.exe�Source File: .\ArConfigurationAdapter.cpp�Line Number: 2284�Memo: [SERVICE_SENDER]  Archiving & Networking [SERVICE_RECEIVER]  Archiving & Networking [MESSAGE NAME]  TEMPLATE_TYPE:  �SubsystemNumber: 0�ThreadName: 9024 */
// (?<category>.+?)\S(?<host_date>\d{4}-\d{2}-\d{2})\S(?<host_time>\d{1,2}:\d{1,2}:\d{1,2})\S(?<error_type>\w+)\S(?<num>\d+)�?(?=Technical)((Technical Event ID:\s+|TechnicalEventID:)(?<technical_event_id>.+?)�)?(?:Description: (?<Description>.+?)�)?(?:Channel Identification: (?<ChannelID>.+?)�)?(?:Module: (?<Module>.+?)�)?((Source File: |Source file: )(?<Source>.+?)�)?(?:Line Number: (?<Line>.+?)�)(?:(Memo: |Memo:)(?<Memo>.+)�?)�?((?:SubsystemNumber: (?<sub>).?)�)?
