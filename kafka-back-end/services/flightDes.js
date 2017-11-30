var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/login";
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var mysql = require("./mysql");
function handle_request(msg, callback){
var flightDetailsServiceCount;
    var service="flightDetails";
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
    //var res = {};
    console.log("In handle request:" + JSON.stringify(msg));

    var getFlightDes="select * from flightDetails where flightID = '"+msg.flightID+"'and seatType='"+msg.seatType+"'";
    console.log("Query is:"+getFlightDes);

    mysql.fetchData(function (err, results) {
        if (err) {
            throw err;
        }
        else {
            if (results.length > 0) {
                console.log(results);
                res.value = "200";
                res.message = results;
            }
            else {
                console.log("No flights fetched with the given preferences");
                res.value = "404";
                res.message = "No flights exists with the search criteria";
            }
            console.log("inside try:" + res);
            callback(null, res);
        }
    }, getFlightDes);
    
}

exports.handle_request = handle_request;
