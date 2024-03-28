import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import CreateVote from "./CreateVotes";
import FanVote from "./FanVote.js";
import Navbar from "./Navbar";
import Footer from "./Footer.js";
import Results from "./Results.js";
import { useState, useEffect } from "react";
import { connect, getContract } from "./contract";
import Ceremony from "./Ceremony.js";
import Info from "./Info.js";

function App() {
  const [contract, setContract] = useState(null);
  const [connected, setConnected] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [clicked, setClicked] = useState(false);

  const [uri, setUri] = useState("ipfs/QmNw21MDbxgq89jXyXqGZS7xWh6EbbFGPu35dSSwbtLZG8");
  const [options, setOptions] = useState(10);
  const [endDate, setEndDate] = useState("05/03/2024");

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
        // if (contract.loadFanVoteClicked() == true){
        //   setClicked(true);
        // }         
        contract.loadFanVoteClicked().then((flag) => setClicked(flag));
        //createVote();
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

  const createVote = async () => {
    if (!contract) {
      alert("Error: Not connected to Metamask");
      return;
    }

    await contract
      .createVote(uri, new Date(endDate).getTime(), options)
      .then(() => {
        alert("The fan vote poll is being loaded...\nPlease wait a few seconds then refresh the page");
        setClicked(true);
      })
      .catch((error) => alert("Error: Cannot create vote"), (error) => console.log(error.message));
  };

  /*
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
  */

  const joinAsFan = async () => {
    if (!contract) {
      alert("Error: Not connected to Metamask");
      return;
    }
    if (isMember) {
      alert("Error: You are already a Heisman voting member");
      return;
    }

    await contract
      .joinFan()
      .then(() => {
        alert("Welcome new member! You have joined as a fan");
        setIsMember(true);
      })
      .catch((error) => alert("Error: Unable to become a Heisman voting member"), (error) => console.log(error.message));
  };

  const joinAsMedia = async () => {
    if (!contract) {
      alert("Error: Not connected to Metamask");
      return;
    }
    if (isMember) {
      alert("Error: You are already a Heisman voting member");
      return;
    }

    await contract
      .joinMedia()
      .then(() => {
        alert("Welcome new member! You have joined as media");
        setIsMember(true);
      })
      .catch((error) => alert("Error: Unable to become a Heisman voting member"), (error) => console.log(error.message));
  };

  const joinAsWinner = async () => {
    if (!contract) {
      alert("Error: Not connected to Metamask");
      return;
    }
    if (isMember) {
      alert("Error: You are already a Heisman voting member");
      return;
    }

    await contract
      .joinWinner()
      .then(() => {
        alert("Welcome new member! You have joined as a previous winner");
        setIsMember(true);
      })
      .catch((error) => alert("Error: Unable to become a Heisman voting member"), (error) => console.log(error.message));
  };

  return (
    <div>
      <Router>
        <Navbar
          connect={connectCallback}
          connected={connected}
          //becomeMember={becomeMember}
          joinAsFan={joinAsFan}
          joinAsMedia={joinAsMedia}
          joinAsWinner={joinAsWinner}
          isMember={isMember}
          //clicked={clicked}
        />
        <div className="container">
          <Routes>
          <Route path="" element={<Home contract={contract} />} />
            <Route
              path="create-vote"
              element={<CreateVote contract={contract} />}
            />
            <Route path="fan-vote" element={<FanVote contract={contract} clicked={clicked} createVote={createVote}/>} />
            <Route path="results" element={<Results contract={contract} />} />
            <Route path="ceremony" element={<Ceremony contract={contract} />} />
            <Route path="info" element={<Info contract={contract} />} />
          </Routes>
        </div>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
