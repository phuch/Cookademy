import React, { Component } from 'react';
import axios from 'axios';
import FaAngleRight from 'react-icons/lib/fa/angle-right';

class SignupForm extends Component {

  handleSubmit = (e) => {
    e.preventDefault();
    //request to server to add a new user
    axios.post('/users/', {
      name: this.name.value,
      username: this.username.value,
      password: this.password.value
    })
    .then(res => {
      console.log(res);
      if (res.data.error) {
        console.log(res.data.error);
      } else {
        console.log('Signup succesfully!');
        this.props.toggleForm();
      }
    }).catch(error => {
      console.log('Signup error: ');
      console.log(error);
    })
  }

  render() {
    return (
        <form onSubmit={(e) => this.handleSubmit(e)} className="modal-form">
          <div className="input-field">
            <input name="name"
                   required
                   type="text"
                   placeholder="Full name"
                   ref={(input) => this.name = input}/>
            <label htmlFor="name"></label>
          </div>
          <div className="input-field">
            <input name="username"
                   required
                   type="email"
                   placeholder="Your email address"
                   ref={(input) => this.username = input}/>
            <label htmlFor="email"></label>
          </div>
          <div className="input-field">
            <input name="password"
                   required
                   type="password"
                   placeholder="Password"
                   ref={(input) => this.password = input}/>
            <label htmlFor="password"></label>
          </div>

          <button>Sign up <FaAngleRight className="signup-icon"/></button>
        </form>
    )
  }
}

export default SignupForm;

