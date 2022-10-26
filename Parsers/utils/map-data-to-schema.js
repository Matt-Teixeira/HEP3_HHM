function mapDataToSchema(parsedData, schema) {
  const allData = [];
  for (let i = 0; i < parsedData.length; i++) {
    // preserve schema state
    const clearedSchema = { ...schema };

    for (let [groupName, groupValue] of Object.entries(parsedData[i])) {
      clearedSchema[groupName] = groupValue;
    }
    allData.push(clearedSchema);
  }
  return allData;
}

module.exports = mapDataToSchema;
