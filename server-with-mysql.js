const { createApp } = require('./app')

const { MovieModel } = require('./models/database/movie')

createApp({ movieModel: MovieModel })