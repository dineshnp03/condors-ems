import React, { Component } from "react";
import { useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

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
      <Container className="py-5">
        <h2 className="mb-3">Employee Detail</h2>
        {employee && (
          <>
            <Row>
              <Col xs={12} lg={4} md={6}>
                <p>
                  <strong>Employee First Name:</strong>
                </p>
              </Col>
              <Col xs={12} lg={4} md={6}>
                <p>{employee.firstName}</p>
              </Col>
            </Row>
            <Row>
              <Col xs={12} lg={4} md={6}>
                <p>
                  <strong>Employee Last Name:</strong>
                </p>
              </Col>

              <Col xs={12} lg={4} md={6}>
                <p>{employee.lastName}</p>
              </Col>
            </Row>
            <Row>
              <Col xs={12} lg={4} md={6}>
                <p>
                  <strong>Age:</strong>
                </p>
              </Col>

              <Col xs={12} lg={4} md={6}>
                <p>{employee.age}</p>
              </Col>
            </Row>
            <Row>
              <Col xs={12} lg={4} md={6}>
                <p>
                  <strong>Date of Joining:</strong>
                </p>
              </Col>

              <Col xs={12} lg={4} md={6}>
                <p>
                  {employee.dateOfJoining
                    ? new Date(employee.dateOfJoining).toLocaleDateString(
                        "en-CA"
                      )
                    : ""}
                </p>
              </Col>
            </Row>
            <Row>
              <Col xs={12} lg={4} md={6}>
                <p>
                  <strong>Title:</strong>{" "}
                </p>
              </Col>

              <Col xs={12} lg={4} md={6}>
                <p>{employee.title}</p>
              </Col>
            </Row>
            <Row>
              <Col xs={12} lg={4} md={6}>
                <p>
                  <strong>Department:</strong>{" "}
                </p>
              </Col>

              <Col xs={12} lg={4} md={6}>
                <p>{employee.department}</p>
              </Col>
            </Row>
            <Row>
              <Col xs={12} lg={4} md={6}>
                <p>
                  <strong>Employee Type:</strong>{" "}
                </p>
              </Col>

              <Col xs={12} lg={4} md={6}>
                <p>{employee.EmployeeType}</p>
              </Col>
            </Row>
            <Row>
              <Col xs={12} lg={4} md={6}>
                <p>
                  <strong>Current Status:</strong>{" "}
                </p>
              </Col>

              <Col xs={12} lg={4} md={6}>
                <p>{employee.currentStatus ? "Working" : "Retired"}</p>
              </Col>
            </Row>

            {employee.currentStatus && (
              <>
                <Row>
                  <Col xs={12} lg={4} md={6}>
                    <p>
                      <strong>Upcoming Retirement Date:</strong>{" "}
                    </p>
                  </Col>

                  <Col xs={12} lg={4} md={6}>
                    <p>
                      {employee.retirementDetails &&
                      employee.retirementDetails.dateOfRetirement
                        ? new Date(
                            employee.retirementDetails.dateOfRetirement
                          ).toLocaleDateString("en-CA")
                        : ""}
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} lg={4} md={6}>
                    <p>
                      <strong>Upcoming Retirement Duration:</strong>{" "}
                    </p>
                  </Col>

                  <Col xs={12} lg={4} md={6}>
                    <p>
                      {employee.retirementDetails &&
                      employee.retirementDetails.dateOfRetirement
                        ? `${employee.retirementDetails.yearsLeft}, ${employee.retirementDetails.monthsLeft}, ${employee.retirementDetails.daysLeft}`
                        : ""}
                    </p>
                  </Col>
                </Row>
              </>
            )}
          </>
        )}
      </Container>
    );
  }
}

export default withParamsRoute(EmployeeDetail);
