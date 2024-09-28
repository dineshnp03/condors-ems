import './App.css';
import EmployeeDirectory from './components/employee-directory';
import EmployeeTable from './components/employee-table';

function App() {
  return (
    <div className="App">
     <h1 className='text-center'>Employee Management Sysem</h1>
     <div className="container">
      <div className="row">
          <EmployeeDirectory />
      </div>
      <div>
        <EmployeeTable/>
      </div>
     </div>
    </div>
  );
}

export default App;
