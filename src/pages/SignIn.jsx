import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

// Yup Schema Validation
const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await login(data.email, data.password);
      console.log("LoginPage", res);
      localStorage.setItem("token", res.token);

      navigate("/");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cyan-300/40 p-4">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-cyan-400 text-shadow-lg text-center mb-2">
          TASKIFY
        </h1>
        <h4 className="text-xl text-center font-bold text-black/70 mb-2">
          Welcome back!
        </h4>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {/* EMAIL */}
          <div>
            <label className="block text-sm mb-1">Email*</label>
            <input
              type="email"
              {...register("email")}
              className="w-full p-2 border text-sm border-gray-300 rounded-md 
              focus:ring-1 focus:ring-cyan-500 outline-none"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm mb-1">Password*</label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="w-full p-2 border text-sm border-gray-300 rounded-md 
                focus:ring-1 focus:ring-cyan-500 outline-none pr-10"
                placeholder="Enter your password"
              />

              {/* Eye Icon */}
              <span
                className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <div className="h-4">
                {errors.password && (
                  <p className="text-red-500 text-xs">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Link
                to="/forgot-password"
                className="text-sm text-cyan-600 hover:underline  whitespace-nowrap"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          {/* FORGOT PASSWORD LINK */}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="w-full bg-cyan-500 mt-2 text-white py-2 rounded-md text-md 
            hover:bg-cyan-600 transition"
          >
            Sign In
          </button>
        </form>

        {/* SIGNUP LINK */}
        <p className="text-center mt-4 text-sm">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-cyan-600 font-semibold">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
