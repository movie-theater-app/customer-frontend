import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Main from './views/Main'
import Movie from './views/Movie'
import SelectSeats from './views/SelectSeats';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />
  },
  {
    path: "/movie/:movieId",
    element: <Movie />
  }
  {
    path: "/seat-map/:auditoriumId", 
    element: <SelectSeats />
  },
 

]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
