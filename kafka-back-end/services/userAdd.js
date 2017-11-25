var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/login";
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var mysql = require("./mysql");
function handle_request(msg, callback) {

    var res = {};
    console.log("In handle request:" + JSON.stringify(msg));

    var getUser = "insert into users(firstName, lastName, username,password,city,address,state,zipcode,email) values('" + msg.firstName + "','" + msg.lastName + "','" + msg.username + "','" + msg.password + "','" + msg.city + "','" + msg.address + "','" + msg.state + "','" + msg.zipcode + "','" + msg.email + "')";
    console.log("Query is:" + getUser);

    mysql.fetchData(function (err, results) {
        if (err) {
            throw err;
        }

        else  {
            console.log(results);
            res.value = "200";
            res.message = "the records have been inserted into the table users";
        }
        /*else {
            console.log("no hotels fetched with the given preferences");
            res.value = "404";
            res.message = "No hotel exists with the criteria";
        }*/
        console.log("inside try:" + res);
        callback(null, res);

    }, getUser);

}

exports.handle_request = handle_request;