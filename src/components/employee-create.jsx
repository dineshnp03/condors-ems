import { Component } from "react";

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
    console.log(this.state.currentStatus);
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
      errors.push("First Name is not a valid one. Provide alphabets");
      isValid = false;
    }

    if (!lastName || !pattern.test(lastName)) {
      errors.push("Last Name is not a valid one. Provide alphabets");
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
          age: 20,
          dob: "",
          dateOfJoining: "",
          title: "",
          department: "",
          EmployeeType: "",
          currentStatus: true,
        });
      } else {
        alert("Please fill all the fields and provide valid data");
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
      <div>
        <h3>{employee ? "Update" : "Add"} Employee</h3>
        {errors.length > 0
          ? errors.map((error, index) => {
              return (
                <div key={index} className="alert alert-warning" role="alert">
                  {error}
                </div>
              );
            })
          : ""}

        <form
          name="employeeForm"
          onSubmit={this.handleAddEmployee}
          className="card p-3 my-3"
        >
          <div className="mb-3">
            <label className="form-label">First Name:</label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={firstName}
              onChange={this.handleDataChange}
              disabled={!!employee}
              placeholder="Enter First Name"
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Last Name:</label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Enter Last Name"
              className="form-control"
              value={lastName}
              onChange={this.handleDataChange}
              disabled={!!employee}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Date of Joining:</label>
            <input
              type="date"
              name="dob"
              id="dob"
              value={dob}
              onChange={this.handleDataChange}
              disabled={!!employee}
              className="form-control"
              max={new Date().toISOString().slice(0, 10)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Age:</label>
            <input
              disabled
              type="number"
              name="age"
              id="age"
              min={20}
              max={69}
              placeholder="Age"
              value={age}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Date of Joining:</label>
            <input
              type="date"
              name="dateOfJoining"
              id="dateOfJoining"
              value={dateOfJoining}
              onChange={this.handleDataChange}
              disabled={!!employee}
              className="form-control"
              max={new Date().toISOString().slice(0, 10)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Title:</label>
            <select
              name="title"
              id="title"
              className="form-select"
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
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Department:</label>
            <select
              value={department}
              onChange={this.handleDataChange}
              name="department"
              id="department"
              className="form-select"
              required
            >
              <option value="" disabled>
                Select Department
              </option>
              <option value="IT">IT</option>
              <option value="Marketing">Marketing</option>
              <option value="HR">HR</option>
              <option value="Engineering">Engineering</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Employee Type:</label>
            <select
              value={EmployeeType}
              onChange={this.handleDataChange}
              disabled={!!employee}
              name="EmployeeType"
              id="EmployeeType"
              className="form-select"
              required
            >
              <option value="" disabled>
                Select Employee Type
              </option>
              <option value="PartTime">PartTime</option>
              <option value="FullTime">FullTime</option>
              <option value="Contract">Contract</option>
              <option value="Seasonal">Seasonal</option>
            </select>
          </div>
          {employee && (
            <div className="mb-3">
              <label className="form-label">Current Status:</label>
              <select
                value={currentStatus}
                onChange={this.handleDataChange}
                name="currentStatus"
                id="currentStatus"
                className="form-select"
                required
              >
                <option value={true}>Working</option>
                <option value={false}>Retired</option>
              </select>
            </div>
          )}
          <div className="d-flex justify-content-center mb-3">
            <button type="submit" className="btn btn-dark ">
              {employee ? "Update" : "Add"} Employee
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default EmployeeCreate;
