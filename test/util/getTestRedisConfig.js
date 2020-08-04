const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPost = process.env.REDIS_PORT || '6379';

module.exports = () => {
  return {
    host: redisHost,
    port: redisPost,
  }
};
