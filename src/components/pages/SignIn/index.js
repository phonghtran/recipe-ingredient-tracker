import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";

import { SignUpLink } from "../SignUp";
import { PasswordForgetLink } from "../PasswordForget";

import { withFirebase } from "../../../firebase";
import * as ROUTES from "../../../constants/routes";

const SignInPage = () => (
  <div className=" lg:container lg:mx-auto">
    <h1>SignIn</h1>
    <SignInForm />
    <PasswordForgetLink />
    <SignUpLink />
  </div>
);

const INITIAL_STATE = {
  email: "",
  password: "",
  error: null,
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch((error) => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === "" || email === "";

    return (
      <form onSubmit={this.onSubmit}>
        <p>
          <label for="a-signin__inputEmail">Email</label>
          <br />
          <input
            name="email"
            id="a-signin__inputEmail"
            value={email}
            onChange={this.onChange}
            type="text"
            placeholder="Email Address"
          />
        </p>
        <p>
          <label for="a-signin__inputPassword">Password</label>
          <br />
          <input
            name="password"
            id="a-signin__inputPassword"
            value={password}
            onChange={this.onChange}
            type="password"
            placeholder="Password"
          />
        </p>
        <button disabled={isInvalid} type="submit">
          Sign In
        </button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const SignInForm = compose(withRouter, withFirebase)(SignInFormBase);

export default SignInPage;

export { SignInForm };
