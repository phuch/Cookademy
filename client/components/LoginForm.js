import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import FaAngleRight from 'react-icons/lib/fa/angle-right';
import {notify} from 'react-notify-toast';

class LoginForm extends Component {

  handleSubmit = (e) => {
    console.log('handle login');
    e.preventDefault();
    axios.post('/users/login', {
      username: this.username.value,
      password: this.password.value
    })
    .then(res => {
      localStorage.setItem('jwtToken', res.data.token);
      this.props.history.push('/home');
      console.log(res.data);
    }).catch(error => {
      console.log('Error occurs: ' + error);
      notify.show('Authentication failed', 'error', 2000);
    });

  }

  render() {
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

export default LoginForm;

