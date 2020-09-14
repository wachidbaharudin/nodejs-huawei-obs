const config = require('../../config')
const Obs = require('../repos/obs')
const streamBuffers = require('stream-buffers');
const fs = require('fs')
let instance = null

class AnimalController {
  something = 'aaaaa'
  constructor(animalRepo, obsRepo) {
    this.animalRepo = animalRepo
    this.obsInstance = obsRepo

    console.log('on animal.controller.constructor:', typeof this.obsInstance);
  }

  async add(req, res) {
    console.log('on controller.upload:', typeof this.obsInstance);
    console.log('on controller.req.files:', req.files['picture'][0]);

    // Body only available 
    let myReadableStreamBuffer = new streamBuffers.ReadableStreamBuffer({
      frequency: 10,      // in milliseconds.
      chunkSize: 2048     // in bytes.
    });
    myReadableStreamBuffer.put(req.files['picture'][0].buffer)

    let keyGenerate = `${new Date().getMilliseconds()}-`
    await this.obsInstance.putObject({
      Bucket: config.obs.bucketName,
      Key: keyGenerate + req.files['picture'][0].originalname,
      Body: myReadableStreamBuffer,
      ContentType: req.files['picture'][0].mimetype,
      ContentLength: req.files['picture'][0].size
    })
      .then(async result => {
        console.log('on controller.upload.putOject');
        return this.animalRepo.store({
          name: req.body.name,
          numberOfFeet: req.body.number_of_feet,
          etag: result.etag
        })
      })
      .then(response => {
        console.log('on controller.upload.store');
        res.json(response)
      })
      .catch(err => {
        console.log('on controller.err:', err.message);
        res.status(400).json({ message: err.message })
      })
  }

  async get(req, res) {
    await this.obsInstance.getObject({
      Bucket: config.obs.bucketName,
      Key: '777-Screenshot from 2020-09-14 15-13-57.png',
      // ResponseContentType: 'image/png'
      // SaveAsStream
    })
      .then(async result => {
        let data = []
        result.content.on('data', (chunk) => {
          data.push(chunk)
          console.log('on data', chunk);
        })

        result.content.on('end', () => {
          let string = Buffer.concat(data)
          res.writeHead(200, { 'Content-Type': 'image/png' });
          res.end(string, 'binary')
        })
      })
      .catch(err => {
        console.log('on controller.get.err:', err.message);
        res.status(400).json({ message: err.message })
      })
  }
}

class SingletonAnimalController {
  static getInstance(animalServiceInstance, obsRepoInstance) {
    if (!instance) {
      instance = new AnimalController(animalServiceInstance, obsRepoInstance)
    }

    return instance
  }
}

module.exports = SingletonAnimalController