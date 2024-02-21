import { id } from "ethers/lib/utils";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import ProgressBar from "react-bootstrap/ProgressBar";

const Votes = ({ contract, clicked, createVote }) => {
  const gateway = "https://gateway.pinata.cloud/";
  const [votes, setVotes] = useState([]);
  const [uri, setUri] = useState("ipfs/QmSj7RYy2WKpqYFMqGtmtxpx4QUnEg4Bfgdru2KfGccHo4");
  const [options, setOptions] = useState(5);
  const [endDate, setEndDate] = useState("02/05/2024");
  //const [clicked, setClicked] = useState(false);

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
      .then(() => alert("Success!"))
      .catch((error) => alert("Error: Cannot cast vote"), (error) => console.log(error.message));
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
      <h2 className="d-flex justify-content-center">Fan Vote</h2>
      {!clicked ? (
        <Button variant="success" onClick={createVote}>
            Load Fan Vote
        </Button>
      ) : (
        <p>Fan vote has been successfully loaded</p>
      )}
      <div className="m-4">
        {votes.map((vote) => (
          <Card key={vote.id} className="my-2">
            <Card.Header>{vote.description}</Card.Header>
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
    </div>
  );
};

export default Votes;