import React from 'react'
import { useRoutes } from 'react-router-dom'
import routers from './routers'

export default function App() {
  const elements = useRoutes(routers)

  return (
    <div>
      {elements}
    </div>
  )
}
