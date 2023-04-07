import { Navigate } from 'react-router-dom'

const routers = [
  {
    path: '/list',
    // element: < />
  },
  {
    path: '/',
    element: <Navigate to='/list' />
  }
]

export default routers