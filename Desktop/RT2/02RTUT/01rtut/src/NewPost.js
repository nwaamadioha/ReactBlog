import { useState, useContext } from 'react'
import DataContext from "./context/DataContext"
import { useNavigate } from "react-router-dom"
import api from "./Api/posts"
import { format } from 'date-fns'

const NewPost = () => {
  const [postTitle, setPostTitle] = useState('')
  const [postBody, setPostBody] = useState('')
  const { posts, setPosts } = useContext(DataContext)
  const navigate = useNavigate()
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1
    const datetime = format(new Date(), 'MMMM dd, yyyy pp')
    const newPost = { id: id, title: postTitle, datetime: datetime, body: postBody }
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
  return (
    <main className="NewPost">
      <h2>New Post</h2>
      <form className="newPostForm" onSubmit={handleSubmit}>
        <label htmlFor="postTitle">Title</label>
        <input
          id="postTitle"
          type="text"
          required
          value={postTitle}
          onChange={(e) => setPostTitle(e.target.value)}
        />
        <label htmlFor="postBody">Post</label>
        <textarea
          id="postBody"
          required
          value={postBody}
          onChange={(e) => setPostBody(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </main>
  )
}

export default NewPost