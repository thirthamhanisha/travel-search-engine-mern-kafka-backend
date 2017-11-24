var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/login";
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var mysql = require("./mysql");
function handle_request(msg, callback) {

    var res = {};
    console.log("In handle request:" + JSON.stringify(msg));

    var getUser = "select * from flightdetails where flightID = '" + msg.flightID + "' or flightName = '" + msg.flightName + "'";
    console.log("Query is:" + getUser);

    mysql.fetchData(function (err, results) {
        if (err) {
            throw err;
        }

        else {
            if (results.length > 0) {
                console.log(results);
                res.value = "200";
                res.message = results;
                console.log(res);


            }
            else {

                console.log("no flights fetched with the given ID");
                res.value = "404";
                res.message = "No flight exists with the given ID ";

            }
            console.log("inside try:" + res);
            callback(null, res);
        }

    }, getUser);

}

exports.handle_request = handle_request;