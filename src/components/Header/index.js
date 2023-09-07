import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiOutlineMenu} from 'react-icons/ai'
import './index.css'

class Header extends Component {
  state = {
    mobileNav: false,
  }

  onClickLogout = () => {
    const {history} = this.props
    history.replace('/login')
    Cookies.remove('jwt_token')
  }

  onClickMenuIcon = () => {
    this.setState(prevState => ({mobileNav: !prevState.mobileNav}))
  }

  render() {
    const {mobileNav} = this.state
    const {Home, Bookshelf} = this.props
    const activeHome = Home ? 'active-tab' : ''
    const activeShelf = Bookshelf ? 'active-tab' : ''
    return (
      <>
        <div className="desktop-nav-container">
          <div>
            <Link to="/">
              <img
                src="https://res.cloudinary.com/dwtsapuyn/image/upload/v1645077666/book-hub-logo_dy4szt.png"
                alt="website logo"
                className="website-logo"
              />
            </Link>
          </div>
          <ul className="nav-options-container">
            <li>
              <Link to="/" className={`nav-link ${activeHome}`}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/shelf" className={`nav-link ${activeShelf}`}>
                Bookshelves
              </Link>
            </li>
            <button
              type="button"
              className="logout-button"
              onClick={this.onClickLogout}
            >
              Logout
            </button>
          </ul>
        </div>
        <div className="mobile-nav-bar">
          <div className="mobile-logo-icon-container">
            <div>
              <Link to="/">
                <img
                  src="https://res.cloudinary.com/dwtsapuyn/image/upload/v1645077666/book-hub-logo_dy4szt.png"
                  alt="website logo"
                  className="website-logo"
                />
              </Link>
            </div>
            <button
              type="button"
              className="menu-button"
              onClick={this.onClickMenuIcon}
            >
              <AiOutlineMenu />
            </button>
          </div>
          {mobileNav && (
            <ul className="mobile-nav-options-container">
              <li>
                <Link to="/" className={`nav-link ${activeHome}`}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shelf" className={`nav-link ${activeShelf}`}>
                  Bookshelves
                </Link>
              </li>
              <button
                type="button"
                className="logout-button"
                onClick={this.onClickLogout}
              >
                Logout
              </button>
            </ul>
          )}
        </div>
      </>
    )
  }
}

export default withRouter(Header)
