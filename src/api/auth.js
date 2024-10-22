const API_REG = '/api/register';
const API_LOGIN = '/api/login';
const API_LOGOUT = '/api/logout';

export const registerUser = async (formData) => {
  try {
    const response = await fetch(API_REG, {
      method: 'POST',
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

export const loginUser = async (formData) => {
  try {
    const response = await fetch(API_LOGIN, {
      method: 'POST',
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const logoutUser = async () => { 
  try {
    const response = await fetch(API_LOGOUT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Logout failed');
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
};