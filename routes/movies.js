const { Router } = require('express')
const { MovieController } = require('../controllers/movies.js')


const createMovieRouter = ({ movieModel }) => {

	const router = Router()
	
	const movieController = new MovieController({ movieModel })
	
	// El router direcciona todas las rutas a su respectivo controlador
	router.get('/', movieController.getAll)
	
	router.get('/:id',movieController.getById)
	
	router.post('/', movieController.create)
	
	router.patch('/:id', movieController.update)
	
	router.delete('/:id', movieController.delete)

	return router
}
	
module.exports = {
	createMovieRouter
}