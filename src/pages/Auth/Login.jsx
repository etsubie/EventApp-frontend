"use client";

import { Button, TextInput } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../api/auth";
import { AuthContext } from "../../Context/AuthContext";

export function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { setToken } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState("");

  const clearForm = () => {
    setFormData({ email: "", password: "" });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(formData);
      localStorage.setItem("token", data.token);
      setToken(data.token);
      clearForm();
      if (data.role === "admin") {
        navigate("/admin/overview");
      } else if (data.role === "host") {
        navigate("/host/events");
      } else if (data.role === "attendee") {
        navigate("/attendee/events");
      }
  
    } catch (error) {
      setErrorMessage("Login failed: " + error.message);
    }
  };
  return (
    <div className="flex justify-center w-full mt-6">
      <form
        className="w-1/2 flex max-w-md flex-col gap-4 shadow-lg p-4"
        onSubmit={handleLogin}
      >
        <h1 className="text-xl font-bold text-center">
          Login into Your Account
        </h1>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <div>
          <TextInput
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            type="email"
            placeholder="Email"
            required
          />
        </div>
        <div>
          <TextInput
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            type="password"
            placeholder="Password"
            required
          />
        </div>
        <Button type="submit" className="bg-blue-900">Login</Button>

        <Link to="/register">
          Don’t have an account? Sign Up
        </Link>
      </form>
    </div>
  );
}
