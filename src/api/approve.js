const API_URL = '/api/events/'

export const Approveapi = async (id, formData) => {
    try {
      const response = await fetch(`${API_URL}/approve/${id}`, {
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
  export const rejectapi = async (id, formData) => {
    try {
      const response = await fetch(`${API_URL}/reject/${id}`, {
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