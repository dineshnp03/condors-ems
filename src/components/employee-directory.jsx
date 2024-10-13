import { Component } from "react";
import EmployeeTable from "./employee-table";
import EmployeeCreate from "./employee-create";
import EmployeeSearch from "./employee-search";

class EmployeeDirectory extends Component {
  render() {
    return (
      <div>
        <h1>Employee Directory</h1>
        <EmployeeTable />
        <EmployeeCreate />
      </div>
    );
  }
}

export default EmployeeDirectory;
