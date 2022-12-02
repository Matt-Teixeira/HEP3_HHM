const { log } = require("../../logger");
const philips_ct_parsers = require("./CT");
const philips_mri_parsers = require("./MRI");
const philips_cv_parsers = require("./CV");

const philipsModalities = async (jobId, sysConfigData) => {
  await log("info", jobId, "NA", "philipsModalities", "FN CALL");

  try {
    const modality = sysConfigData.hhm_config.modality;

    switch (modality) {
      case "MRI":
        await philips_mri_parsers(jobId, sysConfigData);
        break;
      case "CT":
        await philips_ct_parsers(jobId, sysConfigData);
        break;
      case "CV/IR":
        await philips_cv_parsers(jobId, sysConfigData);
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
