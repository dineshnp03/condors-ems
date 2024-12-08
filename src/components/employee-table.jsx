import { Component } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

class EmployeeTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      employee: null,
      alert: {
        show: false,
        message: "",
        variant: "",
      },
    };
  }

  handleClose = () => {
    this.setState({
      show: false,
    });
  };

  handleDelete = (employee) => {
    if (employee.currentStatus) {
      this.setState({
        alert: {
          show: true,
          message:
            "Employee is currently working, Cannot delete a working Employee",
          variant: "danger",
        },
      });
    } else {
      this.setState(
        {
          show: true,
          employee,
        },
        () => {
          console.log(this.state.employee);
        }
      );
    }
  };

  confirmDelete = () => {
    this.props.deleteEmployee(this.state.employee.id);
    this.setState({
      show: false,
    });
  };

  componentDidUpdate() {
    if (this.state.alert.show) {
      setTimeout(() => {
        this.setState({
          alert: {
            show: false,
          },
        });
      }, 3000);
    }
  }

  render() {
    const { employees, retirementFilter } = this.props;

    return (
      <>
        {this.state.alert.show ? (
          <div
            className={`alert alert-${this.state.alert.variant}`}
            role="alert"
          >
            <strong>Warning!</strong> {this.state.alert.message}
          </div>
        ) : (
          ""
        )}
        <div>
          <h3 className="mb-3">Employee Directory</h3>
          <Table responsive striped bordered condensed hover>
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
                {retirementFilter && <th>Upcoming Retirement Date</th>}
                <th>Actions</th>
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
                    {retirementFilter && (
                      <td>
                        {employee.retirementDetails?.isUpcoming
                          ? new Date(
                              employee.retirementDetails.dateOfRetirement
                            ).toLocaleDateString("en-CA")
                          : "N/A"}
                      </td>
                    )}
                    <td>
                      <Link
                        className="text-decoration-none text-reset"
                        to={`/editEmployee/${employee.id}`}
                      >
                        <Button variant="primary"><i className="bi bi-pencil-square"></i></Button>
                      </Link>{" "}
                      <Link
                        className="text-decoration-none text-reset"
                        to={`/viewEmployee/${employee.id}`}
                      >
                        <Button variant="secondary"><i className="bi bi-eye"></i></Button>
                      </Link>{" "}
                      <Button
                        variant="danger"
                        onClick={() => this.handleDelete(employee)}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>{" "}
                    </td>
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
          </Table>
        </div>
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.state.show}
          onHide={this.handleClose}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Are you Sure?
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you wanna delete this Employee</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="me-4"
              variant="danger"
              onClick={this.confirmDelete}
            >
              Confirm
            </Button>
            <Button variant="default" onClick={this.handleClose}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default EmployeeTable;
