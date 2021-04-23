require('dotenv').config()

var mysql = require('mysql');
var config = require('./config');


var con = mysql.createConnection({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password
});

con.connect(function(err) {
  if (err) throw err;
  // console.log("Connected!");
  // con.query("CREATE DATABASE clinic", function (err, result) {
  //   if (err) throw err;
  //   console.log("Database created");
  // });
  con.query("USE clinic", function (err, result) {
    if (err) throw err;
    console.log("use clinic");
  });
  con.query("CREATE TABLE IF NOT EXISTS clinic_users (id INT(11) NOT NULL auto_increment PRIMARY KEY, email VARCHAR(255) UNIQUE, password VARCHAR(255) NOT NULL, clinic_name VARCHAR(255) NOT NULL, phone_number INT, country_code INT, address VARCHAR(255), created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME on UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)", function (err, result) {
    if (err) throw err;
    console.log("Table clinic_users created");
  });
  con.query("CREATE TABLE IF NOT EXISTS consultation_records (id INT(11) NOT NULL auto_increment PRIMARY KEY, user_id INT NOT NULL, clinic_name VARCHAR(255), doctor_name VARCHAR(255) NOT NULL, patient_name VARCHAR(255) NOT NULL, diagnosis VARCHAR(255), medication VARCHAR(255), consultation_fee DECIMAL DEFAULT 0, has_follow_up BOOLEAN DEFAULT FALSE, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME on UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)", function (err, result) {
    if (err) throw err;
    console.log("Table consultation_records created");
  });
  con.query("CREATE TABLE IF NOT EXISTS auth_tokens (id INT(11) NOT NULL auto_increment PRIMARY KEY, user_id INT NOT NULL, token VARCHAR(255) NOT NULL, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME on UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)", function (err, result) {
    if (err) throw err;
    console.log("Table auth_tokens created");
  });
  con.end();
});