const { log } = require("../../logger");
const philips_ct_parsers = require("./CT");
const philips_mri_parsers = require("./MRI");
const philips_cv_parsers = require("./CV");

const philipsModalities = async (filePath, manufacturer) => {
  await log("info", "NA", "NA", "philipsModalities", "FN CALL", {
    file: filePath,
  });

  try {
    console.log(manufacturer, filePath);
    const modality_file_re = /\/(?<modality>\w+)\/SME\d{5}\/(?<file_type>\w+)/;
    const modality_file = filePath.match(modality_file_re);

    console.log(modality_file.groups.modality);
    console.log(modality_file.groups)
    
    switch (modality_file.groups.modality) {
      case "MR":
        await philips_mri_parsers(filePath, modality_file.groups.file_type);
        break;
      case "CT":
        await philips_ct_parsers(filePath, modality_file.groups.file_type);
        break;
      case "CV":
        await philips_cv_parsers(filePath, modality_file.groups.file_type);
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
