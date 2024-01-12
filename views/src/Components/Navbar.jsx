import { Link } from "react-router-dom"
import './navbar.css'
export function Navbar(){
    return(
        <nav>
            <h3>SuperPelis</h3>
            <ul>
                <li>
                    <Link className='links' to='/movies'>Inicio</Link>
                </li>
                <li>
                    <Link className='links' to='/movies/add'>Agregar peliculas</Link>
                </li>
            </ul>
        </nav>

    )
}