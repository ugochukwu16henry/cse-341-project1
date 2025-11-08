const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Contacts & Temples API",
    description: "API Documentation for Contacts and Temples",
  },
  host: "localhost:8080",
  schemes: ["http"],
};

const outputFile = "./swagger.json";
const endpointsFiles = ["./server.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
