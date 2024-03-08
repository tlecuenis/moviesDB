import { useState, useEffect } from "react"

export function AddMovie(){
    const [values, setValues] = useState({
        title: "",
        year: 0,
        director: "",
        duration: 0,
        poster: "",
        rate: "",
        genre_id: []
    })

    const [data, setData] = useState([])
    // const [titles, setTitles] = useState([])
    useEffect(() =>{
      fetch('http://localhost:10000/movies')
        .then(res => res.json())
        .then(data => setData(data))
        .catch(err => console.log(err))
    }, [])
    console.log(data)
    const movieTitle = []
    data.map(movie =>{
        movieTitle.push(movie.title)
    })

    const handleChange = (e) =>{
        const {name, value} = e.target
        
        setValues(prevValues => ({
            ...prevValues,
            [name]: value
        }))
        console.log(values)
    }

    const handleChangeCheckbox = (e) => {
        const {value} = e.target
        if (e.target.checked) {
            setValues(prevValues => ({
                ...prevValues,
                genre_id: [...values.genre_id, value]
            }))
        } else {
            const newValue = values.genre_id.filter(item => item !== value)
            setValues(prevValues => ({
                ...prevValues,
                genre_id: newValue
            }))
        }
        console.log(values)
    }

    const handleSubmit = (e) =>{
        e.preventDefault()
        const newValues = {
            ...values,
            year: Number(values.year),
            duration: Number(values.duration),
            rate: Number(values.rate),
        }
        setValues(newValues)
        //logica titulo
        if (!movieTitle.includes(newValues.title)){
            fetch('http://localhost:10000/movies', {
                method: 'POST',
                body: JSON.stringify(newValues),
                headers: { "Content-Type": "application/json" },
            })
                .then(() => {
                    alert('La película se ha guardado con éxito!')
                })
                .catch(err => {
                    console.log(err)
                    alert('No se ha podido guardad la pelicula, intente nuevamente')
                })
        } else{
            alert('Ya existe una pelicula con ese nombre')
        }

        
        
    }
    return(
        <>
        <form onSubmit={handleSubmit}>
            <label htmlFor="title">Titulo</label>
            <input type="text" name='title' placeholder="Escriba el título" onChange={handleChange} required/>
            <label htmlFor="year">Año</label>
            <input type="number" name="year" placeholder="Escriba el año" onChange={handleChange} required />
            <label htmlFor="director">Director</label>
            <input type="text" name="director" placeholder="Escriba el director" onChange={handleChange} required />
            <label htmlFor="duration">Duración</label>
            <input type="number" name="duration" placeholder="Escriba la duración" onChange={handleChange} required />
            <label htmlFor="poster">Imagen</label>
            <input type="url" name="poster" placeholder="Coloque la imagen" onChange={handleChange} required />
            <label htmlFor="genre">Género</label>
            <fieldset id="genre" name="genre" onChange={handleChangeCheckbox} required>
                <legend>Género</legend>
                <label>
                    <input type="checkbox" id="horror" name="genre" value="Horror" />
                    Horror
                </label>
                <label>
                    <input type="checkbox" id="crime" name="genre" value="Crime" />
                    Crimen
                </label>
                <label>
                    <input type="checkbox" id="scifi" name="genre" value="SciFi" />
                    Ciencia-Ficción
                </label>
                <label>
                    <input type="checkbox" id="adventure" name="genre" value="Adventure" />
                    Aventura
                </label>
                <label>
                    <input type="checkbox" id="action" name="genre" value="Action" />
                    Acción
                </label>
                <label>
                    <input type="checkbox" id="drama" name="genre" value="Drama" />
                    Drama
                </label>
            </fieldset>
            <label htmlFor="rate">Nota</label>
            <input type="number" name="rate" placeholder="Escriba la nota" step="0.1" onChange={handleChange} required />
            <button type="submit">Save</button>
        </form>
        </>
    )
}

