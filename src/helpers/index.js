const { randomUUID } = require("crypto");
const bcryptjs = require("bcryptjs");

const genId = () => randomUUID();

const genHash = (salt = 10, string) => {
  return bcryptjs.hashSync(salt, string);
};

const compareHash = (string, hash) => {
  return bcryptjs.compareSync(string, hash);
};


module.exports = {
  genId,
  genHash,
  compareHash
}