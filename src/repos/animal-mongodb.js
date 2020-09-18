var mongo = require('mongodb');
let instance = null

class AnimalMongodb {
  constructor(db) {
    this.db = db
    this.collection = this.db.collection('animals')
  }

  async store({ name, key, etag, contentType }) {
    return this.collection.insertOne({
      name,
      key,
      etag,
      contentType
    })
      .then(result => { return result.insertedCount })
      .catch(err => { return err })
  }

  async getAll() {
    return this.collection.find({}).toArray()
      .then(result => { return result })
      .catch(err => { return err })
  }

  async getOne({ id }) {
    let objId = new mongo.ObjectId(id)
    return this.collection.find({ '_id': objId })
      .toArray()
      .then(result => {
        return result[0]
      })
      .catch(err => { return err })
  }

  async deleteOne({ id }) {
    let objId = new mongo.ObjectId(id)
    return this.collection.deleteOne({ '_id': objId })
      .then(result => {
        return result.deletedCount
      })
      .catch(err => { return err })
  }
}

class SingletonAnimalMongodb {
  static getInstance(db) {
    return !instance ? instance = new AnimalMongodb(db) : instance
  }
}

module.exports = SingletonAnimalMongodb