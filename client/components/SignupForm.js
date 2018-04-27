import React, { Component } from 'react';
import axios from 'axios';
import FaAngleRight from 'react-icons/lib/fa/angle-right';
import {notify} from 'react-notify-toast';

class SignupForm extends Component {

  constructor (props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      phone: '',
      formErrors: {name: '', email: '', password: ''},
      nameValid: false,
      emailValid: false,
      passwordValid: false,
      formValid: false
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    //request to server to add a new user
    axios.post('/users/register', {
      name: this.name.value,
      username: this.username.value,
      password: this.password.value
    })
    .then(res => {
      console.log(res);
      if (!res.data.success) {
        console.log(res.data.msg);
        notify.show(res.data.msg, 'error', 2000);
      } else {
        notify.show('Signup succesfully!', 'success', 2000);
        this.props.toggleForm();
      }
    }).catch(error => {
      console.log('Signup error: ');
      console.log(error);
    })
  }

  handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({[name]: value}, () => { this.validateField(name, value) });
  }

  notify = () => toast("Wow so easy !");

  validateField = (fieldName, value) => {
    let fieldErrors = this.state.formErrors;
    let nameValid = this.state.nameValid;
    let emailValid = this.state.emailValid;
    let passwordValid = this.state.passwordValid;

    switch(fieldName) {
      case 'name':
        nameValid = value.length > 0;
        fieldErrors.name = nameValid ? '' : 'Full name is required';
        break;
      case 'username':
        emailValid = /\S+@\S+\.\S+/.test(value);
        fieldErrors.email = emailValid ? '' : 'Email address is invalid';
        break;
      case 'password':
        passwordValid = value.length >= 6;
        fieldErrors.password = passwordValid ? '': 'Password must be at least 6' +
            ' characters';
        break;
      default:
        break;
    }
    this.setState({
      formErrors: fieldErrors,
      nameValid: nameValid,
      emailValid: emailValid,
      passwordValid: passwordValid
    }, this.validateForm);
  }

  validateForm = () => {
    this.setState({formValid: this.state.nameValid && this.state.emailValid && this.state.passwordValid});
  }

  render() {
    return (
        <form onSubmit={this.handleSubmit} className="modal-form">
          <div className="input-field">
            <input name="name"
                   required
                   type="text"
                   placeholder="Full name"
                   ref={(input) => this.name = input}
                   onChange={this.handleInputChange}
            />
            <label htmlFor="name"></label>
          </div>
          {(this.state.formErrors.name.length > 0) &&
            <p className="form-error">{this.state.formErrors.name}</p>
          }
          <div className="input-field">
            <input name="username"
                   required
                   type="email"
                   placeholder="Your email address"
                   ref={(input) => this.username = input}
                   onChange={this.handleInputChange}
            />
            <label htmlFor="email"></label>
          </div>
          {(this.state.formErrors.email.length > 0) &&
            <p className="form-error">{this.state.formErrors.email}</p>
          }
          <div className="input-field">
            <input name="password"
                   required
                   type="password"
                   placeholder="Password"
                   ref={(input) => this.password = input}
                   onChange={this.handleInputChange}
            />
            <label htmlFor="password"></label>
          </div>
          {(this.state.formErrors.password.length > 0) &&
            <p className="form-error">{this.state.formErrors.password}</p>
          }

          <button>Sign up <FaAngleRight className="signup-icon"/></button>
        </form>
    )
  }
}

export default SignupForm;

