import axios from "axios";

const api = axios.create({
  baseURL:"https://mern-task-manager-l89k.onrender.com/api",
});

export default api;