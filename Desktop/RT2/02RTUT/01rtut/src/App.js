import Header from './Header'
import Nav from "./Nav"
import Footer from "./Footer"

import Home from "./Home"
import NewPost from "./NewPost"
import PostPage from "./PostPage"
import About from "./About"
import Missing from "./Missing"

import api from "./Api/posts"
import { format } from 'date-fns'

import { Routes, Route, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

function App() {
  const [posts, setPosts] = useState([])
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [postTitle, setPostTitle] = useState('')
  const [postBody, setPostBody] = useState('')
  const navigate = useNavigate()

  //Fetch posts at load time
  useEffect (() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts')
        setPosts(response.data)
      } catch (err) { // Copied from the axios documentary
        if (err.response) {
          // Not in the 200 response range
          console.log(err.response.data)
          console.log(err.response.status)
          console.log(err.response.headers)
      } else {
        console.log(`Error: ${err.message}`)
      }
     }
    }
    fetchPosts()
  }, [])

  //Searching through the posts
  useEffect (() => {

    const filteredResults = posts.filter(post => 
      ((post.body).toLowerCase()).includes(search.toLowerCase())
      || ((post.title).toLowerCase()).includes(search.toLowerCase()))

      setSearchResults(filteredResults.reverse())
  },[posts, search] )

  const handleSubmit = async (e) => {
    e.preventDefault()
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1
    const datetime = format(new Date(), 'MMMM dd, yyyy pp')
    const newPost = {id: id, title: postTitle, datetime: datetime, body: postBody}
    
    try {
      // Send new post to the database
      const response = await api.post('/posts', newPost)
      // Send new post to the frontend
      const allPosts = [...posts, response.data]
      setPosts(allPosts)
      setPostTitle('')
      setPostBody('')
      navigate("/")
    } catch (err) {

      console.log(`Error: ${err.message}`)
    }
  }

  const handleDelete = async (id) => {
    const postList = posts.filter(post => post.id !== id)
    try {
      await api.delete(`/posts/${id}`)
      setPosts(postList)
      navigate("/")
    } catch (err) {
      console.log(`Error: ${err.message}`)
    }

  }
  return (
    <div className="App">
      <Header title="React JS Blog" />
      <Nav search={search} setSearch={setSearch} />
      <Routes>
        <Route path="/" element={<Home posts={searchResults} />} exact />
        <Route path="/post" element={
          <NewPost 
            handleSubmit={handleSubmit} 
            postTitle={postTitle} 
            setPostTitle={setPostTitle}
            postBody={postBody}
            setPostBody={setPostBody}
          />} exact 
        />
        <Route path="/post/:id" element={<PostPage posts={posts} handleDelete={handleDelete} />} exact />
        <Route path="/about" element={<About />} exact />
        <Route path="/*" element={<Missing />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
