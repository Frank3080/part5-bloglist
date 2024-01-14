import React from "react";
import PropTypes from "prop-types";

const LoginForm = ({
  username,
  password,
  handleLogin,
  onChangeUsername,
  onChangePassword,
}) => {
  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          username{" "}
          <input
            type="text"
            value={username}
            name="Username"
            onChange={onChangeUsername}
          />
        </div>
        <div>
          password{" "}
          <input
            type="password"
            value={password}
            name="password"
            onChange={onChangePassword}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  onChangeUsername: PropTypes.func.isRequired,
  onChangePassword: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
};

export default LoginForm;
