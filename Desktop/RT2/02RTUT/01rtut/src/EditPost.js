import { useEffect } from 'react'
import { useParams, Link, useNavigate } from "react-router-dom"
import { format } from 'date-fns'

import { useStoreActions, useStoreState} from 'easy-peasy'

const EditPost = () => {
  const navigate = useNavigate()
  const editTitle = useStoreState((state) => state.editTitle)
  const editPost = useStoreActions((actions) => actions.editPost)
  const setEditTitle = useStoreActions((actions) => actions.setEditTitle)
  const editBody = useStoreState((state) => state.editBody)
  const setEditBody = useStoreActions((actions) => actions.setEditBody)
  const getPostById = useStoreState((state) => state.getPostById)
  // Get the post id from the parameter
  const { id } = useParams()
  // Search through posts to get the post with the selected id
  const post = getPostById(id)

  useEffect(() => {
    if (post) {
      setEditTitle(post.title)
      setEditBody(post.body)
    }
  }, [post, setEditTitle, setEditBody])

  const handleEdit = async (id) => {
    const datetime = format(new Date(), 'MMMM dd, yyyy pp')
    const updatedPost = { id, title: editTitle, datetime, body: editBody }
    editPost(updatedPost)
    navigate("/")

  }
  return (
    <main className="NewPost">
      {editTitle &&
        <>
          <h2>Edit Post</h2>
          <form className="newPostForm" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="postTitle">Title</label>
            <input
              id="editTitle"
              type="text"
              required
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <label htmlFor="editBody">Post</label>
            <textarea
              id="editBody"
              required
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
            />
            <button type="submit" onClick={() => handleEdit(post.id)}>Submit</button>
          </form>
        </>
      }
      {!editTitle &&
        <>
          <h2>Post Not Found</h2>
          <p>Well, that's disappointing.</p>
          <p>
            <Link to='/'>Visit Our Homepage</Link>
          </p>
        </>
      }
    </main>
  )
}

export default EditPost