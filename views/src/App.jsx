import { useState } from 'react'
// import {data} from './data/movies.json'
import {Movie} from './Components/Movie.jsx'
import './App.css'
import {Route, Routes} from 'react-router-dom'
import {Home} from './pages/Home.jsx'
import { Navbar } from './Components/Navbar.jsx'
import { AddMovie } from './pages/AddMovie.jsx'
import { One } from './pages/One.jsx'

export function App() {
  
  return (
    <>
      <Navbar/>
      <Routes>
        <Route
          path='/movies'
          element={<Home/>}
          />

          <Route
          path='/movies/:id'
          element={<One/>}
          />

          <Route
          path='/movies?genre=:genero'
          element={<AddMovie/>}
          />

          <Route
          path='/movies/add'
          element={<AddMovie/>}
          />

      </Routes>
    </>
    
  )
}

