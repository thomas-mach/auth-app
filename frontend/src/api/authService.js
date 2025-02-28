import axios from "axios";

const API_URL = "http://localhost:3003/v1/auth";

export const signup = async (userData) => {
  console.log("userData", userData);
  try {
    const response = await axios.post(`${API_URL}/signup`, userData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const signin = async (userData) => {
  console.log("userData", userData);
  try {
    const response = await axios.post(`${API_URL}/login`, userData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
