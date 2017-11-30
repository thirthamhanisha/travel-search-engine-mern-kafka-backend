var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/login";
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var mysql = require("./mysql");
function handle_request(msg, callback) {

    var res = {};
    console.log("In handle request:" + JSON.stringify(msg));

    var getUser = "insert into hoteldetails(hotelName, city, fromDate,toDate, time,availableRooms,guestCount,starHotel,ratings,amount,bookedRooms) values('" + msg.hotelName + "','" + msg.city + "','" + msg.fromDate + "','" + msg.toDate + "',NOW(),'" + msg.availableRooms + "','" + msg.guestCount + "','" + msg.starHotel + "','" + msg.ratings + "','" + msg.amount + "',0)";
    console.log("Query is:" + getUser);

    mysql.fetchData(function (err, results) {
        if (err) {
            throw err;
        }

        else  {
            console.log(results);
            res.value = "200";
            res.message = "the records have been inserted into the table hoteldetails";
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