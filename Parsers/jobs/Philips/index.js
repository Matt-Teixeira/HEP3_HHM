const { log } = require("../../logger");
const philips_ct_parsers = require("./CT");
const philips_mri_parsers = require("./MRI");
const philips_cv_parsers = require("./CV");

const philipsModalities = async (jobId, filePath, sysConfigData) => {
  await log("info", jobId, "NA", "philipsModalities", "FN CALL", {
    file: filePath,
  });

  try {
    console.log(sysConfigData);

    const modality_file_re = /\/(?<modality>\w+)\/SME\d{5}\/(?<file_type>\w+)/;
    const modality_file = filePath.match(modality_file_re);
    let file_type = modality_file.groups.file_type

    console.log("File Type: " + file_type)

    switch (sysConfigData[0].modality) {
      case "MRI":
        await philips_mri_parsers(jobId, filePath, sysConfigData, file_type);
        break;
      case "CT":
        await philips_ct_parsers(jobId, filePath, sysConfigData, file_type);
        break;
      case "CV/IR":
        await philips_cv_parsers(jobId, filePath, sysConfigData, file_type);
        break;
      default:
        break;
    }
  } catch (error) {
    await log("error", "NA", "NA", "philipsModalities", "FN CATCH", {
      error: error,
    });
  }
};

module.exports = philipsModalities;
