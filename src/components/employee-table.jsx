import { Component } from "react";

class EmployeeTable extends Component {
  render() {
    const { employees } = this.props;

    return (
      <div>
        <h3 className="mb-3">Employee Directory</h3>
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
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
                    <td>
                      {employee.dateOfJoining
                        ? new Date(employee.dateOfJoining).toLocaleDateString(
                            "en-CA"
                          )
                        : ""}
                    </td>
                    <td>{employee.title}</td>
                    <td>{employee.department}</td>
                    <td>{employee.EmployeeType}</td>
                    <td>{employee.currentStatus ? "Working" : "Retired"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center my-3">
                    No Employees Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default EmployeeTable;
