import { useState } from 'react'
import './movie.css'
import { Link, useParams } from 'react-router-dom'

export function Movie ({ id, poster, title, director, duration, year, rate }) {
    const handleClick = () =>{
        fetch(`http://localhost:3000/movies/${id}`, {
            method: 'DELETE',
        })
            .then(() => console.log('actualizado'))
            .catch(err => console.log(err))
            .finally(() => alert(`La película ${title} ha sido eliminada, refresca para ver los cambios`))
    }
    return (
        <>
            <article>
                <div className="img-container">
                    <img src={poster} alt={title} />
                </div>
                <h3 className="title">{title}</h3>
                <Link to={`/movies/${id}`}>+ Info</Link>
                <button onClick={handleClick}>Del</button>
            </article>
            
        </>
    )
}