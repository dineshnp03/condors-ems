import { Component } from "react";
import EmployeeTable from "../../components/employee-table";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, Form, Toast } from "react-bootstrap";

const withRouterParam = (Component) => {
  return (props) => (
    <Component
      {...props}
      param={useParams()}
      myloc={useLocation()}
      mynav={useNavigate()}
    />
  );
};

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
      enableToast: false,
      retirementFilter: false,
      toastMessage: {
        title: "",
        message: "",
      },
      employeeType: "",
    };
  }

  componentDidMount() {
    this.loadEmployees();
  }

  loadEmployees = async () => {
    const queryParam = new URLSearchParams(this.props.myloc?.search || "");
    const employeeType = queryParam.get("type") || "";
    this.setState({ employeeType });
    const query = `
    query {
      employeeList(type: "${employeeType}", retirementFilter: ${this.state.retirementFilter}) {
        id
        firstName
        lastName
        age
        dateOfJoining
        title
        department
        EmployeeType
        currentStatus
        retirementDetails {
          dateOfRetirement
          yearsLeft
          monthsLeft
          daysLeft
          isUpcoming
        }
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
        this.setState({
          employees: result.data.employeeList,
        });
      } else {
        this.setState({
          employees: [],
        });
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

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.myloc?.search !== this.props.myloc?.search) {
      this.loadEmployees();
    }

    if (prevState.retirementFilter !== this.state.retirementFilter) {
      this.loadEmployees();
    }

    if (prevState.enableToast !== this.state.enableToast) {
      setTimeout(() => {
        this.setState({
          enableToast: false,
        });
      }, 3000);
    }
  }

  toggleUpcomingRetirements = () => {
    this.setState((prevState) => ({
      retirementFilter: !prevState.retirementFilter,
    }));
  };

  filterEmployees = (event) => {
    const type = event.target.value;
    this.setState({ employeeType: type });
    this.props.mynav(`/list?type=${type}`);
  };

  render() {
    return (
      <>
        {/* Toast Notification */}
        <Toast
          show={this.state.enableToast}
          onClose={() => this.setState({ enableToast: false })}
          className="position-fixed top-0 end-0 m-3"
        >
          <Toast.Header>
            <strong className="me-auto">{this.state.toastMessage.title}</strong>
          </Toast.Header>
          <Toast.Body>{this.state.toastMessage.message}</Toast.Body>
        </Toast>

        <Card className="m-4 shadow">
          <Card.Header>
            <h4>Filter Options</h4>
          </Card.Header>
          <Card.Body>
            <div className="row gx-4 px-5 justify-content-between">
              <div className="my-3 col-sm-12 col-md-4">
                <label htmlFor="filterType" className="form-label">
                  Filter by Employee Type:
                </label>
                <Form.Select
                  id="filterType"
                  value={this.state.employeeType}
                  onChange={this.filterEmployees}
                >
                  <option value="">All Employees</option>
                  <option value="FullTime">Full-Time</option>
                  <option value="PartTime">Part-Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Seasonal">Seasonal</option>
                </Form.Select>
              </div>

              <div className="col-sm-12 col-md-6 my-3">
                <label htmlFor="retirementFileter" className="form-label">
                  Filter by Upcoming Retirement Employees:
                </label>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  label=""
                  defaultChecked={this.state.retirementFilter}
                  onChange={this.toggleUpcomingRetirements}
                />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card className="m-4 shadow">
          <Card.Header>
            <h4>Employee List</h4>
          </Card.Header>
          <Card.Body>
            <EmployeeTable
              deleteEmployee={this.deleteEmployee}
              employees={this.state.employees}
              retirementFilter={this.state.retirementFilter}
            />
          </Card.Body>
        </Card>
      </>
    );
  }
}

export default withRouterParam(List);
