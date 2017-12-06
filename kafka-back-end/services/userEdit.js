var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/login";
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var mysql = require("./mysql");
function handle_request(msg, callback) {

    var res = {};
    var res1 = {};
    var key ="273";
    var hash = crypto.createHmac('sha512', key); //encrytion using SHA512
    hash.update(msg.password);
    msg.password = hash.digest('hex');
    var getUser1 = "select * from users where username ='"+msg.username+"'";
    var getUser2="update users SET  firstName=  '" + msg.firstName+"', lastName=  '" + msg.lastName+"',address=  '" + msg.address+"', city=  '" + msg.city+"',state=  '" + msg.state+"',zipcode=  '" + msg.zipcode+"',email=  '" + msg.email+"',isAdmin='0' where username ='" + msg.username+"' ";
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
                    res.message = "users records updated successfully";
                    console.log("success in update query");

                }
                console.log("inside try:" + res);
                callback(null, res);
            },getUser2);
        }
        else
        {
            console.log("user does not exist to edit");
            res.value = "401";
            res.message= "user does not exist to edit";
        }
        console.log("inside try:" + res);
        callback(null, res);
    },getUser1);



}

exports.handle_request = handle_request;

