const { redisClient } = require("./redis");

exports.setCache = async (key, value, ttlseconds = null) => {
  try {
    const data = typeof value === "string" ? value : JSON.stringify(value);

    if (ttlseconds) {
      await redisClient.set(key, value, { EX: ttlseconds });
    } else {
      await redisClient.set(key, value);
    }
  } catch (error) {
    return error.message;
  }
};

exports.getCache = async (key) => {
  try {
    const data = await redisClient.get(key);
    if (!data) return null;

    return JSON.parse(data);
  } catch (error) {
    return error.message;
  }
};

exports.deleteCache = async (key) => {
  try {
    await redisClient.del(key);
  } catch (error) {
    return error.message;
  }
};

exports.hasKey = async (key) => {
  return (await redisClient.exists(key)) === 1;
};

exports.expire = async (key, seconds) => {
  await redisClient.expire(key, seconds);
};
