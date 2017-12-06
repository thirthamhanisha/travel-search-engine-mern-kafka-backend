
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/login";
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var mysql = require("./mysql");

const redis = require('redis');
var client = redis.createClient();
client.on('connect', function () {
    console.log('Connected to Redis...');
});

function handle_request(msg, callback) {

    var res = {};
    console.log("In handle request:" + JSON.stringify(msg));


    var id = msg.username;

//redis fetch

    console.time("Query_time");

    client.get(id, function (err, obj) {

        if (err) {
            console.log(err);
        }

        if (!obj) {
            // MYSQL search
            //  res.render('searchusers', {
            //    error: 'User does not exist'
            // });
            console.log("From SQL database");
            var getUser = "select * from users where username = '" + msg.username + "'";
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
                        console.timeEnd("Query_time");
                        client.set(id, JSON.stringify(results), function(err){
                            if(err){
                                console.log(err);
                            }
                        })

                        console.log(results);
                        results[0].id = id;
                        console.log(JSON.stringify(results[0]));
                        client.expire(id,5);
                    }
                    else {

                        console.log("no users fetched with the name");
                        res.value = "404";
                        res.message = "No users exists with the given name ";

                    }
                    console.log("inside try:" + res);
                    callback(null, res);
                }

            }, getUser);
        }


        else {
            obj = JSON.parse(obj);
            console.log(obj);
            //console.log(obj);
            console.timeEnd("Query_time");
            console.log("From redis");
            obj.username = id;
         //   console.log(results);
            res.value = "200";
            res.message = obj;
            callback(null, res);
        }
    });
}

exports.handle_request = handle_request;
