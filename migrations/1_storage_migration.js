var Storage = artifacts.require("storage");
module.exports = function (deployer) {
  deployer.deploy(Storage);
};