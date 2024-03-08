import { useEffect } from "react"

const createMovie = () => {
    useEffect(() =>{
        fetch('http://localhost:10000/movies')
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.log(err))
    }, [])
    return(
        <div>
            <p>{data}</p>
        </div>
    )
}