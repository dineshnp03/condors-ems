import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";

const NavbarComponent = () => {
  return (
    <>
      {/* Navbar Section */}
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow mb-4">
        <Container>
          <Navbar.Brand
            as={Link}
            to="/"
            className="fw-bold text-uppercase d-flex align-items-center"
          >
            <img
              alt=""
              src="/assets/images/logo.png"
              width="90"
              height="90"
              className="d-inline-block align-top"
            />{" "}
            Condors EMS
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto float-end">
              <Nav.Link as={Link} to="/" className="px-3">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/list" className="px-3">
                List
              </Nav.Link>
              <Nav.Link as={Link} to="/addEmployee" className="px-3">
                Add Employee
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Render child routes */}
      <Container
        className="p-4 shadow rounded"
        style={{ backgroundColor: "#f9f9f9" }}
      >
        <Outlet />
      </Container>
    </>
  );
};

export default NavbarComponent;
