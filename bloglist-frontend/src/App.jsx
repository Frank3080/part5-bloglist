import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedinUserJSON = window.localStorage.getItem("loggedinUser");

    if (loggedinUserJSON) {
      const user = JSON.parse(loggedinUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const messageHandler = (message, type) => {
    setMessage({ message, type });
    setTimeout(() => {
      setMessage();
    }, 10000);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedinUser", JSON.stringify(user));
      setUser(user);
      blogService.setToken(user.token);

      const blogList = blogs.sort((a, b) => b.likes - a.likes);
      const filtered = blogList.filter(
        (blog) => blog.user.username === username
      );
      setBlogs(filtered);
      setUsername("");
      setPassword("");
      messageHandler(`Welcome ${user.name}`, "success");
    } catch (err) {
      messageHandler("Wrong Credentials", "error");
    }
  };

  const handleLogout = async () => {
    window.localStorage.clear();
    setUser(null);
    messageHandler("User logged out.", "success");
  };

  const createBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(newBlog));
      messageHandler(
        `A new blog titled ${newBlog.title} by ${newBlog.authot} added.`,
        "success"
      );
    } catch (err) {
      messageHandler("Posting new blog failed", "error");
    }
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <LoginForm
          username={username}
          password={password}
          handleLogin={handleLogin}
          onChangeUsername={({ target }) => setUsername(target.value)}
          onChangePassword={({ target }) => setPassword(target.value)}
        />
      </div>
    );
  }

  return (
    <div>
      <Notification message={message} />
      <h2>Blogs</h2>
      <div>
        <p>{user.name} logged in</p>
        <button onClick={handleLogout}>Logout</button>
        <div>
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
        <BlogForm createBlog={createBlog} />
      </div>
    </div>
  );
};

export default App;
