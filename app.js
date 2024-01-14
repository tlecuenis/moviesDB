const express = require('express')
const { createMovieRouter } = require('./routes/movies')
const cors = require('cors')
require('dotenv/config')

const createApp = ({ movieModel }) => {

    const app = express()
    
    app.use(cors())
    app.use(express.json())

    app.disable('x-powered-by') // por seguridad ocultamos que utilizamos express del header
    // res.header('Acces-Control-Allow-Origin', '*')
    app.use('/movies', createMovieRouter({ movieModel }))

    console.log("este es el port",process.env.PORT)
    console.log("este es el port",process.env.DB_HOST)
    const PORT = process.env.PORT ?? 3000

    app.listen(PORT, () => {
        console.log(`server listening on port http://localhost:${PORT}`)
    })
}

module.exports ={
    createApp
}

