const API_URL = "/api/events";

export const fetchEventsapi = async () => {
  const headers = {};
  const token = localStorage.getItem("token");

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(API_URL, { headers });

    if (!response.ok) {
      console.error("Failed to fetch events. Status:", response.status);
      throw new Error("Unauthorized or server error.");
    }

    const data = await response.json();

    if (!data.events || !Array.isArray(data.events)) {
      throw new Error("Unexpected data format from server.");
    }

    return data.events;

  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

export const getEventsByCategory = async (category) => {
  const response = await fetch(`/api/events/category/${category}`);
  if (!response.ok) {
    throw new Error(`No events found for category: ${category}`);
  }
  return await response.json();
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