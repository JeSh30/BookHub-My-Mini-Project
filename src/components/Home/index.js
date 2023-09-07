import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import Header from '../Header'
import Footer from '../Footer'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const settings = {
  dots: false,
  slidesToScroll: 1,
  slidesToShow: 4,
  speed: 500,
  infinite: true,
  autoplay: true,
  swipeToSlide: true,
  width: 250,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 576,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
}

class Home extends Component {
  state = {apiStatus: apiStatusConstants.initial, topRatedBooks: []}

  componentDidMount() {
    this.getTopRatedBooks()
  }

  onClickFindBooks = () => {
    const {history} = this.props
    history.push('/shelf')
  }

  onClickFindTopRatedBooks = () => {
    this.getTopRatedBooks()
  }

  getTopRatedBooks = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const topRatedApi = 'https://apis.ccbp.in/book-hub/top-rated-books'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(topRatedApi, options)
    const data = await response.json()
    if (response.ok) {
      const upDatedData = data.books.map(eachBook => ({
        authorName: eachBook.author_name,
        coverPic: eachBook.cover_pic,
        id: eachBook.id,
        title: eachBook.title,
      }))
      this.setState({
        apiStatus: apiStatusConstants.success,
        topRatedBooks: upDatedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderProgressView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="Puff" color="#0070c1" width={50} Height={50} />
    </div>
  )

  renderSuccessView = () => {
    const {topRatedBooks} = this.state
    return (
      <ul className="slider-container">
        <Slider {...settings}>
          {topRatedBooks.map(eachBook => {
            const {id, coverPic, authorName, title} = eachBook
            return (
              <li className="top-rated-each-book-container" key={id}>
                <Link to={`/books/${id}`}>
                  <img src={coverPic} alt={title} className="coverPic-image" />
                </Link>
                <h1 className="title-heading" key={authorName}>
                  {title}
                </h1>
                <p className="author-heading" key={authorName}>
                  {authorName}
                </p>
              </li>
            )
          })}
        </Slider>
      </ul>
    )
  }

  renderFailureView = () => (
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
        onClick={this.onClickFindTopRatedBooks}
      >
        Try Again
      </button>
    </div>
  )

  renderBooksApi = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderProgressView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header Home />
        <div className="home-container">
          <h1 className="favorite-books-heading" key="title">
            Find Your Next Favorite Books?
          </h1>
          <p className="Home-description">
            You are in the right place. Tell us what titles or genres you have
            enjoyed in the past, and we will give you surprisingly insightful
            recommendations.
          </p>
          <button
            type="button"
            className="mobile-books-button"
            onClick={this.onClickFindBooks}
          >
            Find Books
          </button>
          <div className="bottom-container">
            <div className="heading-button-container">
              <h1 className="top-rated-books-heading">Top Rated Books</h1>
              <button
                type="button"
                className="desktop-books-button"
                onClick={this.onClickFindBooks}
              >
                Find Books
              </button>
            </div>
            {this.renderBooksApi()}
          </div>
        </div>
        <Footer />
      </>
    )
  }
}

export default Home
