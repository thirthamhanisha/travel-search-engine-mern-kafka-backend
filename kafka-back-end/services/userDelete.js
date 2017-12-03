var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/login";
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var mysql = require("./mysql");
function handle_request(msg, callback) {

    var res ={};
    var getUser1 = "select * from users where username ='"+msg.username+"'";
   // var getUser2="update users SET  firstName=  '" + msg.firstName+"', lastName=  '" + msg.lastName+"', password=  '" + msg.password+"',address=  '" + msg.address+"', city=  '" + msg.city+"',state=  '" + msg.state+"',zipcode=  '" + msg.zipcode+"',email=  '" + msg.email+"',isAdmin='0' where username ='" + msg.username+"' ";
   var getUser2 = "delete from users where username = '"+msg.username+"'";
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
                    res.message = "users records deleted successfully";
                    console.log("success in delete query");

                }
                console.log("inside try:" + res);
                callback(null, res);
            },getUser2);
        }
        else
        {
            console.log("user does not exist to delete");
            res.value = "401";
            res.message= "user does not exist to delete";
        }
        console.log("inside try:" + res);
        callback(null, res);
    },getUser1);



}

exports.handle_request = handle_request;
