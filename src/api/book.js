const API_URL = '/api/booked';
const API_URm = '/api/mybooked';
 
  
  
export const fetchBooked = async () => {
    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      console.log('Response Status:', response.status);
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Response Body:', data); 
        throw new Error(data.message || "Failed to fetch booked events");
      }
  
      return data; 
    } catch (error) {
      console.error("Error in fetch booked events:", error);
      return []; 
    }
  }
  export const fetchmyBooked = async () => {
    try {
      const response = await fetch(API_URm, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
        const data = await response.json();
      
      if (!response.ok) {
        console.error('Response Body:', data); 
        throw new Error(data.message || "Failed to fetch booked events");
      }
  
      return data; 
    } catch (error) {
      console.error("Error in fetch booked events:", error);
      return []; 
    }
  }