import './genre.css'

export function Genre ({ genre_id, id }) {
    return (
        <>
            {genre_id.map(genre => (
                <div key={id + genre} className="genre"> <p>{genre}</p> </div>
            ))}
        </>
    )
}