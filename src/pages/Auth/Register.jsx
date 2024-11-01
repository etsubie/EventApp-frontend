import { Button, TextInput, Dropdown } from "flowbite-react";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../api/auth";
import { AuthContext } from "../../Context/AuthContext";

export function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "",
  });

  const navigate = useNavigate();
  const { setToken } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Check if role is selected
    if (!formData.role) {
      setErrorMessage("Please select a role.");
      return;
    }

    try {
      const data = await registerUser(formData);


      if (data?.token) {
        setSuccessMessage("Registration successful!");
        localStorage.setItem("token", data.token);
        setToken(data.token);

        // Navigate based on role
        switch (data.role) {
          case "admin":
            navigate("/admin/overview");
            break;
          case "host":
            navigate("/host/events");
            break;
          case "attendee":
            navigate("/events");
            break;
          default:
            console.error("Unknown role:", data.role);
            break;
        }
      } else {
        setErrorMessage("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage("Registration failed: " + error.message);
    }
  };

  return (
    <div className="flex justify-center w-full mt-6">
      <form
        onSubmit={handleRegister}
        autoComplete="none"
        className="w-1/2 flex max-w-md flex-col gap-4 p-4 shadow-lg"
      >
        <h1 className="text-xl font-bold text-center">
          Create a New Account
        </h1>

        {/* Display error or success messages */}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}

        <TextInput
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Name"
          required
          shadow
        />

        <TextInput
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Email"
          required
          shadow
        />

        <TextInput
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder="Password"
          required
          shadow
        />

        <TextInput
          type="password"
          value={formData.password_confirmation}
          onChange={(e) => setFormData({ 
            ...formData, password_confirmation: e.target.value })}
          placeholder="Confirm Password"
          required
          shadow
        />

        {/* Role Dropdown */}
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
        <Button type="submit" className="bg-blue-900">Sign Up</Button>

        <Link to="/login" >
          Already have an account? Login
        </Link>
      </form>
    </div>
  );
}
