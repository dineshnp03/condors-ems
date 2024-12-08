import { Component } from "react";
import { Form, Button, Alert, Card } from "react-bootstrap";

class EmployeeCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      age: "",
      dob: "",
      dateOfJoining: "",
      title: "",
      department: "",
      EmployeeType: "",
      currentStatus: true,
      errors: [],
      isValid: true,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.employee !== this.props.employee) {
      this.setFormState(this.props.employee);
    }
  }

  setFormState = (employee) => {
    this.setState({
      firstName: employee.firstName || "",
      lastName: employee.lastName || "",
      age: employee.age || "",
      dob: new Date(employee.dob).toISOString().slice(0, 10) || "",
      dateOfJoining:
        new Date(employee.dateOfJoining).toISOString().slice(0, 10) || "",
      title: employee.title || "",
      department: employee.department || "",
      EmployeeType: employee.EmployeeType || "",
      currentStatus: employee.currentStatus ?? true,
    });
  };

  handleDataChange = (e) => {
    if (e.target.name === "currentStatus") {
      this.setState({ currentStatus: JSON.parse(e.target.value) });
    } else if (e.target.name === "dob") {
      this.setState({
        dob: e.target.value,
        age: this.calculateAge(e.target.value),
      });
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  };

  calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      return age - 1;
    }
    return age;
  };

  handleAddEmployee = (e) => {
    e.preventDefault();
    const {
      firstName,
      lastName,
      age,
      dob,
      dateOfJoining,
      title,
      department,
      EmployeeType,
      currentStatus,
    } = this.state;
    const pattern = /^[a-zA-Zà-žÀ-Ž' -]{1,50}$/;
    let errors = [];
    let isValid = true;

    if (!firstName || !pattern.test(firstName)) {
      errors.push("First Name is not valid. Provide alphabets only.");
      isValid = false;
    }

    if (!lastName || !pattern.test(lastName)) {
      errors.push("Last Name is not valid. Provide alphabets only.");
      isValid = false;
    }
    this.setState({ errors, isValid }, () => {
      if (this.state.isValid) {
        const newEmployee = {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          age: parseInt(age),
          dob: new Date(dob).toISOString(),
          dateOfJoining: new Date(dateOfJoining).toISOString(),
          title,
          department,
          EmployeeType,
          currentStatus: currentStatus ?? true,
        };

        console.log(newEmployee);

        this.props.createEmployee(newEmployee);
        this.setState({
          firstName: "",
          lastName: "",
          age: "",
          dob: "",
          dateOfJoining: "",
          title: "",
          department: "",
          EmployeeType: "",
          currentStatus: true,
        });
      } else {
        alert("Please fill all the fields with valid data.");
      }
    });
  };

  render() {
    const {
      firstName,
      lastName,
      age,
      dob,
      dateOfJoining,
      title,
      department,
      EmployeeType,
      currentStatus,
      errors,
    } = this.state;
    const { employee } = this.props;
    return (
      <Card className="p-3 my-3">
        <h3>{employee ? "Update" : "Add"} Employee</h3>

        {errors.length > 0 &&
          errors.map((error, index) => (
            <Alert key={index} variant="warning">
              {error}
            </Alert>
          ))}

        <Form onSubmit={this.handleAddEmployee}>
          <Form.Group className="mb-3">
            <Form.Label>First Name:</Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              value={firstName}
              onChange={this.handleDataChange}
              disabled={!!employee}
              placeholder="Enter First Name"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Last Name:</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              value={lastName}
              onChange={this.handleDataChange}
              disabled={!!employee}
              placeholder="Enter Last Name"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date of Birth:</Form.Label>
            <Form.Control
              type="date"
              name="dob"
              value={dob}
              onChange={this.handleDataChange}
              disabled={!!employee}
              max={new Date(
                new Date().setFullYear(new Date().getFullYear() - 20)
              )
                .toISOString()
                .slice(0, 10)}
              min={new Date(
                new Date().setFullYear(new Date().getFullYear() - 70)
              )
                .toISOString()
                .slice(0, 10)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Age:</Form.Label>
            <Form.Control
              type="number"
              name="age"
              value={age}
              placeholder="Age"
              disabled
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date of Joining:</Form.Label>
            <Form.Control
              type="date"
              name="dateOfJoining"
              value={dateOfJoining}
              onChange={this.handleDataChange}
              disabled={!!employee}
              max={new Date().toISOString().slice(0, 10)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Title:</Form.Label>
            <Form.Select
              name="title"
              value={title}
              onChange={this.handleDataChange}
              required
            >
              <option value="" disabled>
                Select Title
              </option>
              <option value="Employee">Employee</option>
              <option value="Manager">Manager</option>
              <option value="Director">Director</option>
              <option value="VP">VP</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Department:</Form.Label>
            <Form.Select
              name="department"
              value={department}
              onChange={this.handleDataChange}
              required
            >
              <option value="" disabled>
                Select Department
              </option>
              <option value="IT">IT</option>
              <option value="Marketing">Marketing</option>
              <option value="HR">HR</option>
              <option value="Engineering">Engineering</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Employee Type:</Form.Label>
            <Form.Select
              name="EmployeeType"
              value={EmployeeType}
              onChange={this.handleDataChange}
              disabled={!!employee}
              required
            >
              <option value="" disabled>
                Select Employee Type
              </option>
              <option value="PartTime">PartTime</option>
              <option value="FullTime">FullTime</option>
              <option value="Contract">Contract</option>
              <option value="Seasonal">Seasonal</option>
            </Form.Select>
          </Form.Group>

          {employee && (
            <Form.Group className="mb-3">
              <Form.Label>Current Status:</Form.Label>
              <Form.Select
                name="currentStatus"
                value={currentStatus}
                onChange={this.handleDataChange}
                required
              >
                <option value={true}>Working</option>
                <option value={false}>Retired</option>
              </Form.Select>
            </Form.Group>
          )}

          <div className="d-flex justify-content-center">
            <Button type="submit" variant="dark">
              {employee ? "Update" : "Add"} Employee
            </Button>
          </div>
        </Form>
      </Card>
    );
  }
}

export default EmployeeCreate;
