require("dotenv").config();

module.exports = (req, res, next) => {
  let origin = req.headers.origin;
  // res.header(
  //   "Access-Control-Allow-Origin",
  //   // req.headers.host.indexOf("localhost") > -1
  //   //   ? process.env.CLIENT_URL || "http://localhost:3000"
  //   //   : origin
  //   "*"
  // );
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://facebook-client-two.vercel.app"
  );
  // res.setHeader(
  //   "Access-Control-Allow-Origin",
  //   "*"
  // );
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", true);
  next();
};
