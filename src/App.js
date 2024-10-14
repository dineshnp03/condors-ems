import './App.css';
import EmployeeDirectory from './components/employee-directory';


function App() {
  return (
    <div className="App">
    <nav className="navbar navbar-primary bg-dark mb-3">
          <div className="container-fluid  justify-content-center">
            <span className="navbar-brand mb-0 h1  fw-bold  text-light">
              Condors Employee Management System
              </span>
          </div>
        </nav>
     <div className="container-fluid p-4">
          <EmployeeDirectory />
     </div>
    </div>
  );
}

export default App;
