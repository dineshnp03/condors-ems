// import { Outlet, Link } from 'react-router-dom'

// const Navbar = () => {
//     return(
//         <div>
//             <Link to='/'>Home</Link>
//             {' | '}
//             <Link to='/list'>List</Link>
//             {' | '}
//             <Link to='/addEmployee'>Add Employee</Link>
//             <Outlet />
//         </div>
//     );
// }

// export default Navbar;

import { Outlet, Link } from "react-router-dom";

const Navbar = () => {
  const navStyle = {
    padding: "10px",
    backgroundColor: "#f0f0f0",
    borderBottom: "1px solid #ccc",
  };

  const linkStyle = {
    margin: "0 10px",
    textDecoration: "none",
    color: "#333",
  };

  const linkHoverStyle = {
    ...linkStyle,
    color: "#007bff",
  };

  return (
    <>
      <div style={navStyle}>
        <Link
          to="/"
          style={linkStyle}
          onMouseOver={(e) =>
            (e.currentTarget.style.color = linkHoverStyle.color)
          }
          onMouseOut={(e) => (e.currentTarget.style.color = linkStyle.color)}
        >
          Home
        </Link>
        {" | "}
        <Link
          to="/list"
          style={linkStyle}
          onMouseOver={(e) =>
            (e.currentTarget.style.color = linkHoverStyle.color)
          }
          onMouseOut={(e) => (e.currentTarget.style.color = linkStyle.color)}
        >
          List
        </Link>
        {" | "}
        <Link
          to="/addEmployee"
          style={linkStyle}
          onMouseOver={(e) =>
            (e.currentTarget.style.color = linkHoverStyle.color)
          }
          onMouseOut={(e) => (e.currentTarget.style.color = linkStyle.color)}
        >
          Add Employee
        </Link>
      </div>
      <Outlet />
    </>
  );
};

export default Navbar;
