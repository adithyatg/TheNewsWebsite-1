import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

// import { Link } from "react-router-dom";

function NavBar({ logOut }) {
  return (
    <Navbar bg="dark" expand="lg" variant = 'dark'>
      <Container fluid>
        <Navbar.Brand href="#">The News Site</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0 ml-auto"
            style={{ maxHeight: "100px" }}
            navbarScroll 
          >
            <Nav.Link href="/login">Login</Nav.Link>
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/head">Headlines</Nav.Link>
            <NavDropdown title="Categories" id="navbarScrollingDropdown">
              <NavDropdown.Item href='/head/business' >Business</NavDropdown.Item>
              <NavDropdown.Item href='/head/sports' >Sports</NavDropdown.Item>
              <NavDropdown.Item href='/head/entertainment' >Entertainment</NavDropdown.Item>
              <NavDropdown.Item href='/head/health' >Health</NavDropdown.Item>
              <NavDropdown.Item href='/head/tech' >Technology</NavDropdown.Item>
              <NavDropdown.Item href='/head/sci' >Science</NavDropdown.Item>

              {/* <NavDropdown.Item href="#action4">
                Another action
              </NavDropdown.Item> */}
              <NavDropdown.Divider />
              {/* <NavDropdown.Item href="#action5">
                Something else here
              </NavDropdown.Item> */}
            </NavDropdown>
            <Nav.Link href="#" disabled>
              Link
            </Nav.Link>
          </Nav>
          <Form className="d-flex">
            <Form.Control 
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
            <Button variant="outline-danger" style={{marginLeft:'5px'}} onClick={logOut} >Logout</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
