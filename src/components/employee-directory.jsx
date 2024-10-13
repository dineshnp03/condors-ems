import { Component } from "react";
import EmployeeTable from "./employee-table";
import EmployeeCreate from "./employee-create";
import EmployeeSearch from "./EmployeeSearch";

class EmployeeDirectory extends Component {

  constructor(props) {
    super(props);
    this.state = {
      employees: [], 
      filteredEmployees: [],  
    };
  }

   addEmployee = (newEmployee) => {
    const updatedEmployees = [...this.state.employees, newEmployee];
    this.setState({
      employees: updatedEmployees,
      filteredEmployees: updatedEmployees,
    });
  };

  searchEmployees = (filters) => {
    const filtered = this.state.employees.filter((emp) => {
      return (
        (filters.age ? emp.age === parseInt(filters.age) : true) &&
        (filters.department ? emp.department === filters.department : true) &&
        (filters.title ? emp.title === filters.title : true)
      );
    });
    this.setState({ filteredEmployees: filtered });
  };
  
  render() {
    return (
      <div>
        <h1>Employee Directory</h1>
        <EmployeeTable />
        <EmployeeCreate />
        <EmployeeSearch />
        <!-- <EmployeeSearch onSearch={this.searchEmployees} /> -->
        <!-- <EmployeeTable employees={this.state.filteredEmployees} /> -->
        <!-- <EmployeeCreate onCreate={this.addEmployee} /> -->
      </div>
    );
  }
}

export default EmployeeDirectory;
