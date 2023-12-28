// const mysql = require('mysql')
const mysql = require('mysql2')
const crypto = require('crypto')
require('dotenv/config')

const DEFAULT_CONFIGURATION = {
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: 'password',
    database: 'moviesdb'
}

const config = process.env.DATABASE_URL ?? DEFAULT_CONFIGURATION

const connection = mysql.createConnection(config)

class MovieModel {
    static getAll ({ genre }, callback) {
        if(genre){
            const lowerCaseGenre = genre.toLowerCase()

            // obtener id genero de la tabla de la bbdd usando el nombre y género
            // el ? reemplaza loweCaseGenre, de manera de que solo sea una cadena de texto y el sistema no la evalúe como query
            // el usuario desde la entrada de datos puede hacer SQL INYECTION: http://localhost:3000/movies?genre="DROP TABLE" y así cualquier ejemplo
            connection.query(`SELECT id FROM genre WHERE LOWER(name) = ?;`, [lowerCaseGenre], function (error, results) {
                if (error) throw error
                // genero no encontrado
                if(results.length === 0) callback([])

                const genreId = results[0].id
                // obtener todas las peliculas de la tabla
                connection.query(`SELECT movie_id FROM movie_genres WHERE genre_id = ?;`, [genreId], function (error, results) {
                    if (error) throw error
                    const movies = []
                    results.map((result, i) => {
                        // distinct sirve para devolver repuestas SIN REPETIR
                        connection.query('SELECT DISTINCT BIN_TO_UUID(id) id, title, year, director, duration, poster, rate FROM movie INNER JOIN movie_genres ON id = ?;', [result.movie_id], function (error, results2) {
                            if (error) throw error
                            movies.push(results2[0])
                            if (results.length-1 === i){
                                callback(movies)
                            }
                        })
                    })
                })
            })
        } else{
            const result = connection.query('SELECT BIN_TO_UUID(id) id, title, year, director, duration, poster, rate FROM movie', function (error, results) {
                if (error) throw error
                
                callback(results)
            })
            return result[0] //porque devuelve un array de dos posiciones, en la primera la respuesta
        }
        
    }

    static getById ({ id }, callback) {
        //cuando el id es incorrecto da error acá
        connection.query('SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie WHERE id = UUID_TO_BIN(?);', [id], function (error, results) {
            if (error) throw error
            callback(results)
        })
    }

    static create ({ input }, callback) {
        
        // obtener el genre según la película
        const {
            genre: genreInput,
            title,
            year,
            duration,
            director,
            poster,
            rate
        } = input

        // FALTA CONECTARLO CON LA TABLA GENRE
        

        // Utilizar SQL es una buena opción para obtener uuid
        //const {uuidResult} = connection.query('SELECT UUID() uuid;', function (error, results) {
            
        const uuid = crypto.randomUUID()
        
        try{
            connection.query(
                `INSERT INTO  movie (id, title, year, director, duration, poster, rate) VALUES (UUID_TO_BIN('${uuid}'), ?, ?, ?, ?, ?, ?);`, [title, year, director, duration, poster, rate], function (error, results) {
                    if (error) throw error
            })
        } catch(e){
            throw new Error('Error creating movie')
        }
                    
        connection.query('SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie WHERE id = UUID_TO_BIN(?);', uuid, function (error, results) {
            if (error) throw error
            callback(results[0])
        })
    }

    static delete ({ id }, callback) {
        connection.query('DELETE FROM movie WHERE BIN_TO_UUID(id) = (?);', [id], function (error, results) {
            if (error) throw error
            callback(results)
        })
    }

    static update ({ id, input }, callback) {
        input = {
            title: input.title,
            year: input.year,
            director: input.director,
            duration: input.duration,
            poster: input.poster,
            rate: input.rate
        }
        
        connection.query(`UPDATE movie SET title=IFNULL(?, title), year=IFNULL(?, year), director=IFNULL(?, director), duration=IFNULL(?, duration), poster=IFNULL(?, poster), rate=IFNULL(?, rate) WHERE id = UUID_TO_BIN(?);`, [input.title, input.year, input.director, input.duration, input.poster, input.rate, id], function (error, results) {
            if (error) throw error
        })
        connection.query('SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie WHERE id = UUID_TO_BIN(?);',[id], function (error, results) {
            if (error) throw error
            callback(results)
        })
    }
        
}

module.exports = {
    MovieModel
}


