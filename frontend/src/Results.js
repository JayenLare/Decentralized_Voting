import React from "react";
import { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';

const Results = ({contract}) => {
  const [results, setResults] = useState([""]);
  //const [candidates] = useState(["how"]);

  useEffect(() => {
    if (!contract) return;

    const setResultData = async () => {
      // Call contract function to get results
      const candidates = await contract.getResults();

      // await contract
      // .getResults()
      // .then(() => alert("Success!"))
      // .catch((error) => alert("Error: "), (error) => console.log(error.message));

      //const candidates = ["test", "deh"];

      console.log(candidates);

      // Update state with results
      setResults(candidates);
    };

    setResultData();
    console.log("results");
    console.log(results);


  }, [contract]);


  return (
    <div>
      <h1 style={{textAlign: "center", marginTop: "20px"}}>Heisman Trophy Results</h1>
      <hr/>
      <h5 style={{textAlign: "center", marginTop: "20px"}}>The results will be displayed here after voting is complete</h5>
      <Table striped bordered size="sm">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
        {results.map((candidate, idx) => (
          <tr>
            <td key={idx}>{idx+1}</td>
            <td key={idx}>{candidate}</td>
          </tr>
        ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Results;