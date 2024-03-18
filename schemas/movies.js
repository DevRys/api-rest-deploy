/* eslint-disable space-before-function-paren */
const z = require('zod')

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'Title must be a string',
    required_error: 'Title is required'
  }),
  year: z.number().int().positive().min(1900).max(2024),
  director: z.string(),
  duration: z.number().int().positive(),
  poster: z.string().url({
    message: 'Poster must be a valid URL'
  }),
  genre: z.array(
    z.enum([
      'Action',
      'Adventure',
      'Sci-Fi',
      'Crime',
      'Drama',
      'Romance',
      'Biography',
      'Crime'
    ]),
    {
      required_error: 'Genre is required',
      invalid_type_error: 'Genre must be an array of strings'
    }
  ),
  rate: z.number().min(0).max(5).default(0)
})

function validateMovie(object) {
  // SafeParse devuelve si hay un error o hay datos
  return movieSchema.safeParse(object)
}

function validatePartialMovie(object) {
  return movieSchema.partial().safeParse(object)
}

module.exports = { validateMovie, validatePartialMovie }
