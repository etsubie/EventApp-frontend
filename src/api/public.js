const API_URL = "/api/public";


export const fetchEventsapi = async () => {
  try {
    const response = await fetch(API_URL);
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