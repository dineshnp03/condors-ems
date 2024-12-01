import React, { Component } from "react";
import { useParams } from "react-router-dom";

const withParamsRoute = (Component) => {
  return (props) => <Component {...props} param={useParams()} />;
};

class EmployeeDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employee: null,
      error: null,
    };
  }

  componentDidMount() {
    this.loadEmployeeDetail();
  }

  loadEmployeeDetail = async () => {
    const { id } = this.props.param;

    try {
      const query = `
        query{
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
         retirementDetails {
            dateOfRetirement
            yearsLeft
            monthsLeft
            daysLeft
            isUpcoming
          } }}`;

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

  componentDidUpdate(prevProps) {
    if (prevProps.param.id !== this.props.param.id) {
      this.loadEmployeeDetail();
    }
  }

  render() {
    const { employee, error } = this.state;

    if (error) {
      return <h3 className="warning"> {error} </h3>;
    }
    return (
      <div className="container d-flex  flex-column px-5">
        <h2>Employee Detail</h2>
        {employee && (
          <div>
            <p>
              <strong>Name:</strong> {employee.firstName} {employee.lastName}
            </p>
            <p>
              <strong>Age:</strong> {employee.age}
            </p>
            <p>
              <strong>Date of Joining:</strong>{" "}
              {employee.dateOfJoining
                ? new Date(employee.dateOfJoining).toLocaleDateString("en-CA")
                : ""}
            </p>
            <p>
              <strong>Title:</strong> {employee.title}
            </p>
            <p>
              <strong>Department:</strong> {employee.department}
            </p>
            <p>
              <strong>Employee Type:</strong> {employee.EmployeeType}
            </p>
            <p>
              <strong>Current Status:</strong>{" "}
              {employee.currentStatus ? "Working" : "Retired"}
            </p>
            {employee.currentStatus && (
              <>
                <p>
                  <strong>Upcoming Retirement Date:</strong>{" "}
                  {employee.retirementDetails &&
                  employee.retirementDetails.dateOfRetirement
                    ? new Date(
                        employee.retirementDetails.dateOfRetirement
                      ).toLocaleDateString("en-CA")
                    : ""}
                </p>
                <p>
                  <strong>Upcoming Retirement Duration:</strong>{" "}
                  {employee.retirementDetails &&
                  employee.retirementDetails.dateOfRetirement
                    ? `${employee.retirementDetails.yearsLeft}, ${employee.retirementDetails.monthsLeft}, ${employee.retirementDetails.daysLeft}`
                    : ""}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default withParamsRoute(EmployeeDetail);
