import { Loader, User } from "lucide-react";
import SettingSection from "./SettingSection";
import { getUserByIdApi } from "../../api/users";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";  

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { id } = useParams(); 
  useEffect(() => {
    const getUsers = async () => {
      if (!id) {
        setError("No user ID found.");
        setLoading(false);
        return;
      }

      setError(null);
      try {
        const data = await getUserByIdApi(id);
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user data. Please try again later.", error);
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, [id]); 

  if (loading) return <p><Loader/></p>;
  if (error) return <p>{error}</p>;

  return (
    <SettingSection icon={User} title={"Profile"}>
      <div className="flex flex-col sm:flex-row items-center mb-6">
        <div className="flex-shrink-0 h-10 w-10">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold">
            {user?.name?.charAt(0) || "U"}
          </div>
        </div>

        <div className="ml-4">
          <h3 className="text-lg font-semibold">{user?.name || "Unknown User"}</h3>
          <p>{user?.email || "No email available"}</p>
        </div>
      </div>

      <Link to={`/profile/edit/${user.id}`} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto">
        Edit Profile
      </Link >
    </SettingSection>
  );
};

export default Profile;
