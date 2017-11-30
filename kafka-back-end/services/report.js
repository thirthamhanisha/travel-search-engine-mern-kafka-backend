var mysql = require("./mysql");
function handle_request(msg, callback){


    //console.log("msg:"+msg.city);
    var res = {};
    console.log("handle request");
    console.log("In handle request : get list of cars based on the filter criteria" + JSON.stringify(msg));

    console.log("location:"+msg.location);
    console.log("startDate:"+msg.startDate);

    console.log("endDate"+msg.endDate);


   // var getUser="select * from CarDemo where location='"+msg["location"]+"' and seatCount='"+msg["seatCount"]+"' and carID not in (select carID from Availability where startDate between '"+msg["startDate"]+"' and '"+msg["endDate"]+"' and endDate between '"+msg["startDate"]+"' and '"+msg["endDate"]+"')";
    var getUser="select toCity,count(*) as count from transactionFlights where fromCity =  '"+msg.city+"' and YEAR(time) = '"+msg.year+"' group by toCity order by count desc limit 5;";
    console.log("Query is:"+getUser);

    mysql.fetchData(function(err,results) {
        console.log(results.length);
        if (err) {
            throw err;
        }
        else {
            console.log(results.length);
            if (results.length > 0) {
                console.log(results);

                res.value = "200";
                res.destinationCities = results;
                //value="200";
                //message=results;
                //results.send(value,message);
                //  callback(null, res);
            }
            else {

                console.log("no cars fetched with the given preferences");

                res.value = "404";
                res.message = "cars unavailable with the given search criteria";
                // callback(null,res);
            }
        }
        var getUser1 = "select hotelID, count(*) as count from transactionHotels where location = '"+msg.city+"' and YEAR(time) = '"+msg.year+"' group by location order by count desc limit 5;";

        console.log("Query is:" + getUser1);

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
                    res.hotelBookings = results;
                    //value="200";
                    //message=results;
                    //results.send(value,message);
                    // callback(null, res);
                }
                else {

                    console.log("no cars fetched with the given preferences");

                    res.value = "404";
                    res.message = "cars unavailable with the given search criteria";
                    //callback(null,res);
                }
            }
            var getUser2 = "select carType, count(*) as count from transactioncars where location = '"+msg.city+"' and YEAR(date) = '"+msg.year+"' group by carType order by count  desc limit 5";
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
                        res.carBookings = results;
                        //value="200";
                        //message=results;
                        //results.send(value,message);
                        // callback(null, res);
                    }
                    else {

                        console.log("no cars fetched with the given preferences");

                        res.value = "404";
                        res.message = "cars unavailable with the given search criteria";
                        //callback(null,res);
                    }
                }
               var getUser3= "select sum(amount) as revenue from transactionCars where year(date)='"+msg.year+"' and location ="+msg.city+"";
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
                            res.car = results;
                            //value="200";
                            //message=results;
                            //results.send(value,message);
                            // callback(null, res);
                        }
                        else {

                            console.log("no cars fetched with the given preferences");

                            res.value = "404";
                            res.message = "cars unavailable with the given search criteria";
                            //callback(null,res);
                        }
                    }
                    var getUser4= "select sum(price) as revenue from transactionFlights where year(time)='"+msg.year+"' and location ="+msg.city+"";
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
                                res.flight = results;
                                //value="200";
                                //message=results;
                                //results.send(value,message);
                                // callback(null, res);
                            }
                            else {

                                console.log("no cars fetched with the given preferences");

                                res.value = "404";
                                res.message = "cars unavailable with the given search criteria";
                                //callback(null,res);
                            }
                        }
                        var getUser5= "select sum(billAmount) as revenue from transactionHotels where year(time)='"+msg.year+"' and location ="+msg.city+"";
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
                                    res.hotel = results;
                                    //value="200";
                                    //message=results;
                                    //results.send(value,message);
                                    // callback(null, res);
                                }
                                else {

                                    console.log("no cars fetched with the given preferences");

                                    res.value = "404";
                                    res.message = "cars unavailable with the given search criteria";
                                    //callback(null,res);
                                }
                            }
                            callback(null, res);
                        },getUser5);
                        },getUser4);
                        },getUser3);
                        },getUser2);
        }, getUser1);
    },getUser);


}

exports.handle_request = handle_request;
