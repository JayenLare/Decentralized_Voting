import { ethers } from "ethers";

const address = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const abi = [
  "event BallotCast(address indexed voter, uint256 createdAt)",
  "event BallotCreated(address indexed owner, uint256 indexed ballotId, uint256 indexed createdAt, uint256 endDate)",
  "event FanJoined(address indexed fan, uint256 joinedAt)",
  "event FanVoteLoaded(address indexed owner, uint256 indexed createdAt)",
  "event FanVoted(address indexed voter, uint256 indexed option, uint256 createdAt)",
  "event MediaJoined(address indexed media, uint256 joinedAt)",
  "event MemberJoined(address indexed member, uint256 joinedAt)",
  "event VoteCreated(address indexed owner, uint256 indexed voteId, uint256 indexed createdAt, uint256 endTime)",
  "event Voted(address indexed voter, uint256 indexed voteId, uint256 indexed option, uint256 createdAt)",
  "event WinnerJoined(address indexed winner, uint256 joinedAt)",
  "function castBallot(string choice1, string choice2, string choice3)",
  "function compare(string str1, string str2) pure returns (bool)",
  "function createVote(string uri, uint256 endTime, uint256 options)",
  "function didVote(address member, uint256 voteId) view returns (bool)",
  "function endDate() view returns (uint256)",
  "function fanVotes(uint256 option)",
  "function fans(address) view returns (bool)",
  "function getFanVote() view returns (string, address, uint256[], uint256)",
  "function getResults() view returns (string[])",
  "function getVote(uint256 voteId) view returns (string, address, uint256[], uint256)",
  "function join()",
  "function joinFan()",
  "function joinMedia()",
  "function joinWinner()",
  "function loadFanVote()",
  "function loadFanVoteClicked() view returns (bool)",
  "function media(address) view returns (bool)",
  "function members(address) view returns (bool)",
  "function results(uint256) view returns (string)",
  "function vote(uint256 voteId, uint256 option)",
  "function winners(address) view returns (bool)"
]

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
