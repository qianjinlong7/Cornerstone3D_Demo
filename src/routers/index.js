import { Navigate } from 'react-router-dom'
import List from '../components/List'
import Demo from '../components/Demo'

const routers = [
  {
    path: '/list',
    element: <List />
  },
  {
    path: '/demo',
    element: <Demo />
  },
  {
    path: '/',
    element: <Navigate to='/list' />
  }
]

export default routers