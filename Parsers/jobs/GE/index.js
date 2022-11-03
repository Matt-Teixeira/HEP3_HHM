const { log } = require("../../logger");
const ge_mri_parsers = require("./MRI");
const ge_ct_parsers = require("./CT");
const ge_cv_parsers = require("./CV");

const geModalities = async (filePath) => {
  await log("info", "NA", "NA", "geModalities", "FN CALL", {
    file: filePath,
  });

  try {
    const modality_file_re =
      /\/(?<modality>\w+)\/SME\d{5}\/(?<file_type>\w+?)[_\.]/;
    const modality_file = filePath.match(modality_file_re);

    switch (modality_file.groups.modality) {
      case "MRI":
        await ge_mri_parsers(filePath, modality_file.groups.file_type);
        break;
      case "CT":
        await ge_ct_parsers(filePath, modality_file.groups.file_type);
        break;
      case "CV":
        await ge_cv_parsers(filePath, modality_file.groups.file_type);
        break;
      default:
        break;
    }
  } catch (error) {
    await log("error", "NA", "NA", "geModalities", "FN CATCH", {
      error: error,
    });
  }
};

module.exports = geModalities;
