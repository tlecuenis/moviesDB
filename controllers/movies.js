const { validateMovie, validatePartialMovie } = require('../schemas/movies.js')

class MovieController {
    constructor ({ movieModel }) {
        this.movieModel = movieModel
    }
    getAll = (req, res) => {
        const { genre } = req.query
        const movies = this.movieModel.getAll({ genre }, callback => res.json(callback))
        //res.json(movies)
    }
    
    getById = (req, res) => {
        const { id } = req.params
        const movie = this.movieModel.getById({ id }, callback => {
            if (callback.length === 0) return res.status(404).json({ message: 'Movie not found' })
            res.json(callback)
        })
    }

    create = (req, res) => {
        const result = validateMovie(req.body)
        console.log("result", result)
        console.log("req body", req.body)

        if(result.error) return res.status(400).json({ error: JSON.parse(result.error.message) })

        const newMovie = this.movieModel.create({ input: result.data }, callback => res.status(201).json(callback))
    }

    update = (req, res) => {
        const { id } = req.params 
        //Acá llegan bien el genre_id
        const result = validatePartialMovie(req.body)
        console.log(result)
        // Luego del validatePartialMovie se saca el genre_id
        if(result.error) return res.status(400).json({ error: JSON.parse(result.error.message) })
        const updatedMovie = this.movieModel.update({ id, input: result.data }, callback => res.json(callback))
    }

    delete = (req, res) => {
        const { id } = req.params
        const result = this.movieModel.delete({ id }, callback => res.json({ message: 'Movie deleted' }))

        if (result === false){
            res.status(404).json({ message: 'Movie not found' })
        } 
    }
    
}    

module.exports = {
    MovieController
}