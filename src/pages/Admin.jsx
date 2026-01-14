import "../components/Highway.css";
import "./Admin.css";

const Admin = () => {
  const students = [
    {
      id: 1,
      name: "Arun Kumar",
      seatNo: "A12",
      destination: "Anna Nagar",
      phone: "9876543210",
    },
    {
      id: 2,
      name: "Priya Sharma",
      seatNo: "B07",
      destination: "Tambaram",
      phone: "9123456780",
    },
    {
      id: 3,
      name: "Rahul Singh",
      seatNo: "C03",
      destination: "Velachery",
      phone: "9988776655",
    },
  ];

  return (
    <section className="about-section">
      <div className="admin-container">

        {/* Page Heading */}
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
                <tr key={student.id}>
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
