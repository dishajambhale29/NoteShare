
import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          name: form.name,
        },
      },
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Registration successful!");

    navigate("/login");
  };

  return (
    <div className="register-page">


      <div className="register-card">

  
        <h1>Create Account</h1>

        <p className="register-subtitle">
          Create your account to start sharing notes.
        </p>

  
        {message && (
          <div className="register-message">
            {message}
          </div>
        )}

    

        <form onSubmit={handleRegister}>

          <div className="register-input-group">

            <label>Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              required
            />

          </div>


     
          <div className="register-input-group">

            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />

          </div>


          <div className="register-input-group">

            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              required
            />

          </div>


          {/* Register Button */}
          <button
            type="submit"
            className="register-btn"
          >
            Register
          </button>

        </form>

        <div className="login-section">

          <span>Already registered?</span>

          <button
            type="button"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

        </div>

      </div>

    </div>
  );
}

export default Register;




