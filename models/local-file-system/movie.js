const movies = require('../../movies.json')
const crypto = require('node:crypto')


class MovieModel {
    static async getAll ({ genre }, callback) { //los parámetros se pasan como objetos para que en un futuro sea más facil extender
        if (genre){
            const filteredMovies = movies.filter(
                movie => movie.genre.includes(genre)
            )
            return filteredMovies
        }
        callback(movies)
    }

    static async getById ({ id }, callback) {
        const movie = movies.find(movie => movie.id === id)
        callback(movie)
    }

    static async create ({ input }, callback) {
        const newMovie = {
            id: crypto.randomUUID(), //UUID v4 - identificador único universal
            ...input // Rest operator solo se puede utilizar con las validacioes hechas
        }

        movies.push(newMovie)
        callback(newMovie)
    }

    static async delete ({ id }, callback) {
        const movieIndex = movies.findIndex(movie => movie.id === id)
        if (movieIndex === -1) return false
        
        movies.splice(movieIndex, 1) // (index, howMany)
        callback(true)
    }

    static async update ({ id, input }, callback) {
        const movieIndex = movies.findIndex(movie => movie.id === id)

        if (movieIndex === -1) return false
        
        const updateMovie = {
            ...movies[movieIndex], //la peli actual (todo el json)
            ...input //lo que vamos a sobreescribit (el nuevo título por ejemplo)
        }
        movies[movieIndex] = updateMovie
        
        callback(updateMovie)
    }
        
}

module.exports = {
    MovieModel
}