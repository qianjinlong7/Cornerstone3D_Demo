import React, { Fragment } from 'react'
import { useRoutes } from 'react-router-dom'
import routers from './routers'

export default function App() {
  const elements = useRoutes(routers)

  return (
    <Fragment>
      {elements}
    </Fragment>
  )
}
