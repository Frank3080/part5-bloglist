import axios from "axios";
const baseUrl = "http://localhost:3003/api/blogs";

let token = null;

const config = () => ({
  headers: {
    Authorization: token,
  },
});

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const update = async (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  return request.then((response) => response.data);
};

const deleteBlog = async (id) => {
  await axios.delete(`${baseUrl}/${id}`, config());
};

export default { getAll, create, update, deleteBlog, setToken };
