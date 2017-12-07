var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/login";
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var mysql = require("./mysql");
function handle_request(msg, callback) {

    var res = {};
    console.log("In handle request:" + JSON.stringify(msg));



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
                res.userDetails = results;
                console.log(res.message);


            }
            else {

                console.log("no users fetched with the name");
                res.value = "404";
                res.message = "No users exists with the given name ";

            }
        }

        //var getUser1 = "select location,count(*) as count from transactionCars group by location order by count desc limit 5;";
        var getUser1 = "select bookID,username,billAmount from transactionHotels where username ='" + msg.username + "'";
        mysql.fetchData(function (err, results) {
            console.log(results.length);
            if (err) {
                throw err;
            }
            else {
                console.log(results.length);
                if (results.length > 0) {
                    console.log(results);

                    res.value = "200";
                    //  res.message= results;
                    console.log("cars location:" + results);
                    res.hotelBills = results;
                    // console.log("cars location"+JSON.stringify(res.carsLocation));
                    //value="200";
                    //message=results;
                    //results.send(value,message);
                    // callback(null, res);
                    //   res.write(message);
                }
                else {

                    console.log("no cars fetched with the given preferences");

                    res.value = "404";
                    res.message = "cars unavailable with the given search criteria";
                    // callback(null,res);
                }
            }
            // var getUser2 = "select hotelName,count(*) as count from transactionHotels group by hotelName order by count desc limit 5;";
            var getUser2 = "select bookID,username,amount from transactionCars where username ='" + msg.username + "'";
            console.log("Query is:" + getUser2);

            mysql.fetchData(function (err, results) {
                console.log(results.length);
                if (err) {
                    throw err;
                }
                else {
                    console.log(results.length);
                    if (results.length > 0) {
                        console.log(results);

                        res.value = "200";
                        //  res.message= results;
                        res.carBills = results;
                        //value="200";
                        //message=results;
                        //results.send(value,message);
                        // callback(null, res);
                        //    res.write(message);


                    }
                    else {

                        console.log("no cars fetched with the given preferences");

                        res.value = "404";
                        res.message = "cars unavailable with the given search criteria";
                        //callback(null,res);
                    }
                }
                //var getUser3 = "select toCity,count(*) as count from transactionFlights group by toCity order by count desc limit 5;";
                var getUser3 = "select bookID,username,price from transactionFlights where username ='" + msg.username + "'";
                console.log("Query is:" + getUser3);

                mysql.fetchData(function (err, results) {
                    console.log(results.length);
                    if (err) {
                        throw err;
                    }
                    else {
                        console.log(results.length);
                        if (results.length > 0) {
                            console.log(results);

                            res.value = "200";
                            //   res.message= results;
                            res.flightBills = results;
                            //value="200";
                            //message=results;
                            //results.send(value,message);
                            //callback(null, res);
                            // res.write(message);

                        }
                        else {

                            console.log("no cars fetched with the given preferences");

                            res.value = "404";
                            res.message = "cars unavailable with the given search criteria";
                            //  callback(null,res);

                        }
                    }
                    console.log("RES"+JSON.stringify(res));

                    callback(null, res);


                }, getUser3);
            }, getUser2);
        }, getUser1);

    },getUser);


}

exports.handle_request = handle_request;
