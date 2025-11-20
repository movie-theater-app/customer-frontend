import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Main from './views/Main'
import Movie from './views/Movie'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />
  },
  {
    path: "/movie/:movieId",
    element: <Movie />
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
