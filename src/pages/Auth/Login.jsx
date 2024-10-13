"use client";

import { Button, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";

export function Login() {
  return (
    <div className="flex justify-center items-center w-full">
      <form
        autoComplete="none"
        className="w-1/2 flex max-w-md flex-col gap-4 text-black"
      >
        <h1 className="text-xl font-bold text-center text-gray-100">
          Login into Your Account
        </h1>{" "}
        <div>
          <TextInput type="email" placeholder="Email" required />
        </div>
        <div>
          <TextInput type="password" placeholder="Passwod" required />
        </div>
        <Button type="submit">Login</Button>
        <Link to="/register" className="text-gray-100 ">
          Don`t have an account? Sign Up
        </Link>
      </form>
    </div>
  );
}
