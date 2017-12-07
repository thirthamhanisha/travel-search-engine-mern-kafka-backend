var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/login";
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var mysql = require("./mysql");
function handle_request(msg, callback){
 var flightDetailsServiceCount;
    var service="Flight Details Page";
    var getUser="select count from servicesCount where service='"+service+"'";
    console.log("Query:"+getUser);
    mysql.fetchData(function(err,results){

        console.log("Flight Details Service count:"+JSON.stringify(results));

        console.log("Flight Details service count:"+JSON.stringify(results[0].count));
        flightDetailsServiceCount=+JSON.stringify(results[0].count);



        flightDetailsServiceCount++;
        console.log("flightDetailsServiceCount:"+flightDetailsServiceCount);

        var getUser="update servicesCount set count='"+flightDetailsServiceCount+"' where service='"+service+"'";
        console.log("Query is:"+getUser);
        mysql.fetchData(function(err,results){
            if(err) throw err;
            console.log(results.affectedRows + "records updated");

        },getUser);
    },getUser);
    var service="Fetching details of a flight";
    //var getUser="select count from servicesCount where service='"+service+"'";
    var getUser = "insert into userTrace(service,username,date,time) values('"+service+"','"+msg.username+"','"+NOW()+"',3) ";
    console.log("Query:"+getUser);
    mysql.fetchData(function(err,results){


        if(err) throw err;
        console.log(results.affectedRows + "records updated");

    },getUser);
    var res = {};
    console.log("In handle request:" + JSON.stringify(msg));

    if(isNaN(msg.flightID)) {
        res.value = "400";
        res.message = "Invalid Flight ID: " + msg.flightID;
        callback(null, res);
    } else{

        var getFlightDes="select * from flightDetails where flightID = '"+msg.flightID+"'";
        console.log("Query is:"+getFlightDes);

        mysql.fetchData(function (err, results) {
            if (err) {
                throw err;
            }
            else {
                res = {}
                if (results.length>0) {
                    console.log(results);
                    res.value = "200";
                    res.message = results[0];
                    res.message.seatType = "";
                    res.message.maxSeats = "";
                    res.message.availableSeats = "";
                    res.message.price = "";
                    console.log(res)
                    var getSeatDes="select * from flightSeatDetails where flightID = '"+msg.flightID+"' and seatType = '" + msg.seatType + "'";
                    console.log("Query is:"+getSeatDes);

                    mysql.fetchData(function (err, results) {
                        if (err) {
                            throw err;
                        }
                        else {
                            if (results.length > 0) {
                                res.message.seatType = results[0]["seatType"];
                                res.message.maxSeats = results[0]["maxSeats"];
                                res.message.availableSeats = results[0]["availableSeats"];
                                res.message.price = results[0]["price"];
                            }
                            callback(null, res);
                        }
                    }, getSeatDes);
                }
                else {
                    console.log("No flights fetched with the given preferences");
                    res.value = "404";
                    res.message = "No flights exists with the search criteria";
                    callback(null, res);
                }
                console.log("inside try:" + res);
            }
        }, getFlightDes);
    }
    
}

exports.handle_request = handle_request;
