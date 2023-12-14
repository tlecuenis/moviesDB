const express = require('express')
const { createMovieRouter } = require('./routes/movies')
require('dotenv/config')

const createApp = ({ movieModel }) => {

    const app = express()
    
    app.use(express.json())

    app.disable('x-powered-by') // por seguridad ocultamos que utilizamos express del header
    
    app.use('/movies', createMovieRouter({ movieModel }))

    const PORT = process.env.PORT ?? 3000

    app.listen(PORT, () => {
        console.log(`server listening on port http://localhost:${PORT}`)
    })
}

module.exports ={
    createApp
}

