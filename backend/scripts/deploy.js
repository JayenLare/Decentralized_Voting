const hre = require("hardhat");
const fs = require("fs/promises");

async function main() {
  const voting = await hre.ethers.getContractFactory("Voting");
  const Voting = await voting.deploy();

  await Voting.waitForDeployment();
  await writeDeploymentInfo(Voting, "Voting.json");
  console.log(`Deployed voting at ${Voting.target}`);
}

async function writeDeploymentInfo(contract, filename = "") {
  const data = {
    contract: {
      address: contract.target,
      signerAddress: contract.signer, // NEEDS FIXING
      abi: contract.interface.format(),
    },
  };

  const content = JSON.stringify(data, null, 2);
  await fs.writeFile(filename, content, { encoding: "utf-8" });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});