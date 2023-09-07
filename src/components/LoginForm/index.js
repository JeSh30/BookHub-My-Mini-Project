import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    // showPassword: false,
    showError: false,
    errorMsg: '',
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  //   onClickShowPassword = () => {
  //     this.setState(prevState => ({showPassword: !prevState.showPassword}))
  //   }

  renderUsername = () => {
    const {username} = this.state
    return (
      <div className="input-container">
        <label className="label-style" htmlFor="username">
          Username*
        </label>
        <input
          id="username"
          type="text"
          className="input-style"
          onChange={this.onChangeUsername}
          value={username}
          placeholder="Username"
        />
      </div>
    )
  }

  renderPassword = () => {
    const {password, showPassword} = this.state
    const inputType = showPassword ? 'text' : 'password'
    return (
      <div className="input-container">
        <label className="label-style" htmlFor="password">
          Password*
        </label>
        <input
          id="password"
          type={inputType}
          className="input-style"
          value={password}
          onChange={this.onChangePassword}
          placeholder="Password"
        />
      </div>
    )
  }

  //   renderShowPassword = () => (
  //     <div className="show-password-container">
  //       <input
  //         type="checkbox"
  //         className="checkbox-style"
  //         id="checkbox"
  //         onClick={this.onClickShowPassword}
  //       />
  //       <label className="label-style" htmlFor="checkbox">
  //         Show Password
  //       </label>
  //     </div>
  //   )

  loginSuccessView = jwtToken => {
    // if login is success creates the jwtToken
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  loginFailureView = errorMsg => {
    this.setState({showError: true, errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()

    const {username, password} = this.state
    const userDetails = {username, password}

    const LoginUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(LoginUrl, options)
    const data = await response.json()

    if (response.ok) {
      this.loginSuccessView(data.jwt_token)
    } else {
      this.loginFailureView(data.error_msg)
    }
  }

  render() {
    const {showError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      // if jwtToken is available the page is redirect to home page
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <img
          src="https://res.cloudinary.com/dwtsapuyn/image/upload/v1645073768/bookhub-image_ubswwx.png"
          alt="login website logo"
          className="desktop-login-image"
        />
        <div className="user-inputs-container">
          <form className="form-container" onSubmit={this.onSubmitForm}>
            <img
              src="https://res.cloudinary.com/dwtsapuyn/image/upload/v1645073768/bookhub-image_ubswwx.png"
              alt="website login"
              className="mobile-login-image"
            />
            <img
              src="https://res.cloudinary.com/dwtsapuyn/image/upload/v1645077666/book-hub-logo_dy4szt.png"
              alt="website logo"
              className="website-logo"
            />
            {this.renderUsername()}
            {this.renderPassword()}
            {/* {this.renderShowPassword()} */}
            <button type="submit" className="login-button">
              Login
            </button>
            {showError && <p className="error-message">{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default LoginForm
