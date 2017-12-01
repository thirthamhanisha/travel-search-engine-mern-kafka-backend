var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/login";
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var mysql = require("./mysql");
function handle_request(msg, callback) {

    var res = {};
    var getUser1="select * from hotelDetails WHERE hotelID ='"+msg.hotelID+"'";
    console.log("Query is:"+getUser1);
    var getUser2="update hotelDetails SET  hotelName=  '" + msg.hotelName+"', city=  '" + msg.city+"', fromDate=  '" + msg.fromDate+"',toDate=  '" + msg.toDate+"',time= NOW(), availableRooms=  '" + msg.availableRooms+"',guestCount=  '" + msg.guestCount+"',starHotel=  '" + msg.starHotel+"',ratings=  '" + msg.ratings+"',amount=  '" + msg.amount+"',bookedRooms=  '" + msg.bookedRooms+"' WHERE hotelID ='"+msg.hotelID+"'";
    console.log("Query is:"+getUser2); // this is to decrement the available rooms and increase the booked rooms accordingly in database.

    mysql.fetchData(function(err,results) { //
        if (err) {
            throw err;
        }
        if(results.length>0)
        {
            console.log(results);
            console.log("records updated");
            mysql.fetchData(function(err,results1) { //
                if (err) {
                    throw err;
                    console.log("error in update query");
                }
                else {
                    console.log(results1);
                    res.value = "200";
                    res.message = "hotel records updated successfully";
                    console.log("success in update query");

                }
                console.log("inside try:" + res);
                callback(null, res);
            },getUser2);
        }
        else
        {
            console.log("hotel does not exist to edit");
            res.value = "401";
            res.message= "hotel does not exist to edit";
        }
        console.log("inside try:" + res);
        callback(null, res);
    },getUser1);

}

exports.handle_request = handle_request;

