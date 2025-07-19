import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password } = form;

    if (!username || !email || !password) {
      toast.error("All fields are required.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/auth/register", form);
      toast.success("Registered successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const message = err.response?.data?.error || "Registration failed.";
       if (message.toLowerCase().includes("email")) {
         toast.error("Email already registered");
       } else {
         toast.error(message);
       }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="register-container">
        <form className="register-form" onSubmit={handleSubmit}>
          <h2>Register</h2>

          <input
            className={!form.username ? "form-input input-error" : "form-input"}
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <input
            className={!form.email ? "form-input input-error" : "form-input"}
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            className={!form.password ? "form-input input-error" : "form-input"}
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />

      <style>{`
        .register-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: #f4f4f4;
        }

        .register-form {
          background: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .register-form h2 {
          text-align: center;
          margin-bottom: 10px;
        }

        .form-input {
          padding: 10px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 6px;
          width: 100%;
        }

        .input-error {
          border-color: red;
        }

        .register-form button {
          padding: 10px;
          font-size: 16px;
          background-color: #28a745;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .register-form button:disabled {
          background-color: #aaa;
          cursor: not-allowed;
        }

        .register-form button:hover:not(:disabled) {
          background-color: #218838;
        }
      `}</style>
    </>
  );
}
