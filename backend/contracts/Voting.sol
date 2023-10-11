// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Voting {
    // Keeps track of the vote ID and increment to ensure unique vote IDs
    uint256 nextVoteId;

    // Stores info about each vote
    struct Vote {
        string uri;
        address owner;
        uint256 endTime;
        uint256[] votes;
        mapping(address => bool) voted;
        uint256 options;
    }

    // Stores vote ID associated with each Vote
    mapping(uint256 => Vote) votes;
    // Stores members
    mapping(address => bool) public members;

    // Events for members joining, vote created, and members voting
    event MemberJoined(address indexed member, uint256 joinedAt);
    event VoteCreated(
        address indexed owner,
        uint256 indexed voteId,
        uint256 indexed createdAt,
        uint256 endTime
    );
    event Voted(
        address indexed voter,
        uint256 indexed voteId,
        uint256 indexed option,
        uint256 createdAt
    );

    // Checks if voter is a member
    modifier isMember() {
        require(members[msg.sender], "You are not a member");
        _;
    }
    // Checks if vote is valid
    modifier canVote(uint256 voteId, uint256 option) {
        require(voteId < nextVoteId, "Vote does not exist");
        require(option < votes[voteId].options, "Invalid option");
        require(!votes[voteId].voted[msg.sender], "You have already voted");
        require(block.timestamp <= votes[voteId].endTime, "Vote has ended");
        _;
    }

    // Allows new members to join
    function join() external {
        require(!members[msg.sender], "You are already a member");
        members[msg.sender] = true;
        emit MemberJoined(msg.sender, block.timestamp);
    }

    // Creates a new vote
    function createVote(
        string memory uri,
        uint256 endTime,
        uint256 options
    ) external isMember {
        require(
            options > 1 && options < 10,
            "Number of options must be greater than 1 and less than 10"
        );
        require(endTime > block.timestamp, "Invalid end time");
        uint256 voteId = nextVoteId;
        votes[voteId].uri = uri;
        votes[voteId].owner = msg.sender;
        votes[voteId].endTime = endTime;
        votes[voteId].options = options;
        votes[voteId].votes = new uint256[](options);

        emit VoteCreated(msg.sender, voteId, block.timestamp, endTime);
        nextVoteId++;
    }

    // Members can vote on one of the options for a certain vote
    function vote(
        uint256 voteId,
        uint256 option
    ) external isMember canVote(voteId, option) {
        votes[voteId].votes[option]++;
        votes[voteId].voted[msg.sender] = true;
        emit Voted(msg.sender, voteId, option, block.timestamp);
    }

    // Returns vote info
    function getVote(
        uint256 voteId
    ) public view returns (string memory, address, uint256[] memory, uint256) {
        return (
            votes[voteId].uri,
            votes[voteId].owner,
            votes[voteId].votes,
            votes[voteId].endTime
        );
    }

    // Returns if a member has already voted on a certain vote
    function didVote(
        address member,
        uint256 voteId
    ) public view returns (bool) {
        return votes[voteId].voted[member];
    }
}
