import { id } from "ethers/lib/utils";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import ProgressBar from "react-bootstrap/ProgressBar";

const Votes = ({ contract, clicked, createVote }) => {
  const gateway = "https://gateway.pinata.cloud/";
  const [votes, setVotes] = useState([]);
  // const [uri, setUri] = useState("ipfs/QmSj7RYy2WKpqYFMqGtmtxpx4QUnEg4Bfgdru2KfGccHo4");
  // const [options, setOptions] = useState(5);
  // const [endDate, setEndDate] = useState("02/05/2024");

  useEffect(() => {
    if (!contract) return;

    const filter = contract.filters.VoteCreated();
    contract
      .queryFilter(filter)
      .then((result) => {
        setVotesData(result);
      })
      .catch((error) => alert("Error: Cannot get vote data"), (error) => console.log(error));
  }, [contract]);


  const votePressed = async (id, optionIdx) => {
    await contract
      .vote(id, optionIdx)
      .then(() => alert("Success!\nPlease wait a few seconds for your vote to process then refresh the page"))
      .catch((error) => alert("Error: Only fans can cast a vote"), (error) => console.log(error.message));
  };

  const setVotesData = async (votes) => {
    const promises = [];
    const newVotes = [];
    for (const vote of votes) {
      const { owner, voteId, createdAt, endTime } = vote.args;
      const promise = contract.getVote(voteId).then(async (voteData) => {
        const uri = voteData[0];
        if (!uri) return;

        const currentVotes = voteData[2];
        const currentVotesNumbers = currentVotes.map((val) => val.toNumber());

        const newVote = {
          id: voteId.toNumber(),
          owner: owner,
          createdAt: createdAt.toNumber(),
          endTime: endTime.toNumber(),
          totalVotes: currentVotesNumbers.reduce(
            (sum, value) => sum + value,
            0
          ),
          votes: currentVotesNumbers,
        };

        try {
          await fetch(gateway + uri)
            .then((result) => result.json())
            .then((data) => {
              newVote.description = data.description;
              newVote.options = data.options;
              newVotes.push(newVote);
            });
        } catch {}
      });
      promises.push(promise);
    }

    await Promise.all(promises);
    setVotes(newVotes);
  };

  return (
    <div className="m-4">
      <h1 style={{textAlign: "center", marginTop: "-5px"}}>Fan Vote</h1>
      <hr/>
      <h5 style={{textAlign: "center", marginTop: "15px"}}>Here fans can vote for their favorite Heisman candidate</h5>
      <p style={{textAlign: "center", marginTop: "5px", marginRight: "250px", marginLeft: "250px",}}> 
      Fans get the choice of any of the current top 10 Heisman candidates. When voting is complete,
      the top 3 in the fan vote poll count towards one Heisman ballot. All users can view the fan poll, but only fans can cast a vote.
      </p>
      <div style={{textAlign: "center", marginTop: "-5px"}}>
      {!clicked ? (
        <div>
          <h6 style={{marginBottom: "15px"}}>~To access the fan voting poll please click the button below~</h6>
          <Button variant="primary" onClick={createVote}>
              Load Fan Vote
          </Button>
        </div>
      ) : (
        <h6>~The fan vote poll has been successfully loaded~</h6>
      )}
      </div>
      <div className="m-4">
        {votes.map((vote) => (
          <Card key={vote.id}>
            <Card.Header as="h6">{vote.description}</Card.Header>
            <Card.Body>
              {vote.options.map((option, idx) => (
                <div className="mt-1" key={Math.random() + idx}>
                  <p>
                    {option}:{" "}
                    {(vote.votes[idx] / Math.max(1, vote.totalVotes)) * 100}%
                  </p>
                  <div className="d-flex w-100 align-items-center">
                    <ProgressBar
                      now={(vote.votes[idx] / Math.max(1, vote.totalVotes)) * 100}
                      label={`${vote.votes[idx]}`}
                      className="w-100 me-2"
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        votePressed(vote.id, idx);
                      }}
                      variant="dark"
                    >
                      Vote
                    </Button>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        ))}
      </div>
      <br></br>
      <br></br>
    </div>
  );
};

export default Votes;