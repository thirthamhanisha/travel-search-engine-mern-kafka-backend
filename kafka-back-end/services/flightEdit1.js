var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/login";
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var mysql = require("./mysql");
function handle_request(msg, callback) {
    var res = {};
    if(!isNaN(flightID)==false){
        var updateFlights="update flightDetails SET  flightName=  '" + msg.flightName+"', operator=  '" + msg.operator+"', fromCity=  '" + msg.fromCity+"',toCity=  '" + msg.toCity+"', departureTime=  '" + msg.departureTime+"', arrivalTime=  '" + msg.arrivalTime+"' WHERE flightID ='"+msg.flightID+"'";
    
    var flightID = "select * from flightdetails where flightID ='"+msg.flightID+"'";
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
                    res.message = "flight records updated successfully";
                    console.log("success in update query");

                }
              //  console.log("inside try:" + res);
              callback(null, res);
            },updateFlights);
        }
        else
        {
            console.log("flight does not exist to edit");
            res.value = "404";
            res.message= "flight does not exist to edit";
        }
        console.log("inside try:" + res);
        callback(null, res);
    },flightID);


}

else {
    res.value="400";
    res.message="Please Enter a valid Flight ID.";
    callback(null,res);
}
}

exports.handle_request = handle_request;

