import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL + "/api",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    // Add any request interceptors here
    return config;
  },
  (error) => {
    // Handle request error here
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    // Add any response interceptors here
    if (response.data?.error?.name === "TokenExpiredError") {
      window.localStorage.removeItem("userInfo");
      window.location.reload();
    }

    return response;
  },
  (error) => {
    console.log("interceptor err", error);
    // Handle response error here
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(error.response.data.error);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error(error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
