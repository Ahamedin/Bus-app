import "./Admin.css";

const Admin = () => {
  // 🔹 Mock data (simulating DB)
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
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      <p>Student Bus Details</p>

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
  );
};

export default Admin;
