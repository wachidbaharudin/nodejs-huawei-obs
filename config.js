require('dotenv').config()

module.exports = {
  obs: {
    accessKeyId: process.env.OBS_ACCESS_KEY_ID,
    secretAccessKey: process.env.OBS_SECRET_ACCESS_KEY,
    bucketName: process.env.OBS_BUCKET_NAME,
    server: process.env.OBS_SERVER
  }
}