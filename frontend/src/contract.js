import { ethers } from "ethers";

const address = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const abi = [
  "event BallotCast(address indexed voter, uint256 indexed ballotId, uint256 indexed choices, uint256 createdAt)",
  "event BallotCreated(address indexed owner, uint256 indexed ballotId, uint256 indexed createdAt, uint256 endDate)",
  "event FanJoined(address indexed fan, uint256 joinedAt)",
  "event MediaJoined(address indexed media, uint256 joinedAt)",
  "event MemberJoined(address indexed member, uint256 joinedAt)",
  "event VoteCreated(address indexed owner, uint256 indexed voteId, uint256 indexed createdAt, uint256 endTime)",
  "event Voted(address indexed voter, uint256 indexed voteId, uint256 indexed option, uint256 createdAt)",
  "event WinnerJoined(address indexed winner, uint256 joinedAt)",
  "function castBallot(uint256 ballotId, uint256 choices)",
  "function createBallot(string uri, uint256 endDate, uint256 choices)",
  "function createVote(string uri, uint256 endTime, uint256 options)",
  "function didVote(address member, uint256 voteId) view returns (bool)",
  "function fans(address) view returns (bool)",
  "function getVote(uint256 voteId) view returns (string, address, uint256[], uint256)",
  "function join()",
  "function joinFan()",
  "function joinMedia()",
  "function joinWinner()",
  "function media(address) view returns (bool)",
  "function members(address) view returns (bool)",
  "function vote(uint256 voteId, uint256 option)",
  "function winners(address) view returns (bool)"
];

const provider = new ethers.providers.Web3Provider(window.ethereum);

export const connect = async () => {
  await provider.send("eth_requestAccounts", []);
  return getContract();
};

export const getContract = async () => {
  const signer = provider.getSigner();
  const contract = new ethers.Contract(address, abi, signer);
  return { signer: signer, contract: contract };
};
