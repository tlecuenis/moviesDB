import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import './one.css'

export function One(){
    const [dataOne, setDataOne] = useState([])
    const [loading, setLoading] = useState(true)
    const [modify, setModify] = useState(false)
    const [values, setValues] = useState({
        title: "",
        year: 0,
        director: "",
        duration: 0,
        poster: "",
        rate: 0,
        genre_id: []
    })
    const [defaultCheck, setDefaultCheck] = useState({
        "Horror": false,
        "Crime": false,
        "SciFi": false,
        "Adventure": false,
        "Action": false,
        "Drama": false
    })

    const {id} = useParams()
    
    useEffect(() =>{
        fetch(`http://localhost:10000/movies/${id}`)
          .then(res => res.json())
          .then(data => {
            console.log("data", data)
            if (data instanceof Array){
                setDataOne(data)
            } else{
                setDataOne([data])
            }
            // setDataOne(data)
            let check = defaultCheck
            const obtainedData = data[0] || data
            // data[0].genre_id.map(genre => {
            //     check[genre] = true
            // })
            obtainedData.genre_id.map(genre => {
                check[genre] = true
            })
            setDefaultCheck(check)
          })
          .catch(err => console.log(err))
          .finally(() => setLoading(false))
    }, [])
    

    const handleClick = () =>{
        if (dataOne[0].title == 'The Matrix' || dataOne[0].title == 'Gladiator'){
            alert('No se pueden modificar las siguientes peliculas: The Matrix y Gladiator')
        } else{

            setModify(!modify)
            setValues({
                title: dataOne[0].title || dataOne.title,
                year: dataOne[0].year || dataOne.year,
                director: dataOne[0].director || dataOne.director,
                duration: dataOne[0].duration || dataOne.duration,
                poster: dataOne[0].poster || dataOne.poster,
                rate: dataOne[0].rate || dataOne.rate,
                genre_id: dataOne[0].genre_id || dataOne.genre_id
            })
            console.log(defaultCheck)
        }
    }

    const handleChange = (e) =>{
        const {name, value} = e.target
        
        setValues(prevValues => ({
            ...prevValues,
            [name]: value
        }))
        // console.log(values)
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
        // console.log(values)
    }

    const handleSubmit = (e) =>{
        e.preventDefault()
        
        const newValues = {
            ...values,
            year: Number(values.year),
            duration: Number(values.duration),
            rate: Number(values.rate)
        }
        // console.log(newValues)
        setValues(newValues)
        fetch(`http://localhost:10000/movies/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(newValues),
            headers: { "Content-Type": "application/json" },
        })
            .then(() => {
                alert('Los parámetros se han actualizado, refresque para ver los cambios')
            })
            .catch(err => {
                console.log(err)
                alert('No se han podido guardar los cambios')
            })
            .finally(() => {
                setModify(false)
            })
    }

    return(
        <>
            {loading == true && <li>Loading...</li>}
            {console.log("dataOne afuera",dataOne)}
            {console.log("modify afuera",modify)}
            {(dataOne.length != 0 && modify == false) && (<article className='open'>
                {console.log("return adentro",dataOne)}
                <div className='open-container'>
                    <Link className="links arrow" to='/movies'> &larr; </Link>
                    <h3 className="title">{dataOne[0].title || dataOne.title}</h3>
                    <div className="columns-container">

                        <div className="img-container">
                            {console.log(dataOne[0].poster)}
                            <img src={dataOne[0].poster || dataOne.poster} alt={dataOne[0].title || dataOne.title} />
                        </div>
                        
                        <div className='flex'>
                            <p><span>Director:</span> {dataOne[0].director || dataOne.director}</p>
                            <p><span>Duration:</span> {dataOne[0].duration || dataOne.duration} min</p>
                            <p><span>Year:</span> {dataOne[0].year || dataOne.year}</p>
                            <p><span>Rate:</span> {dataOne[0].rate || dataOne.rate}</p>
                            <p><span>Genres:</span> {dataOne[0].genre_id.toString() || dataOne.genre_id.toString()}</p>
                            <button onClick={handleClick} className="modify-button">Modificar</button>
                        </div>
                        
                    </div>
                    
                </div>
            </article>)}

            {modify && (<article className='open'>
                <form onSubmit={handleSubmit}>
                    <div className='open-container'>
                        <div className="columns-container columns-container-modify">
                            <div className="img-container">    
                            <label htmlFor="poster">Imagen</label>
                            <input type="url" name="poster" placeholder="Coloque la imagen en jpg" onChange={handleChange} />    
                                <img src={dataOne[0].poster || dataOne.poster} alt={dataOne[0].title || dataOne.title} />
                            </div>
                            <div className='flex'>
                                <label htmlFor="title">Titulo</label>
                                <input type="text" name='title' placeholder={dataOne[0].title || dataOne.title} onChange={handleChange}/>
                                <label htmlFor="director">Director</label>
                                <input type="text" name="director" placeholder={dataOne[0].director || dataOne.director} onChange={handleChange} />
                                <label htmlFor="duration">Duración</label>
                                <input type="number" name="duration" placeholder={dataOne[0].duration || dataOne.duration} onChange={handleChange} />      
                                <label htmlFor="year">Año</label>
                                <input type="number" name="year" placeholder={dataOne[0].year || dataOne.year} onChange={handleChange} />           
                                <label htmlFor="rate">Nota</label>
                                <input type="number" name="rate" placeholder={dataOne[0].rate || dataOne.rate} step="0.1" onChange={handleChange} />
                                <fieldset id="genre" name="genre" onChange={handleChangeCheckbox} required>
                                    <legend>Género</legend>
                                    <label>
                                        <input type="checkbox" id="horror" name="genre" value="Horror" defaultChecked = {defaultCheck.Horror}/>
                                        Horror
                                    </label>
                                    <label>
                                        <input type="checkbox" id="crime" name="genre" value="Crime"  defaultChecked = {defaultCheck.Crime}/>
                                        Crimen
                                    </label>
                                    <label>
                                        <input type="checkbox" id="scifi" name="genre" value="SciFi"  defaultChecked = {defaultCheck.SciFi}/>
                                        Ciencia-Ficción
                                    </label>
                                    <label>
                                        <input type="checkbox" id="adventure" name="genre" value="Adventure"  defaultChecked = {defaultCheck.Adventure}/>
                                        Aventura
                                    </label>
                                    <label>
                                        <input type="checkbox" id="action" name="genre" value="Action"  defaultChecked = {defaultCheck.Action}/>
                                        Acción
                                    </label>
                                    <label>
                                        <input type="checkbox" id="drama" name="genre" value="Drama"  defaultChecked = {defaultCheck.Drama}/>
                                        Drama
                                    </label>
                                </fieldset>
                            </div>
                        </div>
                        <button type="submit" className="save-button">Guardar</button>
                    </div>
                </form>
            </article>)}

        </>
    )
    
}