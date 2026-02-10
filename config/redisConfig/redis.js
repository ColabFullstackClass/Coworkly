const redis = require("redis");

const redisClient = redis.createClient();

redisClient.on("error", (err) => {
  console.error("Redis client error", err);
});

redisClient.on("ready", () => {
  console.log("Redis Client started");
});

const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

module.exports = {
  redisClient,
  connectRedis,
};
