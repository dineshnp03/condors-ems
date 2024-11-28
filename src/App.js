// Group Members : 
// Dinesh Narasimhalu Punniyamoorthy
// Jemish Budheshkumar Surani
// Priyank Ghanshyambhai Padshala

import './App.css';
import { Routes, Route } from 'react-router-dom';
import Navbar from './routes/Navbar/navbar';
import Home from './routes/Home/home';
import List from './routes/List/list';
import AddEmployee from './routes/Add Employee/addEmployee';
import EmployeeDetail from './components/employee-detail';


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
     <Routes>
        <Route path='/' element={<Navbar />} >
          <Route index element={<Home />}/>
          <Route path='/list' element={<List />}>
            <Route path=':id' element={<EmployeeDetail/>} />
          </Route>
          <Route path='/addEmployee' element={<AddEmployee />}/>
          <Route path='/editEmployee/:id' element={<AddEmployee />}/>
        </Route>
      </Routes>
     </div>
    </div>
  );
}

export default App;
