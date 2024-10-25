import { Button, TextInput } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getUserByIdApi, updateUserapi } from "../api/users";
import { useToast } from "../Context/TostContext"; 
import { AuthContext } from "../Context/AuthContext";

export function ChangPass() {
  const addToast = useToast(); 
  const {user} = useContext(AuthContext)
  const [formData, setFormData] = useState({
    password: "",
    password_confirmation: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserByIdApi(id);
        setFormData({
          password: "",
          password_confirmation: "",
        });
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUser();
  }, [id, addToast]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.password_confirmation) {
      addToast("Passwords do not match", "error"); 
      return;
    }

    try {
      await updateUserapi(id, formData);
      addToast("Updated successfully!", "success"); 
      navigate(`/profile/${user.id}`);
    } catch (error) {
      console.error("Update error:", error);
      addToast("Update failed: " + error.message, "error"); 
    }
  };

  return (
    <div className="flex justify-center items-center w-full mt-9">
      <form
        onSubmit={handleUpdate}
        autoComplete="none"
        className="w-1/2 flex max-w-md flex-col gap-4 shadow-lg p-4"
      >
        <h1 className="text-xl font-bold text-center ">
         Change Password
        </h1>
        <div>
          <TextInput
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder="Password"
            shadow
          />
        </div>
        <div>
          <TextInput
            type="password"
            value={formData.password_confirmation}
            onChange={(e) =>
              setFormData({
                ...formData,
                password_confirmation: e.target.value,
              })
            }
            placeholder="Confirm Password"
            shadow
          />
        </div>
        <div className="bg-blue-900 rounded">
</div>

        <Button type="submit" className="bg-blue-900">Change</Button>
        <Link to="/admin/users">
          Go back to Profile
        </Link>
      </form>
    </div>
  );
}
