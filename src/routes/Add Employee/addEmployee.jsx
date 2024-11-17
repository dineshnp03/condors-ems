import { Component } from "react";
import EmployeeCreate from "../../components/employee-create";

class AddEmployee extends Component {
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
          <center>
            <div className="col-lg-6 col-sm-12">
            <EmployeeCreate createEmployee={this.createEmployee} />
            </div>
          </center>
        </div>
      </>
    );
  }
}

export default AddEmployee;
