import { createContext, useState, useEffect } from "react";
import api from "../Api/posts"
import { format } from 'date-fns'
import useWindowSize from '../hooks/useWindowSize'
import useAxiosFetch from '../hooks/useAxiosFetch'
import { useNavigate } from "react-router-dom"

const DataContext = createContext({})

export const DataProvider = ({ children }) => {
    const [posts, setPosts] = useState([])
    const [search, setSearch] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [postTitle, setPostTitle] = useState('')
    const [postBody, setPostBody] = useState('')
    const [editTitle, setEditTitle] = useState('')
    const [editBody, setEditBody] = useState('')
    const navigate = useNavigate()
    const { width } = useWindowSize()
    const { data, fetchError, isLoading } = useAxiosFetch('http://localhost:3500/posts')

    //Fetch posts at load time using custom hook useAxiosFetch
    useEffect(() => {
        setPosts(data)
    }, [data])

    //Searching through the posts
    useEffect(() => {
        const filteredResults = posts.filter(post =>
            ((post.body).toLowerCase()).includes(search.toLowerCase())
            || ((post.title).toLowerCase()).includes(search.toLowerCase()))

        setSearchResults(filteredResults.reverse())
    }, [posts, search])

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

    const handleEdit = async (id) => {
        const datetime = format(new Date(), 'MMMM dd, yyyy pp')
        const updatedPost = { id, title: editTitle, datetime, body: editBody }
        try {
            const response = await api.put(`/posts/${id}`, updatedPost)
            setPosts(posts.map(post => post.id === id ? { ...response.data } : post))
            setEditTitle('')
            setEditBody('')
            navigate("/")
        } catch (err) {
            console.log(`Error: ${err.message}`)
        }
    }

    const handleDelete = async (id) => {
        try {
            await api.delete(`/posts/${id}`)
            const postList = posts.filter(post => post.id !== id)
            setPosts(postList)
            navigate("/")
        } catch (err) {
            console.log(`Error: ${err.message}`)
        }
    }
    return (
        <DataContext.Provider value={{
            width, search, setSearch, 
            searchResults, fetchError, isLoading,
            handleSubmit, postTitle, setPostTitle, postBody, setPostBody,
            posts, handleEdit, editBody, setEditBody, editTitle, setEditTitle,
            handleDelete
        }}>
            {children}
        </DataContext.Provider>
    )
}

export default DataContext