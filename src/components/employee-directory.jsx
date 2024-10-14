import { Component } from "react";
import EmployeeTable from "./employee-table";
import EmployeeCreate from "./employee-create";

class EmployeeDirectory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
      enableToast: false, // added bootstrap toasts
    };
  }

  //  Employee creation function getting the newEmployee Data from the EmployeeCreate component
  createEmployee = (newEmployee) => {
    console.log(newEmployee);
    const addQuery = `
     mutation createEmployee($newEmployee: EmployeeInput!){ 
      createEmployee(newEmployee: $newEmployee) {
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

    fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: addQuery,
        variables: {
          newEmployee: newEmployee,
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.setState({ enableToast: true });
        setTimeout(() => {
          this.setState({ enableToast: false });
        }, 3000);
        if (data.data.createEmployee) {
          this.setState({
            employees: [...this.state.employees, data.data.createEmployee],
          });
        }
      })
      .catch((error) => {
        console.log("Error while inserting the new employee details:", error);
      });
  };

  // Getting the Employees data from Backend and changing the state in Mount LifeCyel
  async componentDidMount() {
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
  }

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
              <strong className="me-auto">Added!!!</strong>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="toast"
                aria-label="Close"
                onClick={() => this.setState({ enableToast: false })}
              ></button>
            </div>
            <div className="toast-body">
              Employee Details Added Successfully!!!.
            </div>
          </div>
        </div>
        <div className="row gx-4">
          <div className="col-lg-6 col-sm-12">
            <EmployeeTable employees={this.state.employees} />
          </div>
          <div className="col-lg-6 col-sm-12">
            <EmployeeCreate createEmployee={this.createEmployee} />
          </div>
        </div>
      </>
    );
  }
}

export default EmployeeDirectory;
