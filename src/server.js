const express = require('express')
const http = require('http')

const app = express()
const server = http.createServer(app)
const animalRoute = require('./routes/animal-route').getInstance(app)

const port = 12011

// app.use('', (req, res) => {
//   res.json({ status: "Ok" })
// })

animalRoute.setRoutes()

server.listen(port, () => {
  console.log(`Listen on port: ${port}`);
})


