import {Movie} from '../Components/Movie.jsx'
import { useState, useEffect } from 'react'
import './home.css'

export function Home(){
    // const [data, setData] = useState([{
    //     "id": "dcdd0fad-a94c-4810-8acc-5f108d3b18c3",
    //     "title": "The Shawshank Redemption",
    //     "year": 1994,
    //     "director": "Frank Darabont",
    //     "duration": 142,
    //     "poster": "https://i.ebayimg.com/images/g/4goAAOSwMyBe7hnQ/s-l1200.webp",
    //     "genre": ["Drama"],
    //     "rate": 9.3
    //   },
    //   {
    //     "id": "c8a7d63f-3b04-44d3-9d95-8782fd7dcfaf",
    //     "title": "The Dark Knight",
    //     "year": 2008,
    //     "director": "Christopher Nolan",
    //     "duration": 152,
    //     "poster": "https://i.ebayimg.com/images/g/yokAAOSw8w1YARbm/s-l1200.jpg",
    //     "genre": ["Action", "Crime", "Drama"],
    //     "rate": 9.0
    //   },
    //   {
    //     "id": "5ad1a235-0d9c-410a-b32b-220d91689a08",
    //     "title": "Inception",
    //     "year": 2010,
    //     "director": "Christopher Nolan",
    //     "duration": 148,
    //     "poster": "https://m.media-amazon.com/images/I/91Rc8cAmnAL._AC_UF1000,1000_QL80_.jpg",
    //     "genre": ["Action", "Adventure", "Sci-Fi"],
    //     "rate": 8.8
    //   },
    //   {
    //     "id": "dcdd0fad-a94c-4810-8acc-5f108d3b18c3",
    //     "title": "The Shawshank Redemption",
    //     "year": 1994,
    //     "director": "Frank Darabont",
    //     "duration": 142,
    //     "poster": "https://i.ebayimg.com/images/g/4goAAOSwMyBe7hnQ/s-l1200.webp",
    //     "genre": ["Drama"],
    //     "rate": 9.3
    //   },
    //   {
    //     "id": "c8a7d63f-3b04-44d3-9d95-8782fd7dcfaf",
    //     "title": "The Dark Knight",
    //     "year": 2008,
    //     "director": "Christopher Nolan",
    //     "duration": 152,
    //     "poster": "https://i.ebayimg.com/images/g/yokAAOSw8w1YARbm/s-l1200.jpg",
    //     "genre": ["Action", "Crime", "Drama"],
    //     "rate": 9.0
    //   },
    //   {
    //     "id": "5ad1a235-0d9c-410a-b32b-220d91689a08",
    //     "title": "Inception",
    //     "year": 2010,
    //     "director": "Christopher Nolan",
    //     "duration": 148,
    //     "poster": "https://m.media-amazon.com/images/I/91Rc8cAmnAL._AC_UF1000,1000_QL80_.jpg",
    //     "genre": ["Action", "Adventure", "Sci-Fi"],
    //     "rate": 8.8
    //   }
    // ])
    const [data, setData] = useState([])
    useEffect(() =>{
      fetch('http://localhost:10000/movies')
        .then(res => res.json())
        .then(data => setData(data))
        .catch(err => console.log(err))
    }, [])
    return(
        <main className='main'>
            <h1>Películas 🎬</h1>

            <section className='movies'>
            {
                data.map(movie => (
                <Movie key={movie.id} 
                    id={movie.id}
                    poster={movie.poster} 
                    title={movie.title} 
                    director={movie.director} 
                    duration={movie.duration} 
                    year={movie.year} 
                    rate={movie.rate} 
                    genre_id={movie.genre_id}/>
                ))
            }
            </section>
        </main>
    )

}
