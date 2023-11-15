import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import CreateVote from "./CreateVotes";
import Votes from "./Votes";
import Navbar from "./Navbar";
import Footer from "./Footer.js";
import Results from "./Results.js";
import { useState, useEffect } from "react";
import { connect, getContract } from "./contract";

function App() {
  const [contract, setContract] = useState(null);
  const [connected, setConnected] = useState(false);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
      if (accounts.length > 0) {
        handleInit();
      } else setConnected(false);
    });
  }, []);

  const handleInit = () => {
    setConnected(true);
    getContract().then(({ contract, signer }) => {
      setContract(contract);

      if (contract) {
        signer.getAddress().then((address) => {
          contract.members(address).then((result) => setIsMember(result));
        });
      }
    });
  };

  const connectCallback = async () => {
    const { contract } = await connect();
    setContract(contract);
    if (contract) {
      setConnected(true);
    }
  };

  const becomeMember = async () => {
    if (!contract) {
      alert("Error: Not connected to Metamask");
      return;
    }

    await contract
      .join()
      .then(() => {
        alert("Welcome!");
        setIsMember(true);
      })
      .catch((error) => alert("Error: Unable to become a member"), (error) => console.log(error.message));
  };

  return (
    <div>
      <Router>
        <Navbar
          connect={connectCallback}
          connected={connected}
          becomeMember={becomeMember}
          isMember={isMember}
        />
        <div className="container">
          <Routes>
          <Route path="" element={<Home contract={contract} />} />
            <Route
              path="create-vote"
              element={<CreateVote contract={contract} />}
            />
            <Route path="votes" element={<Votes contract={contract} />} />
            <Route path="results" element={<Results contract={contract} />} />
          </Routes>
        </div>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
