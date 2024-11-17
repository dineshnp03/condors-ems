import { Component } from "react";
import EmployeeTable from "../../components/employee-table";
import { Outlet } from "react-router-dom";

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
      enableToast: false, // added bootstrap toasts
      toastMessage: {
        title: "",
        message: "",
      },
    };
  }

  // Getting the Employees data from Backend and changing the state in Mount LifeCyel
  async componentDidMount() {
    this.loadEmployees();
  }

  loadEmployees = async () => {
    const query = `
    query {
      employeeList {
        id
        firstName
        lastName
        age
        dateOfJoining
        title
        department
        EmployeeType
        currentStatus
      }
    }
  `;

    try {
      const response = await fetch("/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.data && result.data.employeeList) {
        this.setState({ employees: result.data.employeeList });
      } else {
        console.log(
          "Error: employeeList is undefined",
          result.errors || "No errors returned"
        );
      }
    } catch (error) {
      console.log("Error fetching employees:", error);
    }
  };

  deleteEmployee = async (id) => {
    try {
      const query = `
      mutation {
      deleteEmployee(id: ${id})
      }`;
      const response = await fetch("/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      if (!response.ok) {
        throw new Error("Error!!!, Please try again");
      }
      const result = await response.json();

      if (result.data && result.data.deleteEmployee) {
        this.setState({
          toastMessage: {
            title: "success",
            message: "Employee deleted successfully",
          },
          enableToast: true,
        });

        this.loadEmployees();
      } else {
        console.log("Error deleting employee", result.errors);
      }
    } catch (error) {
      console.log("Error deleting employee:", error.message);
    }
  };

  componentDidUpdate(prevState) {
    if (prevState.enableToast !== this.state.enableToast) {
      setTimeout(() => {
        this.setState({
          enableToast: false,
        });
      }, 3000);
    }
  }

  filterEmployees = (type) => {
    const { employees } = this.state;
    const filtered =
      type === ""
        ? employees
        : employees.filter(
          (employee) =>
            employee.EmployeeType &&
            employee.EmployeeType.toLowerCase() === type.toLowerCase()
        );

    this.setState({ filteredEmployees: filtered });
  };

  render() {
    return (
      <>
        <div className="d-flex justify-content-end">
          <div
            className={` toast ${this.state.enableToast ? "show" : "hide"}`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="toast-header">
              <strong className="me-auto">
                {this.state.toastMessage.title}!!!
              </strong>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="toast"
                aria-label="Close"
                onClick={() => this.setState({ enableToast: false })}
              ></button>
            </div>
            <div className="toast-body">
              {this.state.toastMessage.message}!!!.
            </div>
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="filterType" className="form-label">
            Filter by Employee Type:
          </label>
          <select
            id="filterType"
            className="form-select"
            onChange={(e) => this.filterEmployees(e.target.value)}
          >
            <option value="">All Employees</option>
            <option value="FullTime">Full-Time</option>
            <option value="PartTime">Part-Time</option>
            <option value="Contract">Contract</option>
            <option value="Seasonal">Seasonal</option>
          </select>
        </div>
        
        <div className="row gx-4">
          <div className="col-sm-12 p-5">
            <EmployeeTable
              deleteEmployee={this.deleteEmployee}
              employees={this.state.employees}
            />
          </div>
          <Outlet />
        </div>
      </>
    );
  }
}

export default List;
