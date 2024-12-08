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
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";


function App() {
  return (
    <div className="App">
   
     <div className="container-fluid m-0 gx-0">
     <Routes>
        <Route path='/' element={<Navbar />} >
          <Route index element={<Home />}/>
          <Route path='/list' element={<List />}/>
          <Route path='/viewEmployee/:id' element={<EmployeeDetail/>} />
          <Route path='/addEmployee' element={<AddEmployee />}/>
          <Route path='/editEmployee/:id' element={<AddEmployee />}/>
        </Route>
      </Routes>
     </div>
    </div>
  );
}

export default App;
