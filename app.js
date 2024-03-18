const express = require('express')
const moviesJSON = require('./movies.json')
const crypto = require('node:crypto')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')
const cors = require('cors')

const PORT = process.env.PORT || 3000

const app = express()
app.disable('x-powered-by')

console.log('Process: ', process.title)

// metodos normales: GET, POST, HEAD
// metodos complejos: PUT, PATCH, DELETE

// CORS PRE-Flight
// OPTIONS

const ACCEPTED_ORIGINS = [
  'http://localhost:8080',
  'http://localhost:8081',
  'http://localhost:5080',
  'http://localhost:5500'
]

app.use(cors())

app.use(express.json())

app.use((req, res, next) => {
  const { url, method } = req
  console.log(`[${method}] ${url}`)
  next()
})

app.get('/movies', (req, res) => {
  const origin = req.header('origin')

  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin)
  }

  const { genre } = req.query
  if (genre) {
    const filterMovies = moviesJSON.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    )
    return res.json(filterMovies)
  }
  res.json(moviesJSON)
})

app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = moviesJSON.find((movie) => movie.id === id)
  if (movie) return res.json(movie)

  res.status(404).json({ message: 'Movie not found' })
})

app.post('/movies', (req, res) => {
  // const { title, year, director, duraction, poster, genre, rate } = req.body

  // if (!title || !year || !director || !duraction || !poster || !genre) {
  //   return res.status(400).json({ message: 'Missing required fields' })
  // }
  const result = validateMovie(req.body)

  if (result.error) {
    return res.status(400).json({ message: JSON.parse(result.error.message) })
  }

  const newMovie = {
    id: crypto.randomUUID(), // uuid v4
    ...result.data
  }

  moviesJSON.push(newMovie)
  res.status(201).json(newMovie)
})

app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body)

  if (!result.success) {
    return res.status(400).json({ message: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  const movieIndex = moviesJSON.findIndex((movie) => movie.id === id)

  // if (!movie) return res.status(404).json({ message: 'Movie not found' })
  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  const updatedMovie = { ...moviesJSON[movieIndex], ...result.data }

  moviesJSON[movieIndex] = updatedMovie

  return res.json(updatedMovie)
})

app.delete('/movies/:id', (req, res) => {
  const origin = req.header('origin')

  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin)
  }

  const { id } = req.params
  const movieIndex = moviesJSON.findIndex((movie) => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  moviesJSON.splice(movieIndex, 1)

  return res.json({ message: 'Movie deleted' }) // 204 No Content
})

app.options('/movies/:id', (req, res) => {
  const origin = req.header('origin')

  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin)
    res.header('Access-Control-Allow-Methods', 'PUT, PATCH, DELETE')
  }

  res.send(200)
})

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port http://localhost:${PORT}`)
})
