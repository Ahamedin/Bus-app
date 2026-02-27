import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import "../components/Highway.css";
import "./Admin.css";

const Admin = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);

  // 🔐 Protect Admin Page
  useEffect(() => {
    if (!isLoaded) return;

    if (!user?.publicMetadata?.isAdmin) {
      navigate("/"); // redirect normal users
    }
  }, [isLoaded, user, navigate]);

  // 📥 Fetch students (admin route)
  useEffect(() => {
    if (!isLoaded) return;

    fetch("http://localhost:5000/api/admin/students", {
      headers: {
        Authorization: `Bearer ${user?.id}`, // simple version (you can improve later)
      },
    })
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error(err));
  }, [isLoaded, user]);

  // ✏️ Update destination
  const updateDestination = async (id, destination) => {
    await fetch(`http://localhost:5000/api/admin/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destination }),
    });

    setStudents((prev) =>
      prev.map((s) =>
        s._id === id ? { ...s, destination } : s
      )
    );
  };

  // ❌ Delete user
  const deleteUser = async (id) => {
    await fetch(`http://localhost:5000/api/admin/delete/${id}`, {
      method: "DELETE",
    });

    setStudents((prev) => prev.filter((s) => s._id !== id));
  };

  if (!isLoaded) return <p>Loading...</p>;

  return (
    <section className="about-section">
      <div className="admin-dark-bg">
        <div className="admin-container">

          <div className="hero-text-vertical show admin-heading">
            <h1>Admin Dashboard</h1>
            <p>College Bus Student Details</p>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Seat No</th>
                  <th>Destination</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td>{student.name}</td>
                    <td>{student.seatNo}</td>

                    <td>
                      <input
                        defaultValue={student.destination}
                        onBlur={(e) =>
                          updateDestination(student._id, e.target.value)
                        }
                        className="admin-input"
                      />
                    </td>

                    <td>{student.phone}</td>

                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => deleteUser(student._id)}
                      >
                        Delete
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Admin;