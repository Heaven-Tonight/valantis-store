import {Container, Navbar} from "react-bootstrap";


const Nav = () => {
  return (
    <Navbar className="bg-light shadow">
      <Container>
        <Navbar.Brand href="#">
          <img
            src='/logo.png'
            alt="logo"
          />
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default Nav;
