import {Container, Navbar} from "react-bootstrap";


const Nav = () => {
  return (
    <Navbar className="bg-light shadow">
      <Container>
        <Navbar.Brand href="/">
          <img
            src={process.env.PUBLIC_URL + '/logo.png'}
            alt="logo"
          />
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default Nav;
