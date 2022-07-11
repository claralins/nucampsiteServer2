const cors = require("cors");

//origins allowed:
const whitelist = ["http://localhost:3000", "https://localhost:3443"];

const corsOptionsDelegate = (req, callback) => {
  let corsOptions;
  console.log(req.header("Origin"));
  if (whitelist.infexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true }; // we'll accept this origin
  } else {
    corsOptions = { origin: false }; // origin won't be allowed
  }
  callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
