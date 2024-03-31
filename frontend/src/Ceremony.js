import React from "react";
import { useState } from "react";
import { Button, Card } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const Ceremony = ({ contract }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");

  const ceremonyinviterequest = async () => {
    if (!contract) {
      alert("Error: Not connected to Metamask");
      return;
    }

    await contract
      .ceremonyInviteRequest(name, email, address, city, state, zip)
      .then(() => alert("Success!\nYour request has been submitted"))
      .catch((error) => alert("Error: Cannot submit request"), (error) => console.log(error.message));
  };

  return (
    <div className="m-4">
      <div style={{textAlign: "center", marginBottom: "10px"}}>
        <h1 style={{marginTop: "-5px"}}>Heisman Ceremony</h1>
        <hr/>
        <h5 style={{marginTop: "15px"}}>Here eligible members can request to attend the Heisman Ceremony</h5>
        <p style={{marginTop: "5px", marginRight: "250px", marginLeft: "250px"}}> 
        The Heisman Award ceremony is a prestigious event in which the 89th Heisman Trophy winner will be crowned. The top 4 
        finalist in Heisman voting will be invited to the ceremony and honored during the event. The ceremony will take place at 
        the Jazz at Lincoln Center's Appel Room in New York City on December 14th, 2024 at 8:00 pm EST. It will be shown live on ESPN.
        Media members, previous Heisman winners and select fans can request to attend this years Heisman Trophy Award ceremony. 
        If approved you will be added to the attendees list, and will be provided more details at a later date.
        </p>
        <h6 style={{marginTop: "-5px"}}>~ Please fill out the form below to request an invitation to the Heisman ceremony ~</h6>
      </div>
      <div style={{marginTop: "10px", marginRight: "100px", marginLeft: "100px"}}>
        <Card className="m-4">
          <Card.Header as="h6">Heisman Ceremony Request Form</Card.Header>
          <Card.Body>
            <Form>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Name</Form.Label>
                <Form.Control 
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Email</Form.Label>
                <Form.Control 
                  type="text"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
            </Row>

            <Form.Group className="mb-3" controlId="formGridAddress1">
              <Form.Label>Address</Form.Label>
              <Form.Control 
                  type="text"
                  name="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
            </Form.Group>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridCity">
              <Form.Label>City</Form.Label>
              <Form.Control 
                  type="text"
                  name="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>State</Form.Label>
                <Form.Control 
                  type="text"
                  name="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridZip">
                <Form.Label>Zip</Form.Label>
                <Form.Control 
                  type="text"
                  name="zip"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                />
              </Form.Group>
            </Row>

            <Button variant="primary" type="submit" onClick={ceremonyinviterequest}>
              Submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <br></br>
      <br></br>
      </div>
    </div>
  );
}

export default Ceremony;