const config = require('../../config')
const streamBuffers = require('stream-buffers');
let instance = null

class AnimalController {
  constructor(animalRepo, obsRepo) {
    this.animalRepo = animalRepo
    this.obsInstance = obsRepo
  }

  // add for storing animal data
  async add({ name, file }) {
    // Body only available on stream.readble or string
    let bodyReadble = new streamBuffers.ReadableStreamBuffer({
      frequency: 10,
      chunkSize: 2048
    });
    // convert buffer to readable
    bodyReadble.put(file.buffer)
    
    let key = `${name}-${new Date().getMilliseconds()}-${file.originalname}`

    return this.obsInstance.putObject({
      Bucket: config.obs.bucketName,
      Key: key,
      Body: bodyReadble,
      ContentType: file.mimetype,
      ContentLength: file.size
    })
      .then(async response => { 
        console.log('putObject.response:', response);
        return this.animalRepo.store({ name, key, etag: response.etag, contentType: file.mimetype })
          .then(result => { 
            return (result ? { status: 'Ok' } : { status: 'Error', message: 'Insert failed'}) 
          })
       })
      .catch(err => { throw err })
  }

  // get for get file by id
  async getImage({ id }) {
    return this.animalRepo.getOne({ id })
      .then(resultDb => {
        return this.obsInstance.getObject({
          Bucket: config.obs.bucketName,
          Key: resultDb.key,
        })
          .then(async resultApi => {       
            return { content: resultApi.content, contentType: resultDb.contentType }
          })
          .catch(err => { throw err })

      })
  }

  async getAnimals() {
    return this.animalRepo.getAll()
      .then(async result => {
        return (result.length ? { status: 'Ok', result } : { status: 'Ok', message: 'Data empty'}) 
      })
      .catch(err => { throw err })
  }

  async delete({ id }) {
    return this.animalRepo.deleteOne({ id })
      .then(result => {
        return (result ? { status: 'Ok' } : { status: 'Error', message: 'Delete failed'}) 
      })
      .catch(err => { throw err })
  }

}

class SingletonAnimalController {
  static getInstance(animalServiceInstance, obsRepoInstance) {
    return !instance ? instance = new AnimalController(animalServiceInstance, obsRepoInstance) : instance
  }
}

module.exports = SingletonAnimalController