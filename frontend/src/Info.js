import React from "react";

const Info = () => {
  return (
    <div className="m-4">
      <div style={{textAlign: "center"}}>
        <h1 style={{marginTop: "-5px"}}>About Heisman Voting</h1>
        <hr/>
        <h5 style={{marginTop: "15px", marginBottom: "15px"}}>Here members can learn more about the Heisman Trophy voting process</h5>
        <div style={{display:"flex"}}>
          <div style={{flex: "50%", paddingRight: "15px"}}>
            <p style={{marginTop: "5px"}}> 
              The task of designating the most outstanding college football player is a daunting one, 
              so a crucial decision was made early on to determine the best group of individuals to make that choice.
            </p>
            <p style={{marginTop: "5px"}}> 
              It was decided that sports journalists were the most logical group for this task. As informed, 
              competent and impartial observers, they comprise the vast majority of the electors. 
              The Heisman Trophy Trust governs the policies and procedures by which the balloting process is conducted. 
              Specifically, six persons are chosen as Sectional Representatives.
            </p>
            <p style={{marginTop: "5px"}}>
              The Sectional Representatives are responsible for the appointment of the State Representatives. State Representatives are 
              given the responsibility of selecting the voters within their particular state. The amount of votes that a particular state 
              is allotted depends on the size of the state and the amount of media outlets within that state. Larger states such as 
              California and Texas will naturally have more votes than smaller states such as Vermont and Delaware.
            </p>
            <p style={{marginTop: "5px"}}>
              The states are divided into the six sections accordingly:<br></br> <b>Far West</b> (AZ, CA, HI, ID, MT, ND, NV, OR, SD, UT, WA, WY); 
              <b> Mid Atlantic</b> (DC, DE, MD, NC, NJ, PA, SC, VA, WV); <b>Mid West</b> (IA, IL, IN, MI, MN, OH, WI); <b>North East </b>
              (CT, MA, ME, NH, NYC, NY, RI, VT); <b>South</b> (AL, FL, GA, KY, LA, MS, TN); <b>Southwest</b> (AR, CO, KS, MO, NE, NM, OK, TX)
            </p>
          </div>
          <div style={{flex: "50%", paddingLeft: "15px"}}>
            <p style={{marginTop: "5px"}}>
              Each Section within the United States has 145 media votes, totaling 870 media votes across the country. Additionally every 
              former Heisman winner, 57 presently, has a vote as well. In 1999, The Heisman Trophy agreed to develop a special program 
              to allow the public at large to become part of the balloting process by permitting one (1) fan vote eligible in the overall tabulation.
            </p>
            <p style={{marginTop: "5px"}}>
              The actual ballots include a space for electors to designate three individuals for the Heisman Trophy. The first choice on an elector's 
              ballot receives three points in the overall voting tabulation, the second choice receives two points and the third choice receives one point.
              The individual with the most points receives the Heisman Trophy. The Heisman Committee created the point system in an effort to eliminate any sectional favoritism.  
            </p>
            <p style={{marginTop: "5px"}}>
              Each eligible voters receives a secure digital identity to cast their ballot on a blockchain network. Transactions representing ballots are bundled 
              into blocks and added to the blockchain through a consensus mechanism, ensuring cryptographically secure ballots. 
              Blockchain's decentralized nature prevents manipulation or fraud by distributing control over the voting process. After the voting period 
              concludes, nodes on the blockchain network compute the aggregated votes to determine the outcome. At the Heisman ceremony, the final voting 
              results become publicly accessible on the blockchain ledger, allowing for transparent verification by anyone. 
            </p>
          </div>
        </div>
      </div>
      <br></br>
      <br></br>
    </div>
  );
}

export default Info;