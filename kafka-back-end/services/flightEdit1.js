var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/login";
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var mysql = require("./mysql");
function handle_request(msg, callback) {

    var res = {};

    var getUser2="update flightDetails SET  flightName=  '" + msg.flightName+"', operator=  '" + msg.operator+"', fromCity=  '" + msg.fromCity+"',toCity=  '" + msg.toCity+"', fromDate=  '" + msg.fromDate+"',seatsCount=  '" + msg.seatCount+"',departureTime=  '" + msg.departureTime+"',arrivalTime=  '" + msg.arrivalTime+"',price=  '" + msg.price+"',seatType=  '" + msg.seatType+"' WHERE flightID ='"+msg.flightID+"'";
    console.log("Query is:"+getUser2); // this is to decrement the available rooms and increase the booked rooms accordingly in database.
    mysql.fetchData(function(err,results) { //
        if (err) {
            throw err;
        }
        else {

            console.log(results);
            console.log("records updated");
            res.value = "200";
            res.message = "records updated successfully";
        }
        console.log("inside try:" + res);
        callback(null, res);
    },getUser2);

}

exports.handle_request = handle_request;

