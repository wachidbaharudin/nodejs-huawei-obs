const { Router } = require('express')
const multer = require('multer')

const formData = multer()
let instance = null

class AnimalRouter {
  constructor(controller) {
    this.controller = controller
    this.router = Router()
  }

  getRoutes() { 
    this.setRoutes()

    return this.router 
  }

  setRoutes() {
    // POST - /animals
    const formUploadPicture = formData.fields([{ name: 'picture', maxCount: 1 }])
    this.router.post('', formUploadPicture, (req, res) => {
      this.controller.add({ name: req.body.name, file: req.files['picture'][0] })
        .then(result => res.json(result))
        .catch(err => res.status(400).json({ message: err.message }))
    })

    // GET - all animals
    this.router.get('', (req, res) => {
      this.controller.getAnimals()
        .then(result => {
          res.json(result)
        })
        .catch(err => res.status(400).json({ message: err.message }))
    })

    // GET - /animals
    this.router.get('/image', (req, res) => {
      this.controller.getImage({ id: req.query.id })
      .then(result => {
        // convert stream.Readble to Buffer
        let data = []
        result.content.on('data', (chunk) => { data.push(chunk) })
        result.content.on('end', () => {
          res.writeHead(200, { 'Content-Type': result.contentType })
          res.end(Buffer.concat(data))
        })
      })
      .catch(err => res.status(400).json({ message: err.message }))
    })

    // DELETE - /animals
    this.router.delete('', (req, res) => {
      this.controller.delete({ id: req.query.id })
        .then(result => { res.json(result) })
        .catch(err => res.status(400).json({ message: err.message }))
    })

  }
}

class SingletonAnimalRouter {
  static getInstance(controller) {
    return !instance ? instance = new AnimalRouter(controller) : instance
  }
}

module.exports = SingletonAnimalRouter