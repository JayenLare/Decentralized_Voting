const { expect } = require("chai");

const getTime = async () => {
  const blockNumBefore = await ethers.provider.getBlockNumber();
  const blockBefore = await ethers.provider.getBlock(blockNumBefore);
  return blockBefore.timestamp;
};

describe("Voting", function () {
  let addr0;
  let addr1;
  let addr2;
  let addr3;
  let addr4;
  let voting;

  before(async () => {
    [addr0, addr1, addr2, addr3, addr4] = await ethers.getSigners();

    const Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy({});
  });

  describe("Join", () => {
    it("Can join", async () => {
      await expect(voting.join()).to.emit(voting, "MemberJoined");
    });
    it("Cannot join if already member", async () => {
      await expect(voting.join()).to.be.reverted;
    });
  });

  describe("JoinMedia", () => {
    it("Can join as media member", async () => {
      await expect(voting.joinMedia()).to.emit(voting, "MediaJoined");
    });
    it("Cannot join if already joined as a media member", async () => {
      await expect(voting.joinMedia()).to.be.reverted;
    });
  });

  describe("JoinWinner", () => {
    it("Can join as previous winner", async () => {
      await expect(voting.connect(addr3).joinWinner()).to.emit(voting, "WinnerJoined");
    });
    it("Cannot join if already joined as a member", async () => {
      await expect(voting.joinWinner()).to.be.reverted;
    });
  });

  describe("JoinFan", () => {
    it("Can join as fan", async () => {
      await expect(voting.connect(addr4).joinFan()).to.emit(voting, "FanJoined");
    });
    it("Cannot join if already joined as a member", async () => {
      await expect(voting.joinFan()).to.be.reverted;
    });
  });

  describe("Cast Ballot", () => {
    it("Can handle new entries", async () => {
      await expect(voting.castBallot("player1", "player2", "player3")).to.emit(voting, "BallotCast");
    });
    it("Can handle repeated entries", async () => {
      await expect(voting.connect(addr3).castBallot("player3", "player5", "player1")).to.emit(voting, "BallotCast");
    });
    it("Cannot cast multiple ballots", async () => {
      await expect(voting.castBallot("player1", "player2", "player3")).to.be.reverted;
    });
    it("Cannot leave any choice blank", async () => {
      await voting.connect(addr2).join();
      await expect(voting.castBallot("player1", "", "player3")).to.be.reverted;
    });
    it("Can only vote if a media member or prev winner", async () => {
      await expect(voting.connect(addr4).castBallot("player1", "player2", "player3")).to.be.reverted;
    });
  });

  /*
  describe("Create vote", () => {
    it("Cannot create vote if not member", async () => {
      await expect(
        voting.connect(addr1).createVote("", (await getTime()) + 60, 4)
      ).to.be.reverted;
    });
    it("Cannot create vote invalid end time", async () => {
      await expect(voting.createVote("", (await getTime()) - 60, 4)).to.be
        .reverted;
    });
    it("Cannot create vote it too few options", async () => {
      await expect(voting.createVote("", (await getTime()) + 60, 1)).to.be
        .reverted;
    });
    it("Cannot create vote if too many options", async () => {
      await expect(voting.createVote("", (await getTime()) + 60, 9)).to.be
        .reverted;
    });
    it("Can create vote", async () => {
      await expect(voting.createVote("1", (await getTime()) + 60, 3)).to.emit(
        voting,
        "VoteCreated"
      );
    });
    it("Can create 2nd vote", async () => {
      await expect(voting.createVote("2", (await getTime()) + 60, 4)).to.emit(
        voting,
        "VoteCreated"
      );
    });
  });

  describe("Vote", () => {
    it("Cannot vote if not member", async () => {
      await expect(voting.connect(addr1).vote(0, 0)).to.be.reverted;
    });
    it("Cannot vote on vote that doesn't exist", async () => {
      await expect(voting.vote(2, 0)).to.be.reverted;
    });
    it("Cannot vote on invalid option", async () => {
      await expect(voting.vote(0, 9)).to.be.reverted;
    });
    it("Can vote", async () => {
      await expect(voting.vote(0, 0)).to.emit(voting, "Voted");
    });
    it("Cannot vote twice", async () => {
      await expect(voting.vote(0, 1)).to.be.reverted;
    });
    it("Cannot vote on expired vote", async () => {
      await voting.connect(addr1).join();
      await ethers.provider.send("evm_mine", [(await getTime()) + 3600]);
      await expect(voting.connect(addr1).vote(0, 0)).to.be.reverted;
    });
  });

  describe("CreateBallot", () => {
    it("Cannot create ballot if not a member", async () => {
      await expect(
        voting.connect(addr2).createBallot("", (await getTime()) + 60, 3)
      ).to.be.reverted;
    });
    it("Cannot create ballot with invalid end time", async () => {
      await expect(voting.createBallot("", (await getTime()) - 60, 3)).to.be.reverted;
    });
    it("Cannot create ballot with more than 3 choices", async () => {
      await expect(voting.createBallot("", (await getTime()) + 60, 4)).to.be.reverted;
    });
    it("Cannot create ballot with less than 3 choices", async () => {
      await expect(voting.createBallot("", (await getTime()) + 60, 2)).to.be.reverted;
    });
    it("Can create ballot", async () => {
      await expect(voting.createBallot("1", (await getTime()) + 60, 3)).to.emit(
        voting,"BallotCreated");
    });
    it("Cannot create a 2nd ballot", async () => {
      await expect(voting.createBallot("2", (await getTime()) + 60, 3)).to.emit(
        voting,"BallotCreated");
    });
  });

  describe("CastBallot", () => {
    it("Cannot cast ballot if not member", async () => {
      await expect(voting.connect(addr2).castBallot(0, 0)).to.be.reverted;
    });
    it("Cannot cast ballot that doesn't exist", async () => {
      await expect(voting.castBallot(2, 0)).to.be.reverted;
    });
    it("Cannot cast invalid ballot", async () => {
      await expect(voting.castBallot(0, 4)).to.be.reverted;
    });
    it("Can cast ballot", async () => {
      await expect(voting.castBallot(0, 0)).to.emit(voting, "BallotCast");
    });
    it("Cannot cast ballot twice", async () => {
      await expect(voting.castBallot(0, 1)).to.be.reverted;
    });
    it("Cannot vote on expired vote", async () => {
      await voting.connect(addr2).join();
      await ethers.provider.send("evm_mine", [(await getTime()) + 3600]);
      await expect(voting.connect(addr2).castBallot(0, 0)).to.be.reverted;
    });
  });
  */
});
