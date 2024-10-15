const API_URL = "/api/users";
const API_BASE_URL = "/api/overview";

export const fetchUsers = async () => {
  try {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in fetchUsers:", error);
    return []; // Return an empty array in case of an error
  }
};

//Fetch user by id

export const getUserByIdApi = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};
// Function to update user by ID
export const updateUserapi = async (id, formData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Something went wrong");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API error:", error.message);
    throw error;
  }
};

// Fetch user growth data
export const fetchUserGrowthData = async () => {
  try {
    const response = await fetch(API_BASE_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch user growth data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in fetchUserGrowthData:", error.message);
    throw error;
  }
};
