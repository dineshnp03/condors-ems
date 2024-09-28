import { Component } from "react";
import EmployeeTable from './employee-table';

class EmployeeDirectory extends Component {
    render() {
        return (
            <div>
                <h1>Employee Directory</h1>
                <EmployeeTable/>
            </div>
        );
    }
}

export default EmployeeDirectory;