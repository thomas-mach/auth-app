import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const API_URL_USER = import.meta.env.VITE_API_URL_USER;

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
  try {
    const response = await axios.post(`${API_URL}/login`, userData, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// export const verifyEmail = async (token) => {
//   try {
//     // Fai una richiesta GET alla rotta di verifica con il token
//     const response = await axios.get(`${API_URL}/verify?token=${token}`, {
//       withCredentials: true,
//     });
//     return response.data; // Ritorna i dati della risposta
//   } catch (error) {
//     throw error; // Se c'è un errore, viene lanciato
//   }
// };

export const logout = async () => {
  try {
    const response = await axios.post(`${API_URL}/logout`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const forgotPassword = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/forgotPassword`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (userData) => {
  try {
    const response = await axios.patch(
      `${API_URL}/resetPassword/${userData.token}`,
      userData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resendEmail = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/resendEmail`, userData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePassword = async (userData) => {
  try {
    const response = await axios.patch(
      `${API_URL}/updateMyPassword`,
      userData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAccount = async () => {
  try {
    const response = await axios.patch(
      `${API_URL_USER}/deleteMe`,
      {},
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
