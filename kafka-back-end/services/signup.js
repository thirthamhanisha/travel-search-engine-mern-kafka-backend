var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/login";
const fs = require('fs');
const fse = require('fs-extra');
var path = require('path');
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var mysql = require("./mysql");

function handle_request(msg, callback){

    var res = {};
    console.log("In handle request:" + JSON.stringify(msg));
    mongo.myconnect(mongoURL, function(){
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('login');
        //   process.nextTick(function(){
        coll.findOne({username: msg.username}, function(err, user){
            if (err) {
                res.value = err;
                res.code = '500';


            }
            if (user)
            {
               // done(null, false, /*req.flash('signupMessage', 'the email already taken')*/);
                res.value = 'user already exists';
                res.code = '401';
            }
            else {
                /*var Ufolder = '../public/uploads/'+msg.username;
                const dir = path.join(__dirname,Ufolder);
                const mkdirSync = function (dirPath) {
                    try {
                        fs.mkdirSync(dirPath)
                    } catch (err) {
                        if (err.code !== 'EEXIST') throw err
                    }
                }*/
                var key ="273"
                var hash = crypto.createHmac('sha512', key); //encrytion using SHA512
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
                    else
                    {
                        console.log("record is inserted");
                    }
                });
                res.value =  msg;
                res.code = 200;
            }
            console.log("inside try:" + res);
            callback(null, res);
        });
              //  done (null, {username:username, password:password, firstname:req.body.firstname, lastname: req.body.lastname});
        var getUser1="insert into users(firstName,lastName, username, password, address,city, state, zipcode, email) values ('"+msg.firstName+"','" + msg.lastName+"','" + msg.username+"','" + msg.password+"','" + msg.address+"','" + msg.city+"','" + msg.state+"','" + msg.zipcode+"','" + msg.email+"', 0)";
        console.log("Query is:"+getUser1);

        mysql.fetchData(function(err,results) { //
            if (err) {
                throw err;
            }
            else {

                console.log(results);
                console.log("records updated");
                res.value = "200";
                res.message = "records inserted successfully in SQL";
                console.log("records inserted successfully in SQL");
            }
            /*console.log("inside try:" + res);
            callback(null, res);*/
        },getUser1);

    });
}



exports.handle_request = handle_request;