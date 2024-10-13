import { Component } from "react";
import EmployeeTable from "./employee-table";
import EmployeeCreate from "./employee-create";

class EmployeeDirectory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: [] 
    };
  }

  async componentDidMount() {
    const query = `
      query {
        employeeList {
          id
          firstName
          lastName
          age
          dateOfJoining
          title
          department
          EmployeeType
          currentStatus
        }
      }
    `;

    try {
      const response = await fetch('/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.data && result.data.employeeList) {
        this.setState({ employees: result.data.employeeList });
      } else {
        console.error('Error: employeeList is undefined', result.errors || "No errors returned");
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  }

  render() {
    return (
      <div>
        <h1>Employee Directory</h1>
        <EmployeeTable employees={this.state.employees} />
        <EmployeeCreate onEmployeeCreated={this.handleEmployeeCreated} />
      </div>
    );
  }
}

export default EmployeeDirectory;
