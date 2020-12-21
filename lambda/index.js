const awsServerlessExpress = require("@vendia/serverless-express");
const app = require("./build/server.js").default;
const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
};