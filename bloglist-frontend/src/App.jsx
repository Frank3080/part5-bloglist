import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import Toggable from "./components/Toggable";

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
    } catch (error) {
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
    } catch (error) {
      messageHandler("Posting new blog failed", "error");
    }
  };

  const updateBlog = async (blog) => {
    try {
      await blogService.update(blog.id, blog);
      const blogs = await blogService.getAll();
      setBlogs(blogs.sort((a, b) => b.likes - a.likes));
      messageHandler(`${blog.title} liked.`, "success");
    } catch (error) {
      messageHandler(`Liking ${blog.title} failed.`, "error");
    }
  };

  const deleteBlog = async (id, blog) => {
    try {
      if (window.confirm(`Remove blog: "${blog.title}"?`)) {
        await blogService.deleteBlog(id);
        const response = await blogService.getAll();
        setBlogs(response);
        messageHandler(`${blog.title} has been removed.`, "success");
      }
    } catch (error) {
      console.log(error);
      messageHandler(`Deleting ${blog.title} failed.`, "error");
    }
  };

  if (user === null) {
    return (
      <div>
        <Notification message={message} />
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
            <Blog
              key={blog.id}
              blog={blog}
              updateBlog={updateBlog}
              deleteBlog={deleteBlog}
              username={user.username}
            />
          ))}
        </div>
        <Toggable buttonLabel="Create new blog">
          <BlogForm createBlog={createBlog} />
        </Toggable>
      </div>
    </div>
  );
};

export default App;
