import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Main from './views/Main'
import MoviePage from './views/MoviePage';
import SelectSeats from './views/SelectSeats';
import MovieDetailsPage from './views/MovieDetailsPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />
  },
  {
    path: "/movie",
    element: <MoviePage/>
  },
   {
    path: "/seat-map/:auditoriumId", 
    element: <SelectSeats />
  },
  {
    path: "/movie/:movieId",
    element:  <MovieDetailsPage />
  }

]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
