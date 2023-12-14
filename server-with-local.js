const { createApp } = require('./app')

const { MovieModel } = require('./models/local-file-system/movie')

createApp({ movieModel: MovieModel })