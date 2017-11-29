var mysql = require("./mysql");
function handle_request(msg, callback){

//var message=[];

    //console.log("msg:"+msg.city);
    var res = {};
    console.log("handle request");


        var getUser1 = "select location,count(*) as count from transactionCars group by location order by count desc limit 5;";
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
                    res.carsLocation = results;
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
            var getUser2 = "select location,count(*) as count from transactionHotels group by location order by count desc limit 5;";
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
                        res.hotelsLocation = results;
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
                var getUser3 = "select toCity,count(*) as count from transactionFlights group by toCity order by count desc limit 5;";
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
                            res.flightsLocation = results;
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

                        }}
                        var getUser4="select sum(amount) as carRevenue from transactionCars;";

                        console.log("Query is:"+getUser1);

                        mysql.fetchData(function(err,results) {
                            console.log(results.length);
                            if (err) {
                                throw err;
                            }
                            else {
                                console.log(results.length);
                                if (results.length > 0) {
                                    console.log(JSON.stringify(results));

                                    res.value = "200";
                                    res.carRevenue = results;
                                    //value="200";
                                    //message=results;
                                    //results.send(value,message);
                                    //  callback(null, res);
                                }
                                else {

                                    console.log("no cars fetched with the given preferences");

                                    res.value = "404";
                                    res.car = "cars unavailable with the given search criteria";
                                    //callback(null,res);
                                }
                            }
                            var getUser5="select sum(amount) as hotelRevenue from transactionHotels;";

                            console.log("Query is:"+getUser5);

                            mysql.fetchData(function(err,results) {
                                console.log(results.length);
                                if (err) {
                                    throw err;
                                }
                                else {
                                    console.log(results.length);
                                    if (results.length > 0) {
                                        console.log(JSON.stringify(results));

                                        res.value = "200";
                                        res.hotelRevenue = results;
                                        //value="200";
                                        //message=results;
                                        //results.send(value,message);
                                        //  callback(null, res);
                                    }
                                    else {

                                        console.log("no cars fetched with the given preferences");

                                        res.value = "404";
                                        res.car = "cars unavailable with the given search criteria";
                                        //callback(null,res);
                                    }
                                }
                                var getUser6="select sum(billAmount) as flightRevenue from transactionFlights;";

                                console.log("Query is:"+getUser6);

                                mysql.fetchData(function(err,results) {
                                    console.log(results.length);
                                    if (err) {
                                        throw err;
                                    }
                                    else {
                                        console.log(results.length);
                                        if (results.length > 0) {
                                            console.log(JSON.stringify(results));

                                            res.value = "200";
                                            res.flightRevenue = results;
                                            //value="200";
                                            //message=results;
                                            //results.send(value,message);
                                            //  callback(null, res);
                                        }
                                        else {

                                            console.log("no cars fetched with the given preferences");

                                            res.value = "404";
                                            res.car = "cars unavailable with the given search criteria";
                                            //callback(null,res);
                                        }
                                    }

                                    var getUser7="select service,count from servicesCount;";

                                    console.log("Query is:"+getUser7);

                                    mysql.fetchData(function(err,results) {
                                        console.log(results.length);
                                        if (err) {
                                            throw err;
                                        }
                                        else {
                                            console.log(results.length);
                                            if (results.length > 0) {
                                                console.log(JSON.stringify(results));

                                                res.value = "200";
                                                res.ServicesCount = results;
                                                //value="200";
                                                //message=results;
                                                //results.send(value,message);
                                                //  callback(null, res);
                                            }
                                            else {

                                                console.log("no cars fetched with the given preferences");

                                                res.value = "404";
                                                res.car = "cars unavailable with the given search criteria";
                                                //callback(null,res);
                                            }
                                        }
                                        callback(null, res);
                                    },getUser7);
                                },getUser6);
                            },getUser5);
                    },getUser4);
                }, getUser3);
            }, getUser2);
        }, getUser1);


  }

exports.handle_request = handle_request;
