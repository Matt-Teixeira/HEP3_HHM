const { ge_re } = require("../parsers");
const convertDates = require("../dates");
const groupsToArrayObj = require("../prep-groups-for-array");

function filterToArrays(
  SME,
  match,
  matchArray1,
  matchArray2,
  matchArray3,
  matchArray4
) {
  let matchGroup;
  let containsBox = ge_re.gesys_mroc.test.for_box.test(match[0]);

  // Some blocks have  "box" in them. Test for this permutation.
  if (containsBox) {
    // Some "Exception Class:" blocks have  "box" in them. Run exception_class re if both box test and test.for_exception_class pass
    let isExceptionClass = ge_re.gesys_mroc.test.for_exception_class.test(
      match.groups.block
    );
    if (isExceptionClass) {
      matchGroup = match.groups.block.match(ge_re.gesys_mroc.exception_class);
      convertDates(matchGroup.groups);
      const matchData = groupsToArrayObj(SME, matchGroup.groups);
      matchArray3.push(matchData);
    } else {
      matchGroup = match.groups.block.match(ge_re.gesys_mroc.box);
      convertDates(matchGroup.groups);
      const matchData = groupsToArrayObj(SME, matchGroup.groups);
      matchArray1.push(matchData);
    }
  } else {
    // If  is not in block, test for "Exception Class:" permutation.
    let isExceptionClass = ge_re.gesys_mroc.test.for_exception_class.test(
      match.groups.block
    );
    if (isExceptionClass) {
      // Test to see if exception block contains "Task Id:" permutation.
      let isTaskId = ge_re.gesys_mroc.test.for_task_id.test(match.groups.block);
      if (isTaskId) {
        matchGroup = match.groups.block.match(ge_re.gesys_mroc.task_id);
        convertDates(matchGroup.groups);
        const matchData = groupsToArrayObj(SME, matchGroup.groups);
        matchArray4.push(matchData);
      } else {
        matchGroup = match.groups.block.match(ge_re.gesys_mroc.exception_class);
        convertDates(matchGroup.groups);
        const matchData = groupsToArrayObj(SME, matchGroup.groups);
        matchArray3.push(matchData);
      }
    } else {
      matchGroup = match.groups.block.match(ge_re.gesys_mroc.no_box);
      convertDates(matchGroup.groups);
      const matchData = groupsToArrayObj(SME, matchGroup.groups);
      matchArray2.push(matchData);
    }
  }
}

module.exports = filterToArrays;
