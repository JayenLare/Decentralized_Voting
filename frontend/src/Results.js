import React from "react";
import { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';

const Results = ({contract}) => {
  const [results, setResults] = useState([""]);
  //const [candidates] = useState([]);

  const endDate = new Date('2023-12-14');
  const currentDate = new Date();

  useEffect(() => {
    if (!contract) return;

    const setResultData = async () => {
      // Call contract function to get results
      //let candidates = [];
      //console.log(candidates); 
      const candidates = await contract.getResults();

      // await contract
      // .getResults()
      // .then(() => alert("Success!"))
      // .catch((error) => alert("Error: "), (error) => console.log(error.message));

      //const candidates = ["Jayden Daniels", "Michael Penix Jr.", "Bo Nix", "Marvin Harrison Jr.", "Jordan Travis", 
      //                    "Jalen Milroe", "Ollie Gordon", "Drake Maye", "JJ McCarthy", "Travis Hunter"];

      console.log(candidates);

      //await Promise.resolve(candidates);
      
      // Update state with results
      setResults(candidates);
      console.log(results);
    };

    setResultData();
    // console.log("test");
    // console.log(results);


  }, [contract]);


  return (
    <div className="m-4">
      <div style={{textAlign: "center"}}>
        <h1 style={{marginTop: "-5px"}}>Heisman Results</h1>
        <hr/>
        <h5 style={{marginTop: "15px"}}>Here the Heisman Trophy Award Results are displayed</h5>
        <p style={{marginTop: "5px", marginRight: "250px", marginLeft: "250px"}}> 
        After the completion of the Heisman ceremony, the final voting results will automatically be displayed below.
        All members and non-member can view the complete ranking of all the Heisman candidates. 
        </p>
      </div>
      { endDate > currentDate ? (
        <h6 style={{textAlign: "center", marginTop: "10px"}}>~ The results will be displayed after the Heisman ceremony ~</h6>
      ) : (
        <div style={{textAlign: "center", marginRight: "300px", marginLeft: "300px"}}>
          <h6 style={{textAlign: "center", marginTop: "10px", marginBottom: "20px"}}>~ 2023 Heisman Trophy Award Final Voting Results ~</h6>
          { results.length > 0 ? (   
          <Table striped bordered size="sm">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name (votes)</th>
              </tr>
            </thead>
            <tbody>
            {results.map((candidate, idx) => (
              <tr key={idx}>
                <td>{idx+1}</td>
                <td>{candidate}</td>
              </tr>
            ))}
            </tbody>
          </Table>
          ) : (
            <Table striped bordered size="sm">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>TBD...</td>
              </tr>
            </tbody>
          </Table>
          )}
        </div>
      )}
    </div>
  );
}

export default Results;