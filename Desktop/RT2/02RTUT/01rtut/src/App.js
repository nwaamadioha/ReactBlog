import Header from './Header'
import Nav from "./Nav"
import Footer from "./Footer"

import Home from "./Home"
import NewPost from "./NewPost"
import PostPage from "./PostPage"
import About from "./About"
import Missing from "./Missing"
import EditPost from './EditPost'

import { Routes, Route } from "react-router-dom"
import { useEffect } from "react";
import useAxiosFetch from './hooks/useAxiosFetch'
import {useStoreActions} from 'easy-peasy'

function App() {
  const setPosts = useStoreActions((actions) => actions.setPosts)
  const { data, fetchError, isLoading } = useAxiosFetch('http://localhost:3500/posts')

  useEffect(() => {
      setPosts(data)
  }, [data, setPosts])

  return (
    <div className="App">
      <Header title="React JS Blog"/>
      <Nav />
      <Routes>
        <Route path="/" element={<Home isLoading={isLoading} fetchError={fetchError}/>} exact />
        <Route path="/post" element={<NewPost />} exact />
        <Route path="/edit/:id" element={<EditPost />} />
        <Route path="/post/:id" element={<PostPage />} exact />
        <Route path="/about" element={<About />} exact />
        <Route path="/*" element={<Missing />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
