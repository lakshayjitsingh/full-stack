import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setMessage(res.data.message);
      } catch (error) {
        setMessage("Unable to load dashboard.");
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="page-center">
      <div className="card">
        <h2>User Dashboard</h2>
        <p>{message}</p>
        <p>This page can be accessed by both user and admin.</p>
      </div>
    </div>
  );
}

export default Dashboard;