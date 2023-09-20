const { expect } = require("chai");

describe("Voting", function () {
  let addr0;
  let addr1;
  let voting;

  before(async () => {
    [addr0, addr1] = await ethers.getSigners();

    const Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy();
  });

});
