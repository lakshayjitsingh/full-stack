import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setMessage("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5000/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("username", res.data.user.username);
      localStorage.setItem("email", res.data.user.email);

      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setMessage("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-center">
      <div className="card">
        <h2>Login Form</h2>
        <p className="subtext">JWT Authentication + Protected Routes + RBAC</p>

        {message && <p className="error-msg">{message}</p>}

        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <div className="demo-box">
          <p><strong>Admin:</strong> admin@gmail.com / admin123</p>
          <p><strong>User:</strong> user@gmail.com / user123</p>
        </div>
      </div>
    </div>
  );
}

export default Login;