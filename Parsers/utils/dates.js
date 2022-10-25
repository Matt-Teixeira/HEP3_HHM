const { DateTime } = require("luxon");

const monthMap = {
  January: "01",
  February: "02",
  March: "03",
  April: "04",
  May: "05",
  June: "06",
  July: "07",
  August: "08",
  September: "09",
  October: "10",
  November: "11",
  December: "12",
};

function convertDates(matchGroup) {
  const month = monthMap[matchGroup.month];
  const timeRe = /(?<hour>\d{2}):(?<minute>\d{2}):(?<second>\d{2})/
  const timeMatches = matchGroup.time.match(timeRe);

  const dt = DateTime.fromObject({
    day: matchGroup.day,
    month: month,
    year: matchGroup.year,
    hour: timeMatches.groups.hour,
    minute: timeMatches.groups.minute,
    second: timeMatches.groups.second
  })
  matchGroup.host_dateTime = new Date(dt.ts);
}

module.exports = convertDates;
