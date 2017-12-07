var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/login";
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var mysql = require("./mysql");
function handle_request(msg, callback) {
var hotelDetailsServiceCount;
    var service="Hotel Details Page";
    var getUser="select count from servicesCount where service='"+service+"'";
    console.log("Query:"+getUser);
    mysql.fetchData(function(err,results){

        console.log("hotel details Service count:"+JSON.stringify(results));

        console.log("hotel details service count:"+JSON.stringify(results[0].count));
        hotelDetailsServiceCount=+JSON.stringify(results[0].count);



        hotelDetailsServiceCount++;
        console.log("hotelDetailsServiceCount:"+hotelDetailsServiceCount);

        var getUser="update servicesCount set count='"+hotelDetailsServiceCount+"' where service='"+service+"'";
        console.log("Query is:"+getUser);
        mysql.fetchData(function(err,results){
            if(err) throw err;
            console.log(results.affectedRows + "records updated");

        },getUser);
    },getUser);
    var service="Searching for hotel details";
    //var getUser="select count from servicesCount where service='"+service+"'";
    var getUser = "insert into userTrace(service,username,date,time) values('"+service+"','"+msg.username+"',NOW(),2) ";
    console.log("Query:"+getUser);
    mysql.fetchData(function(err,results){


        if(err) throw err;
        console.log(results.affectedRows + "records updated");

    },getUser);

    var res = {};
    console.log("In handle request:" + JSON.stringify(msg));

    var getUser = "select * from hoteldetails where hotelId ='" + msg.ID + "'";
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
            }
            else {
                console.log("no hotels fetched with the given preferences");
                res.value = "404";
                res.message = "No hotel exists with the criteria";
            }
            console.log("inside try:" + res);
            callback(null, res);
        }
    }, getUser);

}

exports.handle_request = handle_request;
