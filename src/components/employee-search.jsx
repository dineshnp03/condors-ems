import { Component } from "react";

class EmployeeSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
    };
  }

  render() {
    return (
      <div>
        <h1>Search Employee</h1>
      </div>
    );
  }
}

export default EmployeeSearch;
