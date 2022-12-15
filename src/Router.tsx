import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Post from './Post'
import Posts from './Posts'

function Main() {
  return (
        <Routes>
          <Route path='/' element={<Posts />} />
          <Route path="/post/:id/:title?" element={<Post />} />
        </Routes>
  )
}

export default Main
