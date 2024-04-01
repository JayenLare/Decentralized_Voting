import React from "react";
import { useState, useEffect } from "react";
import { Button, Card } from "react-bootstrap";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';

const History = ({contract}) => {
    const gateway = "https://gateway.pinata.cloud/";
    const [year, setYear] = useState(0);
    const [results, setResults] = useState("");
    const [description, setDescription] = useState("");
    const [finalists, setFinalists] = useState("");
    const [clicked, setClicked] = useState(false);
    //const clicked = false;

    useEffect(() => {
        if (!contract) return;

        //gethistory();
    }, [contract]);

    const gethistory = async () => {
        //console.log(year);
        const promise = contract.getHistory(year).then(async (uriData) => {
            const uri = uriData;
            if (!uri) return;

            try {
                await fetch(gateway + uri)
                  .then((result) => result.json())
                  .then((data) => {
                    // description = data.description;
                    // names = data.names;
                    setDescription(data.description);
                    setFinalists(data.finalists);
                });
            } catch {}
        });
        await promise;
        setClicked(true);
        //console.log(year);
    };

    // function onButtonClick (){
    //     //setYear(2022);
    //     gethistory();
    // }

  return (
    <div className="m-4">
      <div style={{textAlign: "center", marginBottom: "15px"}}>
        <h1 style={{marginTop: "-5px"}}>Heisman History</h1>
        <hr/>
        <h5 style={{marginTop: "15px", marginBottom: "15px"}}>Here members can learn more about the Heisman Trophy's history and view results from previous years</h5>
        <p style={{marginTop: "5px", marginRight: "250px", marginLeft: "250px"}}> 
        The Heisman Trophy, named after former college football coach John W. Heisman, was first awarded in 1935 by the Downtown Athletic Club in New York City.
        It is presented annually by the Heisman Trophy Trust to the most outstanding player in college football. The trophy has become one of the most 
        prestigious awards in American sports, symbolizing excellence and achievement in collegiate athletics. Over the years, recipients of the Heisman Trophy 
        have gone on to have successful careers and have left a lasting legacy on the sport. There has been 85 winners of the Heisman Trophy
        since its creation. Below you can look back at some of the recent Heisman winners and finalists.
        </p>
        <h6 style={{marginTop: "-5px"}}>~ Select which years Heisman results you would like to view ~</h6>
      </div>
      <div style={{display:"flex"}}>
        <div style={{flex: "50%", paddingRight: "15px", paddingLeft: "475px"}}>
            <Form.Select
                value={year}
                onChange={(e) => setYear(e.target.value)}
            >
                <option value={0}>Select Year</option>
                <option value={2022}>2022</option>
                <option value={2021}>2021</option>
                <option value={2020}>2020</option>
                <option value={2019}>2019</option>
                <option value={2018}>2018</option>
            </Form.Select>
        </div>
        <div style={{flex: "50%", paddingLeft: "15px"}}>
            <Button variant="primary" onClick={gethistory}>
                Load Results
            </Button>
        </div>
      </div>
      { (year != 0 && clicked) && (
        <div style={{textAlign: "center", marginTop: "30px", 
                    marginRight: "200px", marginLeft: "200px"}}>
          <Table striped bordered size="sm">
            <thead>
              <tr>
                <th colSpan="3" style={{fontSize: "20px"}}>{description}</th>
              </tr>
              <tr>
                <th>Rank</th>
                <th>Name - School (POS)</th>
              </tr>
            </thead>
            <tbody>
            {finalists.map((finalist, idx) => (
              <tr key={idx}>
                <td>{idx+1}</td>
                <td>{finalist}</td>
              </tr>
            ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}

{/* <Button variant="primary" onClick={gethistory}>
Get History
</Button>
{flag == true && (
 <p>{results.description}</p>
)} */}


{/* <DropdownButton id="dropdown-item-button" variant="primary" title="Select Year">
<Dropdown.Item 
    as="button" 
    value="2022"
    onClick={onButtonClick}
>2022</Dropdown.Item>
<Dropdown.Item as="button" onClick={gethistory}>2021</Dropdown.Item>
<Dropdown.Item as="button" onClick={gethistory}>2021</Dropdown.Item>
</DropdownButton> */}

export default History;