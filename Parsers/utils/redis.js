("use strict");
require("dotenv").config({ path: "../.env" });
const redis = require("redis");
const execReadFileSize = require("../read/exec-readFileSize");

async function updateRedisFileSize(sme, exec_path, file_path, file) {
  try {
    // SETUP ENV BASED RESOURCES -> REDIS CLIENT, JOB SCHEDULES
    const clienConfig = {
      socket: {
        port: 6379,
        host: process.env.REDIS_IP,
      },
    };

    const redisClient = redis.createClient(clienConfig);

    redisClient.on(
      "error",
      async (err) =>
        await log("error", "NA", "NA", "redisClient", `ON ERROR`, {
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
    console.log(error);
  }
}

async function getRedisFileSize(sme, file) {
  try {
    // SETUP ENV BASED RESOURCES -> REDIS CLIENT, JOB SCHEDULES
    const clienConfig = {
      socket: {
        port: 6379,
        host: process.env.REDIS_IP,
      },
    };

    const redisClient = redis.createClient(clienConfig);

    redisClient.on(
      "error",
      async (err) =>
        await log("error", "NA", "NA", "redisClient", `ON ERROR`, {
          // TODO: KILL APP?
          error: err,
        })
    );
    await redisClient.connect();

    const getKey = `${sme}.${file}`;
    const fileSize = await redisClient.get(getKey);
    console.log(fileSize);
    redisClient.quit();
    return fileSize;
  } catch (error) {
    console.log(error);
  }
}

async function getCurrentFileSize(exec_path, file_path, file) {
  try {
    const currentFileSize = await execReadFileSize(
      exec_path,
      `${file_path}/${file}`
    );
    return currentFileSize;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { updateRedisFileSize, getCurrentFileSize, getRedisFileSize };
