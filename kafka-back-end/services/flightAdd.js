var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/login";
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var mysql = require("./mysql");
function handle_request(msg, callback) {

    var res = {};
    console.log("In handle request:" + JSON.stringify(msg));

    if(msg.maxSeats>=msg.availableSeats)
    {
    var flightID =  Math.floor(Math.random() * 9999) + 1000;
    var insertFlights = "insert into flightdetails(flightID, flightName, operator, fromCity, toCity, departureTime, arrivalTime) values('" +flightID + "','" + msg.flightName + "','" + msg.operator + "','" + msg.fromCity + "','" + msg.toCity + "','" + msg.departureTime + "','" + msg.arrivalTime + "')";
    console.log("Query is:" + insertFlights);

    mysql.fetchData(function (err, results) {
        if (err) {
            throw err;
        }

            else  {
                var insertFlightSeats = "insert into flightseatdetails(flightID, seatType, maxSeats, availableSeats, price) values('" +flightID + "','" + msg.seatType + "','" + msg.maxSeats + "','" + msg.availableSeats + "','" + msg.price + "')";
                mysql.fetchData(function (err, results) {
                    if (err) {
                        throw err;
                    }
            
                        else  {
                            res.value = "200";
                            res.message = "the records have been inserted into the table flightdetails and flightseatdetails";
                        }
                        callback(null, res);
                    }, insertFlightSeats);
                
                res.value = "200";
                res.message = "the records have been inserted into the table flightdetails and flightseatdetails";
                        /*else {
                            console.log("no hotels fetched with the given preferences");
                            res.value = "404";
                            res.message = "No hotel exists with the criteria";
                        }*/
                        console.log("inside try:" + res);
                        callback(null, res);
            
                }
            /*else {
                console.log("no hotels fetched with the given preferences");
                res.value = "404";
                res.message = "No hotel exists with the criteria";
            }*/
            console.log("inside try:" + res);
            callback(null, res);

    }, insertFlights);

}

else
{
  
    res.value = "400";
    res.message = "Available seats value cannot exceed the maxSeats Value";
    callback(null, res);
                
}

}

exports.handle_request = handle_request;