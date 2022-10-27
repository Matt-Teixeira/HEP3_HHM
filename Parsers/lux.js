const { DateTime } = require("luxon");

const dt = DateTime.fromObject({
  day: 27,
  month: 8,
  year: 2022,
  hour: 8,
  minute: 7,
  second: 32,
});

console.log(dt.toJSDate());
console.log(new Date(dt.ts))
