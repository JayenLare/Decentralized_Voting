import React from "react";
import { Button, Card } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { useState } from "react";

const CastBallot = ({contract}) => {
  const [choice1, setChoice1] = useState("");
  const [choice2, setChoice2] = useState("");
  const [choice3, setChoice3] = useState("");

  const castballot = async () => {
    if (!contract) {
      alert("Error: Not connected to Metamask");
      return;
    }

    await contract
      .castBallot(choice1, choice2, choice3)
      .then(() => alert("Success!\nYour ballot has been submitted"))
      .catch((error) => alert("Error: Cannot cast ballot"), (error) => console.log(error.message));
  };

  return (
    <div className="m-4">
      <div style={{textAlign: "center", marginBottom: "30px"}}>
        <h1 style={{marginTop: "-5px"}}>Cast Ballot</h1>
        <hr/>
        <h5 style={{marginTop: "15px"}}>Here eligible members can cast their Heisman ballot</h5>
        <p style={{marginTop: "5px", marginRight: "250px", marginLeft: "250px"}}> 
        Select media members and previous Heisman winners can vote for their top three choices for this years Heisman
        Trophy Award. Ballots can be filled out and cast anytime before voting deadline. Each voter can cast 
        a maximum of one ballot. Be sure to fill out all three choices with the player's first and last name. All 
        ballots are undisclosed until the Heisman ceremony, where the results will be announced. 
        </p>
        <h6 style={{marginTop: "-5px"}}>~ Cast your ballot below ~</h6>
      </div>
      <Card>
      <Card.Header as="h6">Heisman Trophy Award Ballot</Card.Header>
        <Card.Body>
          <Form className="m-2">
            <Form.Group className="m-2">
              <label htmlFor="choice1">Choice 1</label>
              <Form.Control
                type="text"
                name="choice1"
                placeholder="Enter Player's First and Last Name"
                value={choice1}
                onChange={(e) => setChoice1(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="m-2">
              <label htmlFor="choice2">Choice 2</label>
              <Form.Control
                type="text"
                name="choice2"
                placeholder="Enter Player's First and Last Name"
                value={choice2}
                onChange={(e) => setChoice2(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="m-2">
              <label htmlFor="choice3">Choice 3</label>
              <Form.Control
                type="text"
                name="choice3"
                placeholder="Enter Player's First and Last Name"
                value={choice3}
                onChange={(e) => setChoice3(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="m-2 mt-4">
              <Button variant="primary" onClick={castballot}>
                Cast Ballot
              </Button> 
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default CastBallot;