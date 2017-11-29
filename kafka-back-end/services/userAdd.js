var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/login";
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var mysql = require("./mysql");
function handle_request(msg, callback) {

    var res = {};
    console.log("In handle request:" + JSON.stringify(msg));
    var key = "273";
    var hash = crypto.createHmac('sha512', key); //encrytion using SHA512
    hash.update(msg.password);
    msg.password = hash.digest('hex');
    var getUser = "insert into users(firstName, lastName, username,password,city,address,state,zipcode,email,isAdmin) values('" + msg.firstName + "','" + msg.lastName + "','" + msg.username + "','" + msg.password + "','" + msg.city + "','" + msg.address + "','" + msg.state + "','" + msg.zipcode + "','" + msg.email + "',0)";
    console.log("Query is:" + getUser);

    mysql.fetchData(function (err, results) {
        if (err) {
            throw err;
        }
        if (results) {
            console.log("user already exists");
            res.value = "401";
            res.message = "the user already exists, please choose an other one";
        }


        else {
            console.log(results);
            res.value = "200";
            res.message = "the records have been inserted into the table users";
        }
        /*else {
            console.log("no hotels fetched with the given preferences");
            res.value = "404";
            res.message = "No hotel exists with the criteria";
        }*/
        console.log("inside try:" + res);
        callback(null, res);

    }, getUser);


    mongo.myconnect(mongoURL, function () {
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('login');
        //   process.nextTick(function(){
        coll.findOne({username: msg.username}, function (err, user) {
            if (err) {
                res.value = err;
                res.code = '500';


            }
            if (user) {
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
                var key = "273"
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
                    else {
                        console.log("record is inserted");
                    }
                });
                res.value = msg;
                res.code = 200;
            }
            console.log("inside try:" + res);
            callback(null, res);
        });
    });
}

exports.handle_request = handle_request;