// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract Voting {
    uint nextVoteId;

    struct Vote {
        string uri;
        address owner;
        uint endTime;
        uint[] votes;
        mapping(address => bool) voted;
        uint options;
    }

    mapping(uint => Vote) votes;
    mapping(address => bool) members;

    event MemberJoined(address indexed member, uint joinedAt);
    event VoteCreated(
        address indexed owner,
        uint indexed voteId,
        uint indexed createdAt,
        uint endTime
    );
    event Voted(
        address indexed voter,
        uint indexed voteId,
        uint indexed option,
        uint createdAt
    );

    modifier isMember() {
        require(members[msg.sender], "You are not a member");
        _;
    }
    modifier canVote(uint voteId, uint option) {
        require(voteId < nextVoteId, "Vote does not exist");
        require(option < votes[voteId].options, "Invalid option");
        require(!votes[voteId].voted[msg.sender], "You have already voted");
        require(block.timestamp <= votes[voteId].endTime, "Vote has ended");
        _;
    }
}
