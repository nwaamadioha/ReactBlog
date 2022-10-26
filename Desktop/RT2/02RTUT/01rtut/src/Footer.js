import { useStoreState } from 'easy-peasy'

const Footer = () => {
  const postCount = useStoreState((state) => state.postCount)
  return (
    <footer className="Footer">
        <p>{postCount} Blog {postCount === 1 ? "Post" : "Posts"}</p>
    </footer>
  )
}

export default Footer