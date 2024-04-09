const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "sql6.freemysqlhosting.net",
  database: "sql6697610",
  user: "sql6697610",
  password: "@Ajaykumar93922",
});

connection.connect((error) => {
  if (error) {
    console.log("Unable to connect to the server");
  } else {
    console.log("Connection successful");
  }});

module.exports = connection;

/*const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  database: "test",
  user: "root",
  password: "",
});

connection.connect((error) => {
  if (error) {
    console.log("Unable to connect to the server");
  } else {
    console.log("Connection successful");
  }});

module.exports = connection;*/
