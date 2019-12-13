import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import auth from "../services/authService";
import { Redirect } from "react-router-dom";

class LoginForm extends Form {
  state = {
    data: { username: "", password: "" },
    errors: {}
  };

  schema = {
    username: Joi.string()
      .required()
      .label("Username"),
    password: Joi.string()
      .required()
      .label("Password")
  };

  // username = React.createRef();
  // componentDidMount() {
  //   this.username.current.focus();
  // }
  // should never work with a document object, because
  // point of react is to have abstraction over dom. so easier to maintain/unit test.
  // const username = document.getElementById('username').value;
  // so use React.createRef() and use ref={this.name} on input field in the html.
  // now we have access to the variable createRef makes below.
  // but use refs sparingly, we can use autoFocus in html below to focus cursor instead
  // of using name.current.focus() in componentDidMount().
  // const username = this.username.current.value;

  doSubmit = () => {
    try {
      const loginParams = this.state.data;
      const { data: jwt } = auth.login(
        loginParams.username,
        loginParams.password
      );

      const { state } = this.props.location;
      window.location = state ? state.from.pathname : "/";
      console.log("Logged in User");
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    if (auth.getCurrentUser()) return <Redirect to="/" />;

    return (
      //Both username and password inputs have repeatable code,
      //extract to input.jsx
      <div className="login">
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("username", "Username")}
          {this.renderInput("password", "Password", "password")}
          {this.renderButton("Login")}
        </form>
      </div>
    );
  }
}

export default LoginForm;
