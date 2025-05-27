import { createBrowserRouter, Link, RouterProvider } from 'react-router-dom'
import './App.css'
import { FmPage } from './pages/fm/FmPage'
import { Outlet } from 'react-router-dom'
import { Home } from './pages/home/Home'
import { Sequencer } from './pages/sequencer/Sequencer'
const Layout = () => {
return <>
  <ul className="appbar">
    <li><Link to={'/'}>Home</Link></li>
    <li><Link to={'/samples/fm'}>Fm</Link></li>
    <li><Link to={'/samples/sequencer'}>Sequencer</Link></li>
  </ul>
  <div className='container'>
    <Outlet />
  </div>
  </>
}

function App() {
  const router = createBrowserRouter([{
    path: '/',
    element: <Layout />,
    children: [
    {
      path: '/',
      element: <Home />
    },
    {
      path: 'samples',
      children: [
      {
        path: 'fm',
        element: <FmPage />
      },
      {
        path:'sequencer',
        element: <Sequencer />
      }
    ]
    }]
  }])

  return (
    <RouterProvider router={router} />
  )
}

export default App
