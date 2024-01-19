import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

const NavbarTop = ({ connect, connected, becomeMember, joinAsFan, joinAsMedia, joinAsWinner, isMember }) => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="black" variant="dark">
      <Container fluid>
        <Navbar.Brand href="/">Home</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link href="/votes">Votes</Nav.Link>
            <Nav.Link href="/create-vote">Create Vote</Nav.Link>
            <Nav.Link href="/results">Results</Nav.Link>
            <Nav.Link href="/ceremony">Ceremony</Nav.Link>
            <Nav.Link href="/info">About Heisman</Nav.Link>
          </Nav>
          <Nav>
            {!connected ? (
              <Button onClick={connect}>Connect to Metamask</Button>
            ) : (
              <DropdownButton id="dropdown-item-button" variant="success" title="Membership Options">
                <Dropdown.Item as="button" onClick={joinAsFan}>Fan</Dropdown.Item>
                <Dropdown.Item as="button" onClick={joinAsMedia}>Media</Dropdown.Item>
                <Dropdown.Item as="button" onClick={joinAsWinner}>Previous Winner</Dropdown.Item>
              </DropdownButton>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarTop;


/*
{!isMember && connected &&(
  <DropdownButton id="dropdown-item-button" variant="success" title="Become Member">
    <Dropdown.Item as="button" onClick={becomeMember}>Fan</Dropdown.Item>
    <Dropdown.Item as="button" onClick={becomeMember}>Media</Dropdown.Item>
    <Dropdown.Item as="button" onClick={becomeMember}>Previous Winner</Dropdown.Item>
  </DropdownButton>
  )}
  */