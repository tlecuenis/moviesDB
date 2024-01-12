const z = require('zod')

const movieSchema = z.object({
    title: z.string({
        invalid_type_error: 'Movie title must be a string',
        required_error: 'Movie title is required'
    }),
    year: z.number().int().min(1900).max(2024),
    director: z.string(),
    duration: z.number().int().positive(),
    poster: z.string().url({
        message: 'Poster must be a valid URL'
    }),
    // genre: z.array(z.enum(['Action', 'Crime', 'Drama', 'Adventure', 'Sci-Fi', 'Thriller','Comedy', 'Horror', 'Fantasy', 'Romance']),
    // {
    //     required_error: 'Movie genre is required',
    //     invalid_type_error: 'Movie genre must be an array of enum Genre'
    // }),
    genre_id: z.array(z.enum(['Action', 'Crime', 'Drama', 'Adventure', 'Sci-Fi', 'Thriller','Comedy', 'Horror', 'Fantasy', 'Romance']),
    {
        required_error: 'Movie genre is required',
        invalid_type_error: 'Movie genre must be an array of enum Genre'
    }),
    rate: z.number().min(0).max(10),
})

function validateMovie(object){
    return movieSchema.safeParse(object) // safeParse nos ahorra tener que hacer un try, catch
}

function validatePartialMovie(object){
    return movieSchema.partial().safeParse(object) // partial -> 1. si no enviamos no son campos requeridos | 2. si no está en el schema la ignora
}

module.exports = {
    validateMovie,
    validatePartialMovie
}