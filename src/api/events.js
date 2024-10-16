const API_URL = "/api/events";

export const fetchEventsapi = async () => {
  try {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();

    // Ensure the structure matches expectations
    if (!data.events || !Array.isArray(data.events)) {
      throw new Error("Unexpected data format from server.");
    }

    return data.events; 

  } catch (error) {
    console.error("Error in fetch events:", error);
    return []; // Return empty array on error
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
