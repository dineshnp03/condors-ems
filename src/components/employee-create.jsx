import { Component } from "react";

class EmployeeCreate extends Component {
  // constructor(props) {
  //   super(props);
  // }
  errors = [];
  isValid = true;
  handleAddEmployee = (e) => {
    e.preventDefault();
    const formData = document.forms.employeeForm;
    const pattern = /^[a-zA-Zà-žÀ-Ž' -]{1,50}$/;
    if (!formData.firstName.value || !pattern.test(formData.firstName.value)) {
      this.errors.push("First Name is not a valid one. Provide alphabets");
      this.isValid = false;
    }
    if (!formData.lastName.value || !pattern.test(formData.lastName.value)) {
      this.errors.push("Last Name is not a valid one. Provide alphabets");
      this.isValid = false;
    }
    console.log(this.isValid, this.errors);
    if (this.isValid) {
      const newEmployee = {
        firstName: formData.firstName.value.trim(),
        lastName: formData.lastName.value.trim(),
        age: parseInt(formData.age.value),
        dateOfJoining: new Date(formData.dateOfJoining.value).toISOString(),
        title: formData.title.value,
        department: formData.department.value,
        EmployeeType: formData.EmployeeType.value,
        currentStatus: true, // Whenever we are creating new employee the current Status will be true as it is considered as working.
      };

      this.props.createEmployee(newEmployee);
      document.forms.employeeForm.reset();
    } else {
      alert("Please fill all the fields and provide valid data");
    }
  };

  render() {
    return (
      <div className="">
        <h3>Add an Employee</h3>
        {this.errors.length > 0
          ? this.errors.map((error, index) => {
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
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Age:</label>
            <input
              type="number"
              name="age"
              id="age"
              min={20}
              max={70}
              placeholder="Age"
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
              className="form-control"
              max={new Date().toISOString().slice(0, 10)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Title:</label>
            <select
              defaultValue={""}
              name="title"
              id="title"
              className="form-select"
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
              defaultValue={""}
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
              defaultValue={""}
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
          <div className="d-flex justify-content-center mb-3">
            <button type="submit" className="btn btn-dark ">
              Add Employee
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default EmployeeCreate;
