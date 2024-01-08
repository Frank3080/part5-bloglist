import React from "react";

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

export default LoginForm;
