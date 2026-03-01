import { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import "../components/Highway.css";
import "./Admin.css";

const Admin = () => {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);

  // 🔐 Protect Admin Page + Fetch Students
  useEffect(() => {
    if (!isLoaded) return;

    // Redirect non-admin
    if (!user?.publicMetadata?.isAdmin) {
      navigate("/");
      return;
    }

    const fetchStudents = async () => {
      try {
        const token = await getToken();

        const res = await fetch(
          "http://localhost:5000/api/admin/students",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setStudents(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStudents();
  }, [isLoaded, user, navigate, getToken]);

  // ✏️ Update destination
  const updateDestination = async (id, destination) => {
    try {
      const token = await getToken();

      await fetch(`http://localhost:5000/api/admin/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ destination }),
      });

      setStudents((prev) =>
        prev.map((s) =>
          s._id === id ? { ...s, destination } : s
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // ❌ Delete user
  const deleteUser = async (id) => {
    try {
      const token = await getToken();

      await fetch(`http://localhost:5000/api/admin/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStudents((prev) =>
        prev.filter((s) => s._id !== id)
      );
    } catch (err) {
      console.error(err);
    }
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