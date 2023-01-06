("use strict");
require("dotenv").config({ path: "../.env" });
const {log} = require("../logger");
const redis = require("redis");
const execReadFileSize = require("../read/exec-readFileSize");

// SETUP ENV BASED RESOURCES -> REDIS CLIENT, JOB SCHEDULES
const clienConfig = {
  socket: {
    port: 6379,
    host: process.env.REDIS_IP,
  },
};

async function updateRedisFileSize(sme, exec_path, file_path, file) {
  try {
    await log("info", "NA", sme, "updateRedisFileSize", "FN CALL");
    const redisClient = redis.createClient(clienConfig);

    redisClient.on(
      "error",
      async (err) =>
        await log("error", "NA", "NA", "redisClient.on", `ON ERROR`, {
          // TODO: KILL APP?
          error: err,
        })
    );
    await redisClient.connect();

    const newFileSize = await execReadFileSize(
      exec_path,
      `${file_path}/${file}`
    );
    const setKey = `${sme}.${file}`;
    const setValue = newFileSize.trim();
    await redisClient.set(setKey, setValue);
    await redisClient.quit();
    return;
  } catch (error) {
    await log("error", "NA", sme, "updateRedisFileSize", "FN CALL", {
      error: error,
    });
  }
}

async function getRedisFileSize(sme, file) {
  try {
    await log("info", "NA", sme, "getRedisFileSize", "FN CALL");
    const redisClient = redis.createClient(clienConfig);

    redisClient.on(
      "error",
      async (err) =>
        await log("error", "NA", "NA", "redisClient.on", `ON ERROR`, {
          // TODO: KILL APP?
          error: err,
        })
    );
    await redisClient.connect();

    const getKey = `${sme}.${file}`;
    const fileSize = await redisClient.get(getKey);
    redisClient.quit();
    return fileSize;
  } catch (error) {
    await log("error", "NA", sme, "getRedisFileSize", "FN CALL", {
      error: error,
    });
  }
}

async function getCurrentFileSize(sme, exec_path, file_path, file) {
  try {
    await log("info", "NA", sme, "getCurrentFileSize", "FN CALL");
    const currentFileSize = await execReadFileSize(
      exec_path,
      `${file_path}/${file}`
    );
    return currentFileSize;
  } catch (error) {
    await log("error", "NA", sme, "getCurrentFileSize", "FN CALL", {
      error: error,
    });
  }
}

module.exports = { updateRedisFileSize, getCurrentFileSize, getRedisFileSize };
