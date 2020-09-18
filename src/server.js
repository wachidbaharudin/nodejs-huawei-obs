const express = require('express')
const http = require('http')
const config = require('../config')
const MongoClient = require('mongodb').MongoClient

const app = express()
const server = http.createServer(app)
const mongoClient = new MongoClient(config.mongodb.url, { useNewUrlParser: true, useUnifiedTopology: true })
let db = null

// Connect to mongoDB
mongoClient.connect().then(async () => {
  console.log('MongoDB connected!')
  db = mongoClient.db(config.mongodb.dbName)
  
  // Animals
  const obsRepo = require('./repos/obs').getInstance()
  const animalRepo = require('./repos/animal-mongodb').getInstance(db)
  const animalController = require('./contollers/animal-controller').getInstance(animalRepo, obsRepo)
  const animalRoute = require('./routes/animal-route').getInstance(animalController)
  app.use('/animals', animalRoute.getRoutes())

  app.use('', async (req, res) => {
    let dbList = mongoClient.db().admin().listDatabases()
    res.json({ database: dbList })
  })
}).catch(err => console.error(err))


server.listen(config.port, () => {
  console.log(`Listen on port: ${config.port}`);
})


