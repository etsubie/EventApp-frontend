import { Button, TextInput, Dropdown } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getUserByIdApi, updateUserapi } from "../api/users";
import { useToast } from "../Context/TostContext"; 

export function UserForm() {
  const addToast = useToast(); 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
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
          role: data.role,
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
      navigate("/admin/users");
    } catch (error) {
      console.error("Update error:", error);
      addToast("Update failed: " + error.message, "error"); 
    }
  };

  return (
    <div className="flex justify-center items-center w-full">
      <form
        onSubmit={handleUpdate}
        autoComplete="none"
        className="w-1/2 flex max-w-md flex-col gap-4 text-black"
      >
        <h1 className="text-xl font-bold text-center text-gray-100">
          Update User Data
        </h1>
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
        <Dropdown
          label={formData.role ? `Role: ${formData.role}` : "Select Role"}
          dismissOnClick={false}
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
        <Button type="submit">Update</Button>
        <Link to="/admin/users" className="text-gray-100 ">
          Go back to User List
        </Link>
      </form>
    </div>
  );
}
