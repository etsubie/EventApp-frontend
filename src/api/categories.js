const API_URL = '/api/categories'; 

export const createCategoryApi = async (categoryName) => {
  try {
      console.log("Sending request to create category:", categoryName); 

      const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ name: categoryName }), 
      });

      if (!response.ok) {
          const errorData = await response.json();
          console.error("Error response from server:", errorData); 
          throw new Error(errorData.message || 'Post failed');
      }

      const data = await response.json();
      return data;
  } catch (error) {
      console.log('Error during post:', error);
      throw error;
  }
};

// API call to fetch categories
export const fetchCategoriesApi = async () => {
    try {
        const response = await fetch(API_URL, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch categories");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Error fetching categories:", error.message);
        throw error;
    }
};
