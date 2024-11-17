import { Component } from "react";
import EmployeeCreate from "../../components/employee-create";
import { Navigate, useParams } from "react-router-dom";

const withParamsRoute = (Component) => {
  return (props) => <Component {...props} param={useParams()} />;
};
class AddEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enableToast: false, // added bootstrap toasts
      redirect: false,
      isEdit: false,
      employee: null,
    };
  }

  componentDidMount() {
    const { id } = this.props.param;
    if (id) {
      this.loadEmployeeDetails(id);
      console.log(this.state.enableToast);
      console.log(this.state.redirect);
    }
  }

  loadEmployeeDetails = async (id) => {
    const query = `
      query {
        employeeDetail(id: ${id}) {
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const detail = await response.json();

      if (detail.data.employeeDetail) {
        this.setState({
          employee: detail.data.employeeDetail,
          isEdit: true,
        });
      } else {
        this.setState({
          error: "Employee not found",
        });
      }
    } catch (error) {
      this.setState({ error: error.message });
      console.log(error.message);
    }
  };

  //  Employee creation function getting the newEmployee Data from the EmployeeCreate component
  createEmployee = (newEmployee) => {
    console.log(newEmployee);
    const addQuery = this.state.isEdit
      ? `
      mutation updateEmployee($id: Int!, $newEmployee: EmployeeInput!) {
        updateEmployee(id: $id, newEmployee: $newEmployee) {
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
    `
      : `
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

    const variables = this.state.isEdit
      ? { id: this.state.employee.id, newEmployee }
      : { newEmployee };

    fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: addQuery,
        variables: variables,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (
          this.state.isEdit
            ? data.data.updateEmployee
            : data.data.createEmployee
        ) {
          this.setState({
            enableToast: true,
          });
        }
      })
      .catch((error) => {
        console.log(`Error while inserting the employee details:`, error);
      });
  };

  componentDidUpdate(prevState, prevProps) {
    console.log(prevProps, prevState);
    if (prevProps.enableToast !== this.state.enableToast) {
      setTimeout(() => {
        this.setState({
          enableToast: false,
          redirect: true,
        });
      }, 3000);
    }
  }

  render() {
    if (this.state.redirect) {
      return <Navigate to="/list" />;
    }

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
                {this.state.isEdit ? "Updated" : "Added"}!!!
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
              Employee Details {this.state.isEdit ? "Updated" : "Added"}{" "}
              Successfully!!!.
            </div>
          </div>
        </div>
        <div className="row gx-4">
          <center>
            <div className="col-lg-6 col-sm-12">
              <EmployeeCreate
                employee={this.state.employee}
                createEmployee={this.createEmployee}
              />
            </div>
          </center>
        </div>
      </>
    );
  }
}

export default withParamsRoute(AddEmployee);
