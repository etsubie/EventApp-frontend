import { Button, TextInput } from "flowbite-react";
import { Dropdown } from "flowbite-react";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../api/register";
import { AuthContext } from "../../Context/AuthContext";

export function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "",
  });

  const navigate = useNavigate()
  const { setToken } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    
    try {
      const data = await registerUser(formData); 
      
      setSuccessMessage("Registration successful!");
      localStorage.setItem('token', data.token); 
      setToken(data.token); 
      navigate('/'); 
      
      console.log(data); 
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage("Registration failed: " + error.message);
    }
  };
  

  return (
    <div className="flex justify-center items-center w-full">
      <form
        onSubmit={handleRegister}
        autoComplete="none"
        className="w-1/2 flex max-w-md flex-col gap-4 text-black"
      >
        <h1 className="text-xl font-bold text-center text-gray-100">
          Create a New Account
        </h1>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}
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
            required
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
            required
            shadow
          />
        </div>
        <Dropdown
          label={formData.role ? `Role: ${formData.role}` : "Register as"}
          onChange={(role) => setFormData({ ...formData, role })}
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
        <Button type="submit">Sign Up</Button>
        <Link to="/login" className="text-gray-100 ">
          Already have an account? Login
        </Link>
      </form>
    </div>
  );
}
