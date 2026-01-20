import { useEffect, useState } from "react";
import "../components/Highway.css";
import "./Admin.css";

const Admin = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/students")
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <section className="about-section">
      <div className="admin-container">

        {/* Heading */}
        <div className="hero-text-vertical show admin-heading">
          <h1>Admin Dashboard</h1>
          <p>College Bus Student Details</p>
        </div>

        {/* Table */}
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Seat No</th>
                <th>Destination</th>
                <th>Phone Number</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>{student.name}</td>
                  <td>{student.seatNo}</td>
                  <td>{student.destination}</td>
                  <td>{student.phone}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>
    </section>
  );
};

export default Admin;
