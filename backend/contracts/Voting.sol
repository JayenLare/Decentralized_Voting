// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Voting {
    uint256 nextVoteId;
    uint256 nextBallotId;
    uint256 nextRequestId;

    uint256 constant public endDate = 1733374800;

    struct Vote {
        string uri;
        address owner;
        uint256 endTime;
        uint256[] votes;
        mapping(address => bool) voted;
        uint256 options;
    }

    struct Ballot {
        uint256 ballotId;
        address owner;
        string choice1;
        string choice2;
        string choice3;
        uint256[] ballots;
        mapping(address => bool) ballotCast;
        uint256 endDate;    // Dec 4th
        uint256 choices;    // 3
    }

    struct Attendee {
        address owner;
        string name;
        string email;
        string addr;
        string city;
        string state;
        string zip;
        string membership;
    }

    Vote fanVote;

    bool public loadFanVoteClicked = false;

    mapping(uint256 => Vote) votes;
    mapping(uint256 => Ballot) ballots;

    mapping(address => bool) ballotCasted;
    mapping(string => uint256) canididates;
    string[] public results;
    string[] public formatedResults;
    mapping (string => bool) isDuplicate;

    mapping(uint256 => Attendee) attendees;
    mapping(address => bool) inviteRequested;

    mapping(uint256 => string) history;

    mapping(address => bool) public members;
    mapping(address => bool) public media;
    mapping(address => bool) public winners;
    mapping(address => bool) public fans;

    event MemberJoined(address indexed member, uint256 joinedAt);
    event MediaJoined(address indexed media, uint256 joinedAt);
    event WinnerJoined(address indexed winner, uint256 joinedAt);
    event FanJoined(address indexed fan, uint256 joinedAt);

    event VoteCreated(
        address indexed owner,
        uint256 indexed voteId,
        uint256 indexed createdAt,
        uint256 endTime
    );

    event FanVoteLoaded(
        address indexed owner,
        uint256 indexed createdAt
    );

    event FanVoted(
        address indexed voter,
        uint256 indexed option,
        uint256 createdAt
    );

    event Voted(
        address indexed voter,
        uint256 indexed voteId,
        uint256 indexed option,
        uint256 createdAt
    );

    event BallotCreated(
        address indexed owner,
        uint256 indexed ballotId,
        uint256 indexed createdAt,
        uint256 endDate
    );

    event BallotCast(
        address indexed voter,
        uint256 createdAt
    );

    event InviteRequested(
        address indexed owner,
        uint256 createdAt
    );

    modifier isFan() {
        require(fans[msg.sender], "you are not a fan");
        _;
    }

    modifier isNotFan() {
        require(media[msg.sender] || winners[msg.sender], "you are not a media member or previous winner");
        _;
    }

    modifier isMember() {
        require(media[msg.sender] || winners[msg.sender] || fans[msg.sender], "you are not a member");
        _;
    }

    modifier isNotMember() {
        require(!media[msg.sender], "you have already joined as a media member");
        require(!winners[msg.sender], "you have already joined as a previous winner");
        require(!fans[msg.sender], "you have already joined as a fan");
        _;
    }

    modifier canVote(uint256 voteId, uint256 option) {
        require(voteId < nextVoteId, "vote does not exist");
        require(option < votes[voteId].options, "invalid option");
        //require(!votes[voteId].voted[msg.sender], "you have already voted");
        require(block.timestamp <= votes[voteId].endTime, "vote has ended");
        _;
    }

    function compare(string memory str1, string memory str2) public pure returns (bool) {
        if (bytes(str1).length != bytes(str2).length) {
            return false;
        }
        return keccak256(abi.encodePacked(str1)) == keccak256(abi.encodePacked(str2));
    }

    modifier canRequest(string memory name, string memory email,
        string memory addr, string memory city, 
        string memory state, string memory zip, string memory membership) {
        require(!inviteRequested[msg.sender], "you have already requested an invitation");
        require(block.timestamp <= endDate, "Deadline for ceremony invite has past");
        require(!compare(name, ""), "Must enter your name");
        require(!compare(email, ""), "Must enter a valid email");
        require(!compare(addr, "") || !compare(city, "") || 
            !compare(state, "") || !compare(zip, ""), "Must enter a valid address");
        require(!compare(membership, ""), "Must select a membership type");
        _;
    }

    modifier canCastBallot(string memory choice1,
        string memory choice2,
        string memory choice3
        ) {
        require(!ballotCasted[msg.sender], "you have already voted");
        require(block.timestamp <= endDate, "vote has ended");
        require(!compare(choice1, ""), "Must have a first choice");
        require(!compare(choice2, ""), "Must have a second choice");
        require(!compare(choice3, ""), "Must have a third choice");
        _;
    }

    constructor () {
        history[2022] = "ipfs/QmZqEdJ3rjeto7dtH6xSCGyGxTWoxmrvFru4GjfKqqNKXm";
        history[2021] = "ipfs/QmVVDxP5o5E4BGskBwB953mBEE6HBC6a8FngHfQHii4MvG";
        history[2020] = "ipfs/QmZyZDGscPQWqjgMTxmEjP81fqeZxyowR7z5QLHXM7Kvmr";
        history[2019] = "ipfs/QmXwsiU8ydawMEqSzRUDVot6LvsGVJhMdDtHS1rARaHvUS";
        history[2018] = "ipfs/QmRc25rpQ7bAcdSGiF86LLDuHBASmnpirKucfYeWHZZPdm";
    }

    function join() public {
        require(!members[msg.sender], "you are already a member");
        members[msg.sender] = true;
        emit MemberJoined(msg.sender, block.timestamp);
    }

    function joinMedia() external isNotMember{
        media[msg.sender] = true;
        emit MediaJoined(msg.sender, block.timestamp);
    }

    function joinWinner() external isNotMember{
        winners[msg.sender] = true;
        emit WinnerJoined(msg.sender, block.timestamp);
    }

    function joinFan() external isNotMember{
        fans[msg.sender] = true;
        emit FanJoined(msg.sender, block.timestamp);
    }

    function createVote(
        string memory uri,
        uint256 endTime,
        uint256 options
    ) external {
        // require(
        //     options >= 2 && options <= 8,
        //     "number of options must be between 2 and 8"
        // );
        require(endTime > block.timestamp, "end time cannot be in past");
        uint256 voteId = nextVoteId;

        votes[voteId].uri = uri;
        votes[voteId].owner = msg.sender;
        votes[voteId].endTime = endTime;
        votes[voteId].options = options;
        votes[voteId].votes = new uint256[](options);

        loadFanVoteClicked = true;

        emit VoteCreated(msg.sender, voteId, block.timestamp, endTime);
        nextVoteId++;
    }

    function loadFanVote() external {
        // fanVote.uri = "QmSj7RYy2WKpqYFMqGtmtxpx4QUnEg4Bfgdru2KfGccHo4";
        // fanVote.options = 5;
        // // fanVote.endTime = 
        // fanVote.votes = new uint256[](5);
        // fanVote.owner = msg.sender;
        emit FanVoteLoaded(msg.sender, block.timestamp);
    }

    function fanVotes(uint256 option)
        external
        isFan
        //canVote(voteId, option)
    {
        fanVote.votes[option] = fanVote.votes[option] + 1;
        fanVote.voted[msg.sender] = true;
        emit FanVoted(msg.sender, option, block.timestamp);
    }

    function vote(uint256 voteId, uint256 option)
        external
        isFan
        canVote(voteId, option)
    {
        votes[voteId].votes[option] = votes[voteId].votes[option] + 1;
        votes[voteId].voted[msg.sender] = true;
        emit Voted(msg.sender, voteId, option, block.timestamp);
    }

    function getFanVote()
        public
        view
        returns (
            string memory,
            address,
            uint256[] memory,
            uint256
        )
    {
        return (
            fanVote.uri,
            fanVote.owner,
            fanVote.votes,
            fanVote.endTime
        );
    }

    function getVote(uint256 voteId)
        public
        view
        returns (
            string memory,
            address,
            uint256[] memory,
            uint256
        )
    {
        return (
            votes[voteId].uri,
            votes[voteId].owner,
            votes[voteId].votes,
            votes[voteId].endTime
        );
    }

    function didVote(address member, uint256 voteId)
        public
        view
        returns (bool)
    {
        return votes[voteId].voted[member];
    }

        // Function to sort the keys based on their values
    function sortKeys() private {
        uint256 length = results.length;

        // Bubble sort algorithm to sort the keys array based on their corresponding values
        for (uint256 i = 0; i < length - 1; i++) {
            for (uint256 j = 0; j < length - 1; j++) {
                if (canididates[results[j]] < canididates[results[j + 1]]) {
                    string memory temp = results[j];
                    results[j] = results[j+1];
                    results[j+1] = temp;
                }
            }
        }
    }

    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
 
        uint256 temp = value;
        uint256 digits;
 
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
 
        bytes memory buffer = new bytes(digits);
 
        while (value != 0) {
            digits--;
            buffer[digits] = bytes1(uint8(48 + (value % 10)));
            value /= 10;
        }
 
        return string(buffer);
    }

    function castBallot (
        string memory choice1,
        string memory choice2,
        string memory choice3
    ) external isNotFan canCastBallot (choice1, choice2, choice3)
    {
        //delete results;
        canididates[choice1] += 3;
        canididates[choice2] += 2;
        canididates[choice3] += 1;
        ballotCasted[msg.sender] = true;
        if (isDuplicate[choice1] == false){
            results.push(choice1);
            isDuplicate[choice1] = true;
        }
        if (isDuplicate[choice2] == false){
            results.push(choice2);
            isDuplicate[choice2] = true;
        }
        if (isDuplicate[choice3] == false){
            results.push(choice3);
            isDuplicate[choice3] = true;
        }
        sortKeys();
        //delete formatedResults;
        formatResults();
        emit BallotCast(msg.sender, block.timestamp);
    }

    function formatResults() internal
    {
        delete formatedResults;
        for (uint256 i = 0; i < results.length; i++)
        {
            formatedResults.push(string.concat(results[i], " (", toString(canididates[results[i]]), ")"));
        }
    }

    function getResults() public view returns (string[] memory)
    {
        return formatedResults;
    }

    function ceremonyInviteRequest (
        string memory name,
        string memory email,
        string memory addr,
        string memory city,
        string memory state,
        string memory zip,
        string memory membership
    ) external isMember 
        canRequest(name, email, addr, city, state, zip, membership)
    {
        uint256 requestId = nextRequestId;

        attendees[requestId].owner = msg.sender;
        attendees[requestId].name = name;
        attendees[requestId].email = email;
        attendees[requestId].addr = addr;
        attendees[requestId].city = city;
        attendees[requestId].state = state;
        attendees[requestId].zip = zip;
        attendees[requestId].membership = membership;
        inviteRequested[msg.sender] = true;
        emit InviteRequested(msg.sender, block.timestamp);
        nextRequestId++;
    }

    function getAddress(string memory addr, string memory city,
        string memory state, string memory zip) 
        internal pure returns (string memory)
    {
        return string.concat(addr, ", ", city, ", ", state, " ", zip);
    }

    function getCeremonyRequest(uint256 requestId)
        public
        view
        returns (
            address,
            string memory, string memory,
            string memory, string memory
        )
    {
        
        return (
            attendees[requestId].owner,
            attendees[requestId].name,
            attendees[requestId].email,
            getAddress(
                attendees[requestId].addr,
                attendees[requestId].city,
                attendees[requestId].state,
                attendees[requestId].zip),
            attendees[requestId].membership
        );
    }

    function getHistory(uint256 year)
        public view returns (string memory)
    {
        return history[year];
    }

    // function createBallot(
    //     string memory uri,
    //     uint256 endDate,
    //     uint256 choices
    // ) external isMember {
    //     require(
    //         choices == 3,
    //         "must submit 3 players per ballot"
    //     );
    //     require(endDate > block.timestamp, "end time cannot be in past");
    //     uint256 ballotId = nextBallotId;

    //     //ballots[ballotId].uri = uri;
    //     ballots[ballotId].choice1 = choice1;
    //     ballots[ballotId].owner = msg.sender;
    //     ballots[ballotId].endDate = endDate;
    //     ballots[ballotId].choices = choices;
    //     ballots[ballotId].ballots = new uint256[](choices);

    //     emit BallotCreated(msg.sender, ballotId, block.timestamp, endDate);
    //     nextBallotId++;
    // }

    // function castBallot(uint256 ballotId, uint256 choices) 
    //     external isMember canCastBallot(ballotId, choices) {
    //     ballots[ballotId].ballots[0] = ballots[ballotId].ballots[0] + 3;    // first choice
    //     ballots[ballotId].ballots[1] = ballots[ballotId].ballots[1] + 2;    // second choice
    //     ballots[ballotId].ballots[2] = ballots[ballotId].ballots[2] + 1;    // third choice
    //     ballots[ballotId].ballotCast[msg.sender] = true;

    //     emit BallotCast(msg.sender, ballotId, choices, block.timestamp);
    // }
}