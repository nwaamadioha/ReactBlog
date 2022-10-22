import Header from './Header'
import Nav from "./Nav"
import Footer from "./Footer"

import Home from "./Home"
import NewPost from "./NewPost"
import PostPage from "./PostPage"
import About from "./About"
import Missing from "./Missing"

import { format } from 'date-fns'
import data from "./Data"
import { Routes, Route, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

function App() {
  const [posts, setPosts] = useState(data)
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [postTitle, setPostTitle] = useState('')
  const [postBody, setPostBody] = useState('')
  const navigate = useNavigate()

  useEffect (() => {

    //Searching through the posts
    const filteredResults = posts.filter(post => 
      ((post.body).toLowerCase()).includes(search.toLowerCase())
      || ((post.title).toLowerCase()).includes(search.toLowerCase()))

      setSearchResults(filteredResults.reverse())
  },[posts, search] )

  const handleSubmit = (e) => {
    e.preventDefault()
   console.log(posts)
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1
    const datetime = format(new Date(), 'MMMM dd, yyyy pp')
    const newPost = {id: id, title: postTitle, datetime: datetime, body: postBody}
    const allPosts = [...posts, newPost]
    setPosts(allPosts)
    console.log(allPosts)
    setPostTitle('')
    setPostBody('')
    navigate("/")
  }

  const handleDelete = (id) => {
    const postList = posts.filter(post => post.id !== id)
    setPosts(postList)
    navigate("/")
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
