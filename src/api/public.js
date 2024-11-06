const API_URL = "/api/public";
export const fetchEventpapi = async () => {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

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
