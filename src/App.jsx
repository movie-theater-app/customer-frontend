import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Main from './views/Main'
import Movie from './views/Movie'
import SelectSeats from './views/SelectSeats';
import Checkout from './views/Checkout';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />
  },
  {
    path: "/movie/:movieId",
    element: <Movie />
  },
  {
    path: "/seat-map/:scheduleId", 
    element: <SelectSeats />
  },
  {
    path: "/checkout/:bookingId",  // route to placeholder Checkout-page
    element: <Checkout />
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
