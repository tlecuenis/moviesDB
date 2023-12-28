import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"

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
        genre: []
    })

    const {id} = useParams()
    
    useEffect(() =>{
        fetch(`http://localhost:3000/movies/${id}`)
          .then(res => res.json())
          .then(data => setDataOne(data))
          .catch(err => console.log(err))
          .finally(() => setLoading(false))
    }, [])
    
    
    const handleClick = () =>{
        setModify(!modify)
        setValues({
            title: dataOne[0].title,
            year: dataOne[0].year,
            director: dataOne[0].director,
            duration: dataOne[0].duration,
            poster: dataOne[0].poster,
            rate: dataOne[0].rate
        })
    }
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
            rate: Number(values.rate)
        }
        console.log(newValues)
        setValues(newValues)
        fetch(`http://localhost:3000/movies/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(newValues),
            headers: { "Content-Type": "application/json" },
        })
            .then(() => console.log('actualizado'))
            .catch(err => console.log(err))
            .finally(() => {
                setModify(false)
                alert('Refresque para ver los nuevos cambios')
            })
    }

    return(
        <>
            {loading == true && <li>Loading...</li>}
            {(dataOne.length > 0 && modify == false) && (<article className='open'>
                <div className='open-container'>
                    <Link to='/movies'> X </Link>
                    <div className="img-container">
                        {console.log(dataOne[0].poster)}
                        <img src={dataOne[0].poster} alt={dataOne[0].title} />
                    </div>
                    <h3 className="title">{dataOne[0].title}</h3>
                    <div className='flex'>
                        <p>Director: {dataOne[0].director}</p>
                        <p>Duration: {dataOne[0].duration} min</p>
                        <p>Year: {dataOne[0].year}</p>
                        <p>Rate: {dataOne[0].rate}</p>
                    </div>
                    
                </div>
                <button onClick={handleClick}>Modificar</button>
            </article>)}

            {modify && (<article className='open'>
                <form onSubmit={handleSubmit}>
                    <div className='open-container'>
                        <label htmlFor="poster">Imagen</label>
                        <input type="url" name="poster" placeholder="Coloque la imagen" onChange={handleChange} />
                        <div className="img-container">        
                            <img src={dataOne[0].poster} alt={dataOne[0].title} />
                        </div>
                        <label htmlFor="title">Titulo</label>
                        <input type="text" name='title' placeholder={dataOne[0].title} onChange={handleChange}/>
                        <div className='flex'>
                            <label htmlFor="director">Director</label>
                            <input type="text" name="director" placeholder={dataOne[0].director} onChange={handleChange} />
                            <label htmlFor="duration">Duración</label>
                            <input type="number" name="duration" placeholder={dataOne[0].duration} onChange={handleChange} />      
                            <label htmlFor="year">Año</label>
                            <input type="number" name="year" placeholder={dataOne[0].year} onChange={handleChange} />           
                            <label htmlFor="rate">Nota</label>
                            <input type="number" name="rate" placeholder={dataOne[0].rate} step="0.1" onChange={handleChange} />
                        </div>
                    </div>
                    <button type="submit">Guardar</button>
                </form>
            </article>)}

        </>
    )
    
}