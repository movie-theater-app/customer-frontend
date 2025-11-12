import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Main from './views/Main'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />
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
