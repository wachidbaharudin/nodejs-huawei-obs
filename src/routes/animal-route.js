const { Router } = require('express')
const obsRepo = require('../repos/obs').getInstance()
const animalRepo = require('../repos/animal-mongodb').getInstance()
const animalController = require('../contollers/animal-controller').getInstance(animalRepo, obsRepo)
const multer = require('multer')

const formData = multer()
const animalRoutes = Router()
let instance = null

class AnimalRouter {
  constructor(appInstance) {
    this.app = appInstance
  }

  setRoutes() {
    this.app.use('/animals', animalRoutes)

    console.log('on animal.route.setRoutes');

    const formUploadPicture = formData.fields([{ name: 'picture', maxCount: 1 }])
    animalRoutes.post('', formUploadPicture, (req, res) => animalController.add(req, res))
    animalRoutes.get('', (req, res) => animalController.get(req, res))
  }
}

class SingletonAnimalRouter {
  static getInstance(appInstance) {
    if (!instance) {
      instance = new AnimalRouter(appInstance)
    }

    return instance
  }
}

module.exports = SingletonAnimalRouter