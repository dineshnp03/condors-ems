const { Component } = require("react");

class EmployeeTable extends Component{
    render(){
        return(
            <div>
                <table className="emp-table">
                    <thead>
                        <tr>
                            <th>FristName</th>
                            <th>LastName</th>
                            <th>Age</th>
                            <th>DateOfJoining</th>
                            <th>Title</th>
                            <th>Department</th>
                            <th>EmployeeType</th>
                            <th>CurrentStatus</th>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </div>
        )
    }
}

export default EmployeeTable;