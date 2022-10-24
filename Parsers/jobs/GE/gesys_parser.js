("use strict");
require("dotenv").config({ path: "../../.env" });
const fs = require("node:fs").promises;
const { log } = require("../../logger");
const { get_sme_modality } = require("../../utils/regExHelpers");
const bulkInsert = require("../../utils/queryBuilder");

async function ge_mri_gesys(filePath) {
  const version = "gesys";
  const data = [];
  const sme_modality = get_sme_modality(filePath);
  const SME = sme_modality.groups.sme;
  const modality = sme_modality.groups.modality;

  await log("info", "NA", `${SME}`, "ge_mri_gesys", "FN CALL", {
    sme: SME,
    modality,
    file: filePath,
  });

  const ge_gesys_re =
    /(?<block>SR(.+)((\r?\n.+)*)[\r\n]+(.+)((\r?\n.+)*)[\n\r]+EN\s\d+)/g; //(?<block>SR.*[\r\n].*[\r\n].*[\r\n].*([\r\n]+).*([\r\n]+).*[\r\n].*?([\r\n]+)EN\s\d+)

  const no_box_gesys_mroc_re =
    /SR\s(?<sr_group>\d+)[\n\r](?<t_stamp>\d+)\s+(?<num_1>\d+)\s+(?<num_2>\d+)\s+\w+\s(?<month>\w+)\s+(?<day>\d+)\s(?<time>\d{1,2}:\d{1,2}:\d{1,2})\s(?<year>\d+)\s+(?<num_3>(-)?\d+)\s(?<num_4>(-)?\d+)\s+mroc\s(?<mroc>.*)[\n\r](?<data_1>.*?)\s+(?<num_5>\d+)[\n\r]\s(?<data_2>(.+)((\r?\n.+)*))[\n\r]\s?EN\s(?<en>\d+)/; // SR\s(?<sr_group>\d+)[\n\r](?<t_stamp>\d+)\s+(?<num_1>\d+)\s+(?<num_2>\d+)\s+\w+\s(?<month>\w+)\s+(?<day>\d+)\s(?<time>\d{1,2}:\d{1,2}:\d{1,2})\s(?<year>\d+)\s+(?<num_3>(-)?\d+)\s(?<num_4>(-)?\d+)\s+mroc\s(?<mroc>.*)[\n\r](?<data_1>.*?)\s+(?<num_5>\d+)[\n\r]\s(?<data_2>.*[\s].*(\n\s.*)?)[\n\r]\s?EN\s(?<en>\d+)

  const box_ge_gesys_mroc_re =
    /SR\s(?<sr_group>\d+).*\s+(?<t_stamp>\d+)\s+(?<num_1>\d)\s+(?<num_2>\d)\s+\w+\s(?<month>\w+)\s+(?<day>\d+)\s(?<time>\d{1,2}:\d{1,2}:\d{1,2})\s(?<year>\d+)\s+(?<num_3>\d+)\s(?<num_4>\d+)\s+mroc\s(?<mroc>.*)\s+(?<data_1>.*?)\s+(?<num_5>\d+)\s+Server\sName:\s(?<server_name>\w+)\s+\s+(?<data_2>.*)\s+EN\s(?<en>.*)/;

  const exception_class_mroc_re =
    /SR\s(?<sr_group>\d+)[\n\r](?<t_stamp>\d+)\s+(?<num_1>\d)\s+(?<num_2>\d)\s+\w+\s(?<month>\w+)\s+(?<day>\d+)\s(?<time>\d{1,2}:\d{1,2}:\d{1,2})\s(?<year>\d+)\s+(?<num_3>\d+)\s(?<num_4>\d+)\s+mroc\s(?<mroc>.*)[\n\r](?<data_1>.*?)\s+(?<num_5>\d+)[\n\r]\sException\sClass:\s(?<exception_class>(.+)((\r?\n.+)*))[\n\r]\sEN\s(?<en>\d+)/; // /SR\s(?<sr_group>\d+)[\n\r](?<t_stamp>\d+)\s+(?<num_1>\d)\s+(?<num_2>\d)\s+\w+\s(?<month>\w+)\s+(?<day>\d+)\s(?<time>\d{1,2}:\d{1,2}:\d{1,2})\s(?<year>\d+)\s+(?<num_3>\d+)\s(?<num_4>\d+)\s+mroc\s(?<mroc>.*)[\n\r](?<data_1>.*?)\s+(?<num_5>\d+)[\n\r]\sException\sClass:\s(?<exception_class>(.*[\n\r].*)+)EN\s(?<en>\d+)/

  const task_id_mroc_re =
    /SR\s(?<sr_group>\d+)[\n\r](?<t_stamp>\d+)\s+(?<num_1>\d)\s+(?<num_2>\d)\s+\w+\s(?<month>\w+)\s+(?<day>\d+)\s(?<time>\d{1,2}:\d{1,2}:\d{1,2})\s(?<year>\d+)\s+(?<num_3>\d+)\s(?<num_4>\d+)\s+mroc\s(?<mroc>.*)[\n\r](?<data_1>.*?)\s+(?<num_5>\d+)[\n\r]\sTask\sID:\s(?<task_id>.*?)\s+Time:\s(?<time_2>\d+)\s+Object:\s(?<object>.*)[\n\r]Exception\sClass:\s(?<exception_class>(.+)((\r?\n.+)*))[\n\r]\sEN\s(?<en>\d+)/;

  const boxTestRe = //;
  const exceptionClassTestRe = /Exception Class:/;
  const taskIdTestRe = /Task\sID:/;

  try {
    const fileData = (await fs.readFile(filePath)).toString();

    let matches = fileData.matchAll(ge_gesys_re);
    let matchesArray = [...matches];

    let count = 0;
    for await (let match of matchesArray) {
      count++;
      
        let matchGroup;
        let boxTest = boxTestRe.test(match[0]);

        if (boxTest) {
          // some blocks have  in them. Test for this permutation.
          matchGroup = match.groups.block.match(box_ge_gesys_mroc_re);
          // Some "Exception Class:" have  box in them. Run exception_class_mroc_re if both boxTest and exceptionClassTestRe pass
          if (exceptionClassTestRe.test(match.groups.block)) {
            matchGroup = match.groups.block.match(exception_class_mroc_re);
            console.log(matchGroup.groups);
          }
          console.log(matchGroup.groups);
        } else {
          // If  is not in block, test for "Exception Class:" permutation.
          let isExceptionClassBlock = exceptionClassTestRe.test(
            match.groups.block
          );
          if (isExceptionClassBlock) {
            console.log(match[0]);
            // Test to see if exception block contains "Task Id:" permutation.
            let isTaskIdBlock = taskIdTestRe.test(match.groups.block);
            console.log(isTaskIdBlock);
            if (isTaskIdBlock) {
              matchGroup = match.groups.block.match(task_id_mroc_re);
              console.log(matchGroup.groups);
            } else {
              console.log("Within exception_class_mroc_re");
              matchGroup = match.groups.block.match(exception_class_mroc_re);
              console.log(matchGroup.groups);
            }
          } else {
            console.log("Within no_box_gesys_mroc_re");
            matchGroup = match.groups.block.match(no_box_gesys_mroc_re);
            console.log(match[0])
            console.log(matchGroup.groups);
          }
        }
      
    }
  } catch (error) {
    console.log(error);
    await log("error", "NA", `${SME}`, "ge_mri_gesys", "FN CALL", {
      sme: SME,
      modality,
      file: filePath,
      error: error.message,
    });
  }
}

module.exports = ge_mri_gesys;

// SR\s(?<sr_group>\d+)[\n\r](?<t_stamp>\d+)\s+(?<num_1>\d)\s+(?<num_2>\d)\s+\w+\s(?<month>\w+)\s+(?<day>\d+)\s(?<time>\d{1,2}:\d{1,2}:\d{1,2})\s(?<year>\d+)\s+(?<num_3>\d+)\s(?<num_4>\d+)\s+mroc\s(?<mroc>.*)[\n\r](?<data_1>.*?)\s+(?<num_5>\d+)
