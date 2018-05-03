import React, { Component } from 'react';
import '../css/Welcome.css';
import Notifications from 'react-notify-toast';

// Children components
import SignupForm from './SignupForm';
import LoginForm from './LoginForm';

class Welcome extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showSignupForm: true,
    }
  }

  toggleForm = () => {
    this.setState({showSignupForm: !this.state.showSignupForm});
  }

  render() {
    const {showSignupForm} = this.state;
    return (
        <div className="welcome-page">
          <Notifications />
          <div className="signup-form">
            {showSignupForm ?
                <SignupForm toggleForm={this.toggleForm}/> :
                <LoginForm history={this.props.history}/>
            }
            <p>
              {showSignupForm ?
                `Already have an account?` :
                `Not yet a member?`
              }
            </p>
            <a onClick={this.toggleForm}>
              {showSignupForm ? `Login` : `Signup`}
            </a>
          </div>
        </  div>

    )
  }
}

export default Welcome;