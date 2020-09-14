let instance = null

class AnimalMongodb {
  async store({ name, numberOfFeet, etag, versionId }) {
    console.log(`storing ${name} to database..`);
    return { data: { id: 'some-id' }, message: null }
  }
}

class SingletonAnimalMongodb {
  static getInstance() {
    if (!instance) {
      instance = new AnimalMongodb()
    }

    return instance
  }
}

module.exports = SingletonAnimalMongodb