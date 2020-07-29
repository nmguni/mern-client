import React, { useContext, useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { AuthContext } from "../context/auth";
import { useForm } from "../util/hooks";

import auth from "../images/undraw_two_factor_authentication_namy.svg";

function Login(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    username: "",
    password: "",
  });

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData } }) {
      context.login(userData);
      props.history.push("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function loginUserCallback() {
    loginUser();
  }

  return (
    <div className="login-reg-container">
      {/* left */}
      <div className="img-container">
        <h2>Welcome Back!</h2>
        <img
          style={{ width: "350px", opacity: ".85" }}
          src={auth}
          alt="two factor authentication"
        />
      </div>

      {/* right */}
      <div className="form-container">
        <Form
          onSubmit={onSubmit}
          noValidate
          className={loading ? "loading" : ""}
        >
          <h1>Login</h1>
          <Form.Input
            className="input-form"
            label="Username"
            placeholder="Username.."
            name="username"
            type="text"
            value={values.username}
            error={errors.username ? true : false}
            onChange={onChange}
          />
          <Form.Input
            className="input-form"
            label="Password"
            placeholder="Password.."
            name="password"
            type="password"
            value={values.password}
            error={errors.password ? true : false}
            onChange={onChange}
          />
          <Button className="btn" type="submit" primary>
            Login
          </Button>
        </Form>
        {Object.keys(errors).length > 0 && (
          <div className="ui error message">
            <ul className="list">
              {Object.values(errors).map((value) => (
                <li key={value}>{value}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Login;
