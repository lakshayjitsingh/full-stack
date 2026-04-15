import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/admin", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setMessage(res.data.message);
      } catch (error) {
        setMessage("Admin access denied.");
      }
    };

    fetchAdminData();
  }, []);

  return (
    <div className="page-center">
      <div className="card">
        <h2>Admin Dashboard</h2>
        <p>{message}</p>
        <p>Only admin can access this page.</p>
      </div>
    </div>
  );
}

export default AdminDashboard;