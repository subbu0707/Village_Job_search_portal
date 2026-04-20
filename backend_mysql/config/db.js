const { connectMongo, mongoose } = require("./mongo");

const unsupported = async () => {
  throw new Error(
    "This code path still uses SQL helpers. Migrate this feature to MongoDB model operations.",
  );
};

module.exports = {
  connectMongo,
  mongoose,
  query: unsupported,
  execute: unsupported,
  db: unsupported,
};
