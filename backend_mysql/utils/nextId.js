const Counter = require("../models/mongo/Counter");

const getNextId = async (collectionName) => {
  const counter = await Counter.findOneAndUpdate(
    { collectionName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  return counter.seq;
};

module.exports = { getNextId };
