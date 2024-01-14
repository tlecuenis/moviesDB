// const mysql = require('mysql')
const mysql = require('mysql2')
const crypto = require('crypto')
const { defaultErrorMap, number } = require('zod')
const { Console } = require('console')
require('dotenv/config')

const DB_HOST = process.env.DB_HOST || 'localhost'
const DB_USER = process.env.DB_USER || 'root'
const DB_PORT = process.env.DB_PORT || 3306
const DB_PASSWORD = process.env.DB_PASSWORD || 'password'
const DB_DATABASE = process.env.DB_DATABASE || 'moviesdb'

const DB_CONFIGURATION = {
    host: DB_HOST,
    user: DB_USER,
    port: DB_PORT,
    password: DB_PASSWORD,
    database: DB_DATABASE
}

const config = DB_CONFIGURATION

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
            const GENRE_INDEX = [
                'Drama',
                'Action',
                'Crime',
                'Sci-Fi',
                'Romance',
                'Horror',
                'Adventure',
                'Biography',
                'Fantasy',
                'Thriller',
                ]
            const movies = []
            const result = connection.query('SELECT DISTINCT BIN_TO_UUID(id) id, title, year, director, duration, poster, rate FROM movie INNER JOIN movie_genres ON id = movie_id', function (error, results) {
                if (error) throw error
                
                results.map((resu, i) => {
                    resu = {
                        ...resu,
                        genre_id: []
                    }
                    connection.query('SELECT genre_id FROM movie_genres WHERE UUID_TO_BIN(?) = movie_id', [resu.id], function (error, resultsGenres) {
                        if (error) throw error
                        resultsGenres.map(res => {
                            res.genre_id = GENRE_INDEX[res.genre_id-1]
                            resu = {
                                ...resu,
                                genre_id: [...resu.genre_id, res.genre_id]
                            }
                        })
                        movies.push(resu)
                        if (i === results.length - 1){
                            callback(movies)
                        }
                        
                    })
                })
                
            })
        
            return result[0] //porque devuelve un array de dos posiciones, en la primera la respuesta
        }
        
    }

    static getById ({ id }, callback) {
        //cuando el id es incorrecto da error acá
        const GENRE_INDEX = [
            'Drama',
            'Action',
            'Crime',
            'Sci-Fi',
            'Romance',
            'Horror',
            'Adventure',
            'Biography',
            'Fantasy',
            'Thriller',
            ]
        const movies = []
        connection.query('SELECT DISTINCT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie WHERE id = UUID_TO_BIN(?);', [id], function (error, results) {
            if (error) throw error
            // callback(results)
            //todo para abajo
            results.map((resu) => {
                // resu = {
                //     ...resu,
                //     genre_id: []
                // }
                resu.genre_id = []
                connection.query('SELECT DISTINCT genre_id FROM movie_genres WHERE UUID_TO_BIN(?) = movie_id', [resu.id], function (error, resultsGenres) {
                    if (error) throw error
                    resultsGenres.map(res => {
                        res.genre_id = GENRE_INDEX[res.genre_id-1]
                        resu = {
                            ...resu,
                            genre_id: [...resu.genre_id, res.genre_id]
                        }
                    })
                    // movies.push(resu)
                    // if (i === results.length - 1){
                    //     callback(movies)
                    // }
                    if (!movies.includes(resu)){
                        movies.push(resu)
                        callback(movies)
                    }
                    
                })
            })
        })
    }

    static create ({ input }, callback) {
        
        // obtener el genre según la película
        const {
            genre_id: genreInput,
            title,
            year,
            duration,
            director,
            poster,
            rate
        } = input

        const uuid = crypto.randomUUID()
        
        const GENRE_INDEX = [
        'Drama',
        'Action',
        'Crime',
        'Sci-Fi',
        'Romance',
        'Horror',
        'Adventure',
        'Biography',
        'Fantasy',
        'Thriller',
        ]

        // FALTA CONECTARLO CON LA TABLA GENRE
        genreInput.map(gen => {
            const genreIndex = GENRE_INDEX.findIndex(genIndex => genIndex === gen) + 1
            connection.query(`INSERT INTO movie_genres (movie_id, genre_id) VALUES (UUID_TO_BIN('${uuid}'), ?);`, genreIndex, function (error, results) {
                if (error) throw error
            })
        })
        
        // Utilizar SQL es una buena opción para obtener uuid
        //const {uuidResult} = connection.query('SELECT UUID() uuid;', function (error, results) {
            
        
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
        connection.query('DELETE FROM movie_genres WHERE BIN_TO_UUID(movie_id) = (?);', [id], function (error, results) {
            if (error) throw error
            
        })
        
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
            rate: input.rate,
            genre_id: input.genre_id
        }
        //Acá nunca va a llegar pq no se lo entrega el controller

        //elimina de la tabla genre todas las peliculas
        connection.query('DELETE FROM movie_genres WHERE BIN_TO_UUID(movie_id) = (?);', [id], function (error, results) {
            if (error) throw error
        })
        //vuelve a agregar los nuevos géneros
        const GENRE_INDEX = [
            'Drama',
            'Action',
            'Crime',
            'Sci-Fi',
            'Romance',
            'Horror',
            'Adventure',
            'Biography',
            'Fantasy',
            'Thriller',
        ]
        input.genre_id.map(gen => {
            const genreIndex = GENRE_INDEX.findIndex(genIndex => genIndex === gen) + 1
            connection.query(`INSERT INTO movie_genres (movie_id, genre_id) VALUES (UUID_TO_BIN(?), ?);`, [id, genreIndex], function (error, results) {
                if (error) throw error
            })
        })
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


