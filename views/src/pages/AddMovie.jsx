import { useState } from "react"

export function AddMovie(){
    const [values, setValues] = useState({
        title: "",
        year: 0,
        director: "",
        duration: 0,
        poster: "",
        rate: "",
        genre: []
    })

    const handleChange = (e) =>{
        const {name, value} = e.target
        
        setValues(prevValues => ({
            ...prevValues,
            [name]: value
        }))
        console.log(values)
    }


    const handleSubmit = (e) =>{
        e.preventDefault()
        const newValues = {
            ...values,
            year: Number(values.year),
            duration: Number(values.duration),
            rate: Number(values.rate),
            //convertimos en string y desps en array por si se cambia el género y se quiere crear otra película
            genre: [values.genre.toString()]
        }
        setValues(newValues)

        fetch('http://localhost:3000/movies', {
            method: 'POST',
            body: JSON.stringify(newValues),
            headers: { "Content-Type": "application/json" },
        })
            .then(() => console.log('actualizado'))
            .catch(err => console.log(err))
        
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
            <select id="genre" name="genre" onChange={handleChange} required>
                <option value="Horror">Horror</option>
                <option value="Crime">Crime</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Adventure">Adventure</option>
                <option value="Action">Action</option>
                <option value="Drama">Drama</option>
            </select>
            <label htmlFor="rate">Nota</label>
            <input type="number" name="rate" placeholder="Escriba la nota" step="0.1" onChange={handleChange} required />
            <button type="submit">Save</button>
        </form>
        </>
    )
}

