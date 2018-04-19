import React, { Component } from 'react';
import '../css/Welcome.css';

// Children components
import SignupForm from './SignupForm';
import LoginForm from './LoginForm';

class Welcome extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showSignupForm: true,
      loggedIn: false,
      username: null
    }
  }

  toggleForm = () => {
    this.setState({showSignupForm: !this.state.showSignupForm});
  }

  handleLogin = (userObject) => {
    this.setState(userObject)
  }

  render() {
    return (
        <div className="welcome-page">
          <div className="signup-form">
            {this.state.showSignupForm ?
                <SignupForm toggleForm={this.toggleForm}/> :
                <LoginForm handleLogin={this.handleLogin}/>
            }
            <p>
              {this.state.showSignupForm ?
                `Already have an account?` :
                `Not yet a member?`
              }
            </p>
            <a onClick={this.toggleForm}>
              {this.state.showSignupForm ? `Login` : `Signup`}
            </a>
          </div>
        </  div>

    )
  }
}

export default Welcome;