import { Link } from 'react-router-dom'

const Missing = () => {
  return (
    <main className='Missing'>
        <h2>Page Not Found</h2>
        <h2>Well, that's disappointing.</h2>
        <h2>
          <Link to='/'>Visit Our Homepage</Link>
        </h2>
    </main>  
  )
}

export default Missing