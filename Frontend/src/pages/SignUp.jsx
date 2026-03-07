import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../services/authService";
import toast from "react-hot-toast";

export default function SignUp() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await signupUser(form);
      if (res.data.success) {
        toast.success("Account created! Please log in.");
        navigate("/login");
      } else {
        toast.error(res.data.message || "Signup failed");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Signup failed";
      toast.error(msg);
    }
  };

  return (

    <div className="page-container">

      <div className="card">

        <h2 className="heading">🛕 Create Account</h2>

        <form onSubmit={handleSubmit}>

          <input
            className="input"
            type="text"
            name="name"
            placeholder="Enter Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            className="input"
            type="email"
            name="email"
            placeholder="Enter Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            className="input"
            type="text"
            name="phone"
            placeholder="Enter Phone"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <input
            className="input"
            type="password"
            name="password"
            placeholder="Enter Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn-primary">
            Sign Up
          </button>

        </form>

        <p className="helper-text">
          Already have an account?{" "}
          <Link to="/login" className="link">
            Login
          </Link>
        </p>

      </div>

    </div>

  );
}