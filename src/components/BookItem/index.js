import {Link} from 'react-router-dom'
import {BsFillStarFill} from 'react-icons/bs'
import './index.css'

const BookItem = props => {
  const {eachBookItem} = props
  const {authorName, coverPic, id, rating, readStatus, title} = eachBookItem

  return (
    <li className="books-item-details-container">
      <Link to={`/books/${id}`} className="link-item">
        <img src={coverPic} alt={title} className="cover-pic-style" />
      </Link>
      <div className="book-details-container">
        <h1 className="title-description" key={title}>
          {title}
        </h1>
        <p className="author-name-style">{authorName}</p>
        <div className="avg-rating-container">
          <p className="avg-rating-style">Avg Rating</p>
          <BsFillStarFill className="fill-star-style" />
          <p>{rating}</p>
        </div>
        <p className="read-status">
          Status: <span className="read-status-style">{readStatus}</span>
        </p>
      </div>
    </li>
  )
}

export default BookItem
