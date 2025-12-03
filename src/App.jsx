import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Main from './views/Main'
import Movie from './views/Movie'
import SelectSeats from './views/SelectSeats';
import Checkout from "./components/Payment/Checkout.jsx";
import SuccessPayment from "./components/Payment/SuccessPayment.jsx";
import PaymentPage from "./components/Payment/PaymentPage.jsx";

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
        path: '/payment',
        children: [
            {
                path: "/payment/checkout/:booking_id",
                element: < Checkout />
            },
            {
                path: "/payment/pay",
                element: <PaymentPage />
            },
            {
                path: "/payment/success",
                element: <SuccessPayment />
            }
        ]
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
