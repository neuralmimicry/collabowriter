import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Post from './Post'
import Posts from './Posts'

function Main() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Posts />} />
          <Route path="/post/:id/:title?" element={<Post />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default Main
