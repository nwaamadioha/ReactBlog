import { createContext, useState, useEffect } from "react";
import useAxiosFetch from '../hooks/useAxiosFetch'


const DataContext = createContext({})

export const DataProvider = ({ children }) => {
    const [posts, setPosts] = useState([])
    const [search, setSearch] = useState('')
    const [searchResults, setSearchResults] = useState([])
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

    return (
        <DataContext.Provider value={{
            posts, setPosts,
            search, setSearch, searchResults,
            fetchError, isLoading,
        }}>
            {children}
        </DataContext.Provider>
    )
}

export default DataContext