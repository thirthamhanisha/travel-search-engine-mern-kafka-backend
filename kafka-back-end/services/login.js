
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/login";
//var bcrypt = require('bcrypt');
var crypto = require('crypto');
var mysql = require("./mysql");

function handle_request(msg, callback){
    var loginServiceCount;
    var service=" Login Page";
    var getUser="select count from servicesCount where service='"+service+"'";
    console.log("Query:"+getUser);
    mysql.fetchData(function(err,results){

        console.log("login Service count:"+JSON.stringify(results));

        console.log("login service count:"+JSON.stringify(results[0].count));
        loginServiceCount=+JSON.stringify(results[0].count);



        loginServiceCount++;
        console.log("loginServiceCount:"+loginServiceCount);

        var getUser="update servicesCount set count='"+loginServiceCount+"' where service='"+service+"'";
        console.log("Query is:"+getUser);
        mysql.fetchData(function(err,results){
            if(err) throw err;
            console.log(results.affectedRows + "records updated");

        },getUser);
    },getUser);

    var service="User signing in";
    //var getUser="select count from servicesCount where service='"+service+"'";
    var getUser = "insert into userTrace(service,username,date) values('"+service+"','"+msg.username+"',NOW()) ";
    console.log("Query:"+getUser);
    mysql.fetchData(function(err,results){


        if(err) throw err;
        console.log(results.affectedRows + "records updated");

    },getUser);
    var res = {};
    console.log("In handle request:" + JSON.stringify(msg));

    var key = "273"
    var hash = crypto.createHmac('sha512', key); //encrytion using SHA512
    hash.update(msg.password);
    msg.password = hash.digest('hex');

    var getUser = "select * from users where username = '" + msg.username + "' and password = '" + msg.password + "' ";
    console.log("Query is:" + getUser);

    mysql.fetchData(function (err, results) {
        if (err) {
            throw err;
        }

        else {
            if (results.length > 0) {
                console.log(results);
                res.code = "200";
                res.value = results;
                console.log(res);


            }
            else {

                console.log("no users fetched with the name");
                res.code = "404";
                res.value = "No users exists with the given name ";

            }
            console.log("inside try:" + res);
            callback(null, res);
        }

    }, getUser);
    // mongo.myconnect(mongoURL, function () {
    //     console.log('Connected to mongo at: ' + mongoURL);
    //     var coll = mongo.collection('login');
    //
    //     key = "273";
    //     var hash = crypto.createHmac('sha512', key); //encrytion using SHA512
    //     hash.update(msg.password);
    //     msg.password = hash.digest('hex');
    //
    //     coll.findOne({username: msg.username, password: msg.password}, function (err, user) {
    //
    //         if (user) {
    //             //  done(null,user/* {username: username, password: password}*/);
    //             res.code = "200";
    //             res.value = user;
    //             console.log(user);
    //             console.log(res.value);
    //
    //         } else {
    //             //    done(null, false);
    //             res.code = "401";
    //             res.value = "Failed Login";
    //             console.log(res.value);
    //         }
    //         console.log("inside try:" + res);
    //         callback(null, res);
    //     });
    // })
    /*   }
   catch (e){
       done(e,{});
   }*/
    /*if(msg.username == "bhavan@b.com" && msg.password =="a"){
        res.code = "200";
        res.value = "Success Login";

    }
    else{
        res.code = "401";
        res.value = "Failed Login";
    }*/
    /*console.log("outside try:" + res);
    callback(null, res);*/
}

    // mongo.myconnect(mongoURL, function () {
    //     console.log('Connected to mongo at: ' + mongoURL);
    //     var coll = mongo.collection('login');
    //
    //     key = "273";
    //     var hash = crypto.createHmac('sha512', key); //encrytion using SHA512
    //     hash.update(msg.password);
    //     msg.password = hash.digest('hex');
    //
    //     coll.findOne({username: msg.username, password: msg.password}, function (err, user) {
    //
    //         if (user) {
    //             //  done(null,user/* {username: username, password: password}*/);
    //             res.code = "200";
    //             res.value = user;
    //             console.log(user);
    //             console.log(res.value);
    //
    //         } else {
    //             //    done(null, false);
    //             res.code = "401";
    //             res.value = "Failed Login";
    //             console.log(res.value);
    //         }
    //         console.log("inside try:" + res);
    //         callback(null, res);
    //     });
    // })
    /*   }
   catch (e){
       done(e,{});
   }*/
    /*if(msg.username == "bhavan@b.com" && msg.password =="a"){
        res.code = "200";
        res.value = "Success Login";

    }
    else{
        res.code = "401";
        res.value = "Failed Login";
    }*/
    /*console.log("outside try:" + res);
    callback(null, res);*/


exports.handle_request = handle_request;