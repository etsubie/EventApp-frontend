import { Button, TextInput, Dropdown } from "flowbite-react";
import {  useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getUserByIdApi, updateUserapi } from "../api/users";
import { useToast } from "../Context/TostContext";

export function Profiledata() {
  const addToast = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserByIdApi(id);
        setFormData({
          name: data.name,
          email: data.email,
          role:  data.role,
        });
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUser();
  }, [id, addToast]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateUserapi(id, formData);
      addToast("Updated successfully!", "success");
      navigate(`/profile/${id}`);
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
        <h1 className="text-xl font-bold text-center ">Update Profile</h1>
        <div>
          <TextInput
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Name"
            required
            shadow
          />
        </div>
        <div>
          <TextInput
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="Email"
            required
            shadow
          />
        </div>
        <div className="bg-blue-900 rounded">
          <Dropdown
            label={formData.role ? `Role: ${formData.role}` : "Select Role"}
          >
            <Dropdown.Item
              onClick={() => setFormData({ ...formData, role: "host" })}
            >
              Host
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => setFormData({ ...formData, role: "attendee" })}
            >
              Attendee
            </Dropdown.Item>
          </Dropdown>
        </div>

        <Button type="submit" className="bg-blue-900">
          Update
        </Button>
        <Link to={`/profile/${id}`}>Go back to Profile</Link>
      </form>
    </div>
  );
}
