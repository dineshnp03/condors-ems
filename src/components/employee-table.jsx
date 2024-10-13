import { Component } from "react";

class EmployeeTable extends Component {
  render() {
    const { employees } = this.props;

    return (
      <div>
        <table className="emp-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Age</th>
              <th>Date of Joining</th>
              <th>Title</th>
              <th>Department</th>
              <th>Employee Type</th>
              <th>Current Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((employee, index) => (
                <tr key={index}>
                  <td>{employee.firstName}</td>
                  <td>{employee.lastName}</td>
                  <td>{employee.age}</td>
                  {}
                  <td>{new Date(employee.dateOfJoining).toLocaleDateString()}</td>
                  <td>{employee.title}</td>
                  <td>{employee.department}</td>
                  <td>{employee.EmployeeType}</td>
                  <td>{employee.currentStatus ? "Working" : "Retired"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No Employees Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

export default EmployeeTable;
