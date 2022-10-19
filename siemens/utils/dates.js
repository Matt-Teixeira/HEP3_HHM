const monthMap = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

function convertDates(matchGroup) {
  const month = monthMap[matchGroup.month];
  matchGroup.host_date = `${matchGroup.year}-${month}-${matchGroup.day}`;
}

module.exports = convertDates;
