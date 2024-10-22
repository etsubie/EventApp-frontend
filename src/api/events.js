const API_URL = "/api/events";

export const fetchEventsapi = async () => {
  try {
    const response = await fetch(API_URL, {
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
    const data = await response.json();

    return data; 

  } catch (error) {
    console.error("Error in fetch event:", error);
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
      throw new Error(errorData.message || 'post failed');
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error('Error during post:', error);
    throw error;
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
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API error:", error.message);
    throw error;
  }
};