import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import Footer from '../Footer'
import BookItem from '../BookItem'
import './index.css'

const constantsApiStatus = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const bookshelvesList = [
  {
    id: '22526c8e-680e-4419-a041-b05cc239ece4',
    Value: 'ALL',
    label: 'All',
  },
  {
    id: '37e09397-fab2-46f4-9b9a-66b2324b2e22',
    Value: 'READ',
    label: 'Read',
  },
  {
    id: '2ab42512-3d05-4fba-8191-5122175b154e',
    Value: 'CURRENTLY_READING',
    label: 'Currently Reading',
  },
  {
    id: '361d5fd4-9ea1-4e0c-bd47-da2682a5b7c8',
    Value: 'WANT_TO_READ',
    label: 'Want to Read',
  },
]

class Bookshelves extends Component {
  state = {
    searchText: '',
    search: '',
    booksData: [],
    shelfValue: bookshelvesList[0].Value,
    bookshelfName: bookshelvesList[0].label,
    booksApiStatus: constantsApiStatus.initial,
    isLoading: true,
  }

  componentDidMount() {
    this.getBooksData()
  }

  onClickReTry = () => {
    this.getBooksData()
  }

  getBooksData = async () => {
    this.setState({
      isLoading: false,
      booksApiStatus: constantsApiStatus.inProgress,
    })

    const {shelfValue, search} = this.state
    const jwtToken = Cookies.get('jwt_token')

    const shelfBooksAPI = `https://apis.ccbp.in/book-hub/books?shelf=${shelfValue}&search=${search}`
    const requestObject = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(shelfBooksAPI, requestObject)
    if (response.ok) {
      const fetchedData = await response.json()
      const upDatedFetchedData = fetchedData.books.map(eachBookData => ({
        authorName: eachBookData.author_name,
        coverPic: eachBookData.cover_pic,
        id: eachBookData.id,
        rating: eachBookData.rating,
        readStatus: eachBookData.read_status,
        title: eachBookData.title,
      }))
      this.setState({
        booksData: upDatedFetchedData,
        booksApiStatus: constantsApiStatus.success,
      })
    } else {
      this.setState({booksApiStatus: constantsApiStatus.failure})
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchText: event.target.value})
  }

  onClickSearchButton = () => {
    const {searchText} = this.state
    this.setState({search: searchText, searchText: ''}, this.getBooksData)
  }

  renderProgressView = () => (
    <div className="bookshelf-loader-container" testid="loader">
      <Loader type="ThreeDots" color="#0070c1" height={50} width={50} />
    </div>
  )

  renderApiSuccessView = () => {
    const {booksData, search} = this.state
    if (booksData.length === 0) {
      return (
        <div className="book-not-found-container">
          <img
            src="https://res.cloudinary.com/dkxxgpzd8/image/upload/v1647250727/Screenshot_30_uavmge.png"
            alt="no books"
            className="failure-image"
          />
          <p> Your search for {search} did not find any matches.</p>
        </div>
      )
    }
    return (
      <ul className="api-success-view-container">
        {booksData.map(eachBookItem => (
          <BookItem eachBookItem={eachBookItem} key={eachBookItem.id} />
        ))}
      </ul>
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

  renderBooksAPIStatus = () => {
    const {booksApiStatus} = this.state
    switch (booksApiStatus) {
      case constantsApiStatus.inProgress:
        return this.renderProgressView()
      case constantsApiStatus.success:
        return this.renderApiSuccessView()
      case constantsApiStatus.failure:
        return this.renderApiFailureView()
      default:
        return null
    }
  }

  render() {
    const {isLoading, bookshelfName, shelfValue, searchText} = this.state
    return (
      <>
        <Header Bookshelf />
        {isLoading ? (
          <div className="loader-container" testid="loader">
            <Loader type="TailSpin" color="#0070c1" height={50} width={50} />
          </div>
        ) : (
          <div className="bookshelf-container">
            <div className="left-nav-container">
              <h1 className="heading" key="title">
                Bookshelves
              </h1>
              <div className="book-type-options-list">
                {bookshelvesList.map(eachBookType => {
                  const onClickShelfButton = () => {
                    this.setState(
                      {
                        bookshelfName: eachBookType.label,
                        shelfValue: eachBookType.Value,
                      },
                      this.getBooksData,
                    )
                  }

                  const {label} = eachBookType

                  const selectedTab =
                    eachBookType.Value === shelfValue ? 'active-Tab' : ''

                  return (
                    <li>
                      <button
                        type="button"
                        className={`shelf-button ${selectedTab}`}
                        onClick={onClickShelfButton}
                      >
                        {label}
                      </button>
                    </li>
                  )
                })}
              </div>
            </div>
            <div className="books-content-container">
              <div className="book-type-search-input-container">
                <h1 className="heading">{bookshelfName} Books</h1>
                <div className="search-input-icon-container">
                  <input
                    type="search"
                    className="search-input-style"
                    onChange={this.onChangeSearchInput}
                    value={searchText}
                    placeholder="Search..."
                  />
                  <button
                    type="button"
                    className="button-searchIcon"
                    onClick={this.onClickSearchButton}
                    testid="searchButton"
                  >
                    <BsSearch />
                  </button>
                </div>
              </div>
              {this.renderBooksAPIStatus()}
            </div>
          </div>
        )}
        <Footer />
      </>
    )
  }
}

export default Bookshelves
