import { Component } from "react";

class EmployeeCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: "",
      lastName: "",
      age: 0,
      doj: "",
      title: "",
      department: "",
      empType: "",
      currentStatus: true, //retired = false, Working= true, hat when Employee is created the default value for CurrentStatus would be 1
    };
  }

  render() {
    return (
      <div className="my-5">
        <h1>Add an Employee</h1>
        <form className="card p-3 m-3">
          <div className="mb-3">
            <label className="form-label">First Name:</label>
            <input
              type="text"
              name="firstname"
              id="firstname"
              placeholder="Enter First Name"
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Last Name:</label>
            <input
              type="text"
              name="lastname"
              id="lastname"
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
              name="doj"
              id="doj"
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
              name="empType"
              id="empType"
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
          <button className="btn btn-primary">Add Employee</button>
        </form>
      </div>
    );
  }
}

export default EmployeeCreate;
