const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Voting", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOneYearLockFixture() {
    let addr0;
    let addr1;
    let voting;

    // Contracts are deployed using the first signer/account by default
    [addr0, addr1] = await ethers.getSigners();

    const Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy();

    return { voting, addr0, addr1 };
  }
});
