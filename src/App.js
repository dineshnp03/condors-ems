import './App.css';
import EmployeeDirectory from './components/employee-directory';

function App() {
  return (
    <div className="App">
     <h1 className='text-center'>Employee Management Sysem</h1>
     <div className="container">
      <div className="row">
          <EmployeeDirectory />
      </div>
     </div>
    </div>
  );
}

export default App;
