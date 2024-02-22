import { useState } from 'react'
import './movie.css'
import { Link, useParams } from 'react-router-dom'
import { Genre } from './Genre.jsx'

//LÓGICA DE FRONT
// ✅ Avisar cuando se crea una pelicula de forma satisfactoria 
// ✅ Avisar cuando no se pudo crear (catch del fetch)
// ✅ Avisar cuando se modifico de forma satisfactoria
// ✅ Avisar cuando no se pudo modificar (catch del fetch)
// ✅ Que eliminar sea más dificil o preguntar si se desea eliminar
// ✅ No dejar crear una pelicula con el mismo nombre y la misma duración
//   que ya exista (se pueden guardar en un array los nombres y luego filtrar
//   o hacerlo con una query de SQL)
// DISEÑO DE FRONT
// ✅ Modificar Nav
// ✅ Modificar diseño de peliculas individuales
// ✅ Separar los campos label del input del form
// ✅ Hacer un breakpoint de > 647 para hacer una sola columna del form
// LÓGICA DE BACK
// ✅ Sincronizar la tabla peliculas con la tabla genre getAll sin genre
// ✅ Sincronizar la tabla peliculas con la tabla genre getAll con genre
// ✅ Sincronizar la tabla peliculas con la tabla genre create
// ✅ Sincronizar la tabla peliculas con la tabla genre update
// ✅ Sincronizar la tabla peliculas con la tabla genre delete
// ✅ Cambiar nombre de sci-fi en todos lados pq trae error (o poner scifi y antes de enviar en el fetch cambiarlo a sci-fi) 
// ❌ Obtener los generos en vez de poner la constante GENRE_INDEX
// ✅ No dejar que se eliminen the matrix y gladiator
// ❌ Subir a hosting gratuito mysql
// ✅ hacer cambios para que funcione en local


export function Movie ({ id, poster, title, director, duration, year, rate, genre_id }) {
    const handleClick = () =>{
        if (title == 'The Matrix' || title == 'Gladiator'){
            alert('No se pueden eliminar los siguientes títulos: The Matrix y Gladiator')
        } else{
            var result = confirm("Está seguro que desea eliminar la pelicula?")
            if (result){
                fetch(`http://localhost:3000/movies/${id}`, {
                    method: 'DELETE',
                })
                    .then(() => console.log('actualizado'))
                    .catch(err => {
                        alert(`Ha ocurrido un error, no se ha podido eliminar`)
                        console.log(err)
                    })
                    .finally(() => alert(`La película ${title} ha sido eliminada, refresca para ver los cambios`))
            }
        }
    }
    return (
        <>
            <article>
                <h3 className="title">{title}</h3>
                <div className="img-container">
                    <img src={poster} alt={title} />
                    <div className='genre-container'>
                        <Genre genre_id={genre_id} id={id}/>
                    </div>
                </div>
                
                
                <div className='button-container'>
                    <button className='button-del' onClick={handleClick}>Del</button>
                    <Link className='links' to={`/movies/${id}`}>
                        <button className='button-info'>+ Info</button>
                    </Link>
                </div>

            </article>
            
        </>
    )
}