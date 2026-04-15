import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="logo">Auth RBAC Project</div>

      <div className="nav-links">
        {!token && <Link to="/">Login</Link>}

        {token && <Link to="/dashboard">Dashboard</Link>}

        {token && role === "admin" && <Link to="/admin">Admin</Link>}

        {token && <span className="welcome-text">Hi, {username}</span>}

        {token && (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;