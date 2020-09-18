require('dotenv').config()

module.exports = {
  port: process.env.APP_PORT,
  obs: {
    accessKeyId: process.env.OBS_ACCESS_KEY_ID,
    secretAccessKey: process.env.OBS_SECRET_ACCESS_KEY,
    bucketName: process.env.OBS_BUCKET_NAME,
    server: process.env.OBS_SERVER
  },
  mongodb: {
    url: `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`,
    dbName: process.env.MONGO_DATABASE
  }
}