const API_URL = "/api/events";

export const fetchEventsapi = async (params = {}) => {
  try {
    const url = new URL(API_URL, window.location.origin);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await response.json();

    if (!data.events || !Array.isArray(data.events)) {
      throw new Error("Unexpected data format from server.");
    }

    return data.events; 

  } catch (error) {
    console.error("Error in fetch events:", error);
    return []; 
  }
};

export const fetchEventapi = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Event not found');
    }

    return await response.json(); 

  } catch (error) {
    console.error("Error in fetch event:", error.message);
    throw error; // Re-throw the error for handling upstream
  }
};

export const createEventapi = async (formData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Post failed');
    }

    return await response.json(); 
  } catch (error) {
    console.error('Error during post:', error);
    throw error; // Re-throw the error for handling upstream
  }
};

export const updateEventsapi = async (id, formData) => {
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

    return await response.json();
  } catch (error) {
    console.error("API error:", error.message);
    throw error; // Re-throw the error for handling upstream
  }
};

export const deletEventapi = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Something went wrong");
    }

    return await response.json();
  } catch (error) {
    console.error("API error:", error.message);
    throw error; // Re-throw the error for handling upstream
  }
};