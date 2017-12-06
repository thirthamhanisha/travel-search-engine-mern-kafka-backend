var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/login";
const fs = require('fs');
const fse = require('fs-extra');
var path = require('path');
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var mysql = require("./mysql");

function handle_request(msg, callback) {
    var res={};
    var signupServiceCount;
    var service = " Signup Page";
    var getUser = "select count from servicesCount where service='" + service + "'";
    console.log("Query:" + getUser);
    mysql.fetchData(function (err, results) {

        console.log("signup Service count:" + JSON.stringify(results));

        console.log("signup service count:" + JSON.stringify(results[0].count));
        signupServiceCount = +JSON.stringify(results[0].count);


        signupServiceCount++;
        console.log("signupServiceCount:" + signupServiceCount);

        var getUser = "update servicesCount set count='" + signupServiceCount + "' where service='" + service + "'";
        console.log("Query is:" + getUser);
        mysql.fetchData(function (err, results) {
            if (err) throw err;
            else{
                // res.code=200;
                console.log(results.affectedRows + "records updated");}
            // callback(null, res);
        }, getUser);
    }, getUser);

    var service="User signing up";
    //var getUser="select count from servicesCount where service='"+service+"'";
    var getUser = "insert into userTrace(service,username,date) values('"+service+"','"+msg.username+"',NOW()) ";
    console.log("Query:"+getUser);
    mysql.fetchData(function(err,results){


        if(err) throw err;
        console.log(results.affectedRows + "records updated");

    },getUser);

    var getUser1 = "select * from users where username='"+msg.username+"'";
    mysql.fetchData(function(err,results){
        console.log("QUER1 EXECUTION ");
        if(err){
            console.log("SELECT QUERY ERROR");
        }
        else if(results.length>0){
            console.log("USER EXISTS");
            res.code=401;
            callback(null,res);
        }

        else
        {
            console.log("SUCCESS SELECT");
            var key="273";
            var hash=crypto.createHmac('sha512',key);
            hash.update(msg.password);
            msg.password=hash.digest('hex');
            var getUser2 = "insert into users(firstName,lastName, username, password, address,city, state, zipcode, email,isAdmin) values ('" + msg.firstName + "','" + msg.lastName + "','" + msg.username + "','" + msg.password + "','" + msg.address + "','" + msg.city + "','" + msg.state + "','" + msg.zipcode + "','" + msg.email + "', 0)";
            console.log("Query is:" + getUser2);
            mysql.fetchData(function(err,results){
                if(err){
                    res.code=400;
                    res.value="user already exists";
                }else if(results){
                    console.log("RECORD UPDATED");
                    res.code=200;
                    res.value="SUCCESSFUL SIGN UP";
                    mongo.myconnect(mongoURL,function(){
                        console.log("connected to mongo:"+mongoURL);
                        var coll = mongo.collection('login');
                        coll.findOne({username:msg.username},function(err,user){
                            if(err){
                                res.value=err;
                                res.code=500;
                            }else if(user){
                                res.value="user already exists";
                                res.code=401;
                            }else{
                                var key="273";
                                var hash = crypto.createHmac('sha512', key);
                                hash.update(msg.password);
                                msg.password = hash.digest('hex');
                                var myobj = {
                                    username: msg.username,
                                    password: msg.password,
                                    firstname: msg.firstName,
                                    lastname: msg.lastName,
                                    address: msg.address,
                                    city: msg.city,
                                    state: msg.state,
                                    zipcode: msg.zipcode,
                                    email: msg.email,
                                    isAdmin: 0
                                };
                                coll.insertOne(myobj, function (err, u) {
                                    if (err) return err;
                                    else {
                                        console.log("record is inserted");
                                    }
                                });



                            }
                        });
                    });
                    // callback(null,res);
                }
                callback(null,res);
            },getUser2);
        }
    },getUser1);
}
exports.handle_request = handle_request;