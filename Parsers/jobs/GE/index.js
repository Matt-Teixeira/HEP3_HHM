const { log } = require("../../logger");
const ge_mri_parsers = require("./MRI");
const ge_ct_parsers = require("./CT");
const ge_cv_parsers = require("./CV");

const geModalities = async (jobId, filePath, sysConfigData) => {
  await log("info", jobId, "NA", "geModalities", "FN CALL", {
    file: filePath,
  });

  try {
    const modality_file_re = /\/(?<modality>\w+)\/SME\d{5}\/(?<file_type>\w+)/;
    const modality_file = filePath.match(modality_file_re);
    let file_type = modality_file.groups.file_type;

    console.log(sysConfigData[0].modality);
    console.log(file_type);
    switch (sysConfigData[0].modality) {
      case "MRI":
        await ge_mri_parsers(jobId, filePath, sysConfigData, file_type);
        break;
      case "CT":
        console.log("Running ge_ct_parsers");
        await ge_ct_parsers(jobId, filePath, sysConfigData, file_type);
        break;
      case "CV/IR":
        await ge_cv_parsers(jobId, filePath, sysConfigData, file_type);
        break;
      default:
        break;
    }
  } catch (error) {
    await log("error", jobId, "NA", "geModalities", "FN CATCH", {
      error: error,
      file: filePath,
    });
  }
};

module.exports = geModalities;
