import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsFillStarFill} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class BookItemDetailsPage extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    bookDetails: [],
  }

  componentDidMount() {
    this.getBookData()
  }

  onClickReTry = () => {
    this.getBookData()
  }

  getBookData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {bookId} = params
    const bookUrl = ` https://apis.ccbp.in/book-hub/books/${bookId}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(bookUrl, options)
    if (response.ok) {
      const data = await response.json()
      const upDatedData = {
        id: data.book_details.id,
        title: data.book_details.title,
        rating: data.book_details.rating,
        aboutAuthor: data.book_details.about_author,
        aboutBook: data.book_details.about_book,
        authorName: data.book_details.author_name,
        coverPic: data.book_details.cover_pic,
        readStatus: data.book_details.read_status,
      }
      this.setState({
        bookDetails: upDatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderProgressView = () => (
    <div testid="loader">
      <Loader type="Puff" color="#0070c1" height={50} width={50} />
    </div>
  )

  renderApiSuccessView = () => {
    const {bookDetails} = this.state
    const {
      coverPic,
      aboutAuthor,
      authorName,
      aboutBook,
      title,
      rating,
      readStatus,
    } = bookDetails
    return (
      <div className="content-container">
        <div className="book-image-details">
          <img src={coverPic} alt={title} className="details-cover-pic-style" />
          <div className="book-item-details-container">
            <h1 className="details-title-description" key={title}>
              {title}
            </h1>
            <p className="details-author-name-style">{authorName}</p>
            <div className="details-avg-rating-container">
              <p className="avg-rating-style">Avg Rating</p>
              <BsFillStarFill className="fill-star-style" />
              <p>{rating}</p>
            </div>
            <p className="details-read-status">
              Status: <span className="read-status-style">{readStatus}</span>
            </p>
          </div>
        </div>
        <hr className="line-style" />
        <div className="about-book-container">
          <h1 className="about-heading">About Author</h1>
          <p className="about-para">{aboutAuthor}</p>
          <h1 className="about-heading">About Book</h1>
          <p className="about-para">{aboutBook}</p>
        </div>
      </div>
    )
  }

  renderApiFailureView = () => (
    <div className="failure-container">
      <img
        src="https://res.cloudinary.com/dkxxgpzd8/image/upload/v1647250727/Screenshot_30_uavmge.png"
        alt="failure view"
        className="failure-image"
      />
      <p className="error-text">Something went wrong. Please try again</p>
      <button
        type="button"
        className="tryAgain-button"
        onClick={this.onClickReTry}
      >
        Try Again
      </button>
    </div>
  )

  renderGetBookApi = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderProgressView()
      case apiStatusConstants.success:
        return this.renderApiSuccessView()
      case apiStatusConstants.failure:
        return this.renderApiFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="book-item-details-page">
          <div className="book-details-page-container">
            {this.renderGetBookApi()}
          </div>
        </div>
        <Footer />
      </>
    )
  }
}

export default BookItemDetailsPage
