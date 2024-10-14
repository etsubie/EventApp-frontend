const API_URL = "/api/users";

export const fetchUsers = async () => {
  try {
    const response = await fetch(API_URL, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    const data = await response.json();
    
    // Ensure the data is returned
    return data;  // This line was missing, causing undefined issue
    
  } catch (error) {
    console.error('Error in fetchUsers:', error);
    return [];  // Return an empty array in case of an error
  }
};


const API_BASE_URL = "/api/admin/users"; 
// Fetch user growth data
export const fetchUserGrowthData = async () => {
	try {
		const response = await fetch(API_BASE_URL);
		if (!response.ok) {
			throw new Error("Failed to fetch user growth data");
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error in fetchUserGrowthData:", error);
		throw error;
	}
};
