import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import FaAngleRight from 'react-icons/lib/fa/angle-right';

class LoginForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      redirectTo: null
    }
  }

  handleSubmit = (e) => {
    console.log('handle login');
    e.preventDefault();
    axios.post('/users/login', {
      username: this.username.value,
      password: this.password.value
    })
    .then(res => {
      console.log(res);
      if (res.status === 200) {
        this.props.handleLogin({
          loggedIn: true,
          username: res.data.username
        });
        // update the state to redirect to home
        this.setState({
          redirectTo: '/home'
        });
      }
    }).catch(error => {
      console.log(error);
    });

  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={{ pathname: this.state.redirectTo }} />
    } else {
      return (
          <form className="modal-form" onSubmit={(e) => this.handleSubmit(e)}>
            <div className="input-field">
              <input name="username"
                     required
                     type="email"
                     placeholder="johnd@gmail.com"
                     ref={(input) => this.username = input}/>
              <label htmlFor="email"></label>
            </div>
            <div className="input-field">
              <input name="password"
                     required
                     type="password"
                     placeholder="password"
                     ref={(input) => this.password = input}/>
              <label htmlFor="password"></label>
            </div>

            <button>Log In <FaAngleRight className="signup-icon"/></button>
          </form>
      )
    }
  }
}

export default LoginForm;

