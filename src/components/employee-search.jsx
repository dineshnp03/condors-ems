import { Component } from "react";

class EmployeeSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      age: "",
      department: "",
      title: "",
    };
  }

  handleSearch = () => {
    this.props.onSearch(this.state);  
  };

  render() {
    return (
      <div className="my-3">
        <h2>Search Employees</h2>
        <div className="mb-3">
          <label className="form-label">Age:</label>
          <input
            type="number"
            name="age"
            id="age"
            placeholder="Age"
            className="form-control"
            value={this.state.age}
            onChange={(e) => this.setState({ age: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Department:</label>
          <select
            name="department"
            id="department"
            className="form-select"
            value={this.state.department}
            onChange={(e) => this.setState({ department: e.target.value })}>
          
            <option value="">All Departments</option>
            <option value="IT">IT</option>
            <option value="Marketing">Marketing</option>
            <option value="HR">HR</option>
            <option value="Engineering">Engineering</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Title:</label>
          <select
            name="title"
            id="title"
            className="form-select"
            value={this.state.title}
            onChange={(e) => this.setState({ title: e.target.value })}>
          
            <option value="">All Titles</option>
            <option value="Employee">Employee</option>
            <option value="Manager">Manager</option>
            <option value="Director">Director</option>
            <option value="VP">VP</option>
          </select>
        </div>
        <button className="btn btn-primary" onClick={this.handleSearch}>
          Search
        </button>
      </div>
    );
  }
}

export default EmployeeSearch;
