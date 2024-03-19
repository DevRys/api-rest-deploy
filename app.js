import express, { json } from 'express'
import moviesRoutes from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'

// import { readJSON } from './utils.js'

// import movies from './movies.json' with { type: 'json' } //En un futuro funcionara asi
// import moviesJSON from './movies.json' assert { type: 'json' } // Sintaxis experimental, podria no funcionar en el futuro

// Leer un JSON en ESModules
// import fs from 'node:fs'
// const moviesJSON = JSON.parse(fs.readFileSync('./movies.json', 'utf-8'))

// Leer un JSON en ESModules recomedado | forma nativa de CommonJS
// meta.url Direcion del archivo actual

// const moviesJSON = readJSON('./movies.json')

const PORT = process.env.PORT || 3000

const app = express()
app.disable('x-powered-by')

// console.log('Process: ', process.title)

// metodos normales: GET, POST, HEAD
// metodos complejos: PUT, PATCH, DELETE

// CORS PRE-Flight
// OPTIONS

app.use(corsMiddleware())

app.use(json())

app.use((req, res, next) => {
  const { url, method } = req
  console.log(`[${method}] ${url}`)
  next()
})

app.get('/', (req, res) => {
  res.json({ message: 'hi' })
})

app.use('/movies', moviesRoutes)

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port http://localhost:${PORT}`)
})

// app.get('/movies', (req, res) => {
//   const origin = req.header('origin')

//   if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
//     res.header('Access-Control-Allow-Origin', origin)
//   }

//   const { genre } = req.query
//   if (genre) {
//     const filterMovies = moviesJSON.filter((movie) =>
//       movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
//     )
//     return res.json(filterMovies)
//   }
//   res.json(moviesJSON)
// })

// app.post('/movies', (req, res) => {
//   // const { title, year, director, duraction, poster, genre, rate } = req.body

//   // if (!title || !year || !director || !duraction || !poster || !genre) {
//   //   return res.status(400).json({ message: 'Missing required fields' })
//   // }
//   const result = validateMovie(req.body)

//   if (result.error) {
//     return res.status(400).json({ message: JSON.parse(result.error.message) })
//   }

//   const newMovie = {
//     id: randomUUID(), // uuid v4
//     ...result.data
//   }

//   moviesJSON.push(newMovie)
//   res.status(201).json(newMovie)
// })

// app.delete('/movies/:id', (req, res) => {
//   const origin = req.header('origin')

//   if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
//     res.header('Access-Control-Allow-Origin', origin)
//   }

//   const { id } = req.params
//   const movieIndex = moviesJSON.findIndex((movie) => movie.id === id)

//   if (movieIndex === -1) {
//     return res.status(404).json({ message: 'Movie not found' })
//   }

//   moviesJSON.splice(movieIndex, 1)

//   return res.json({ message: 'Movie deleted' }) // 204 No Content
// })

// app.options('/movies/:id', (req, res) => {
//   const origin = req.header('origin')

//   if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
//     res.header('Access-Control-Allow-Origin', origin)
//     res.header('Access-Control-Allow-Methods', 'PUT, PATCH, DELETE')
//   }

//   res.send(200)
// })
