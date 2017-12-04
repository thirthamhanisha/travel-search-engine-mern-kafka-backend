var mysql = require("./mysql");
var uuid = require('uuid/v4');
function handle_request(msg, callback) {
var flightPayServiceCount;
    var service="Flight Payment Page";
    var getUser="select count from servicesCount where service='"+service+"'";
    console.log("Query:"+getUser);
    mysql.fetchData(function(err,results){

        console.log("flight pay Service count:"+JSON.stringify(results));

        console.log("flight pay service count:"+JSON.stringify(results[0].count));
        flightPayServiceCount=+JSON.stringify(results[0].count);



        flightPayServiceCount++;
        console.log("flightPayServiceCount:"+flightPayServiceCount);

        var getUser="update servicesCount set count='"+flightPayServiceCount+"' where service='"+service+"'";
        console.log("Query is:"+getUser);
        mysql.fetchData(function(err,results){
            if(err) throw err;
            console.log(results.affectedRows + "records updated");

        },getUser);
    },getUser);
    var res = {};
    var bookID = uuid();
    console.log("In handle request flights:" + JSON.stringify(msg));

    
        
    var getDepPrice = "select fd.* from flightSeatDetails fsd inner join flightDetails fd on fsd.flightID = fd.flightID where fd.flightID ='" + msg.depFlightID +"'and seatType ='"+msg.seatType+"'and availableSeats >='"+msg.passengerCount+"'";
    console.log("Query is:" + getDepPrice);

    mysql.fetchData(function (err, results) {
        if (err) {
            res.value = "500";
            res.message = {};
            callback(null,res);
            throw err;
        }
        else {
            
            if (results.length > 0) {
                console.log(results);

                res.value = "200";
                res.message = {};
                res.message.bookID = bookID;
                console.log(res);

                var payDepFlight = "insert into transactionFlights(bookID, flightID, fromCity, toCity, price, noOfSeats, seatType, cardNo, username) values ('" + bookID + "', '"+msg.depFlightID+"', '" + results[0]["fromCity"] + "', '" + results[0]["toCity"] + "',  '" + msg.price+"','" + msg.passengerCount+"','" + msg.seatType+"','" +msg.cardDetails+"','" + msg.username+"')";
                console.log("Query is:" + payDepFlight);
                mysql.fetchData(function (err, results) {
                    if (err) {
                        res.value = "500";
                        res.message = {};
                        callback(null,res);
                        throw err;
                    }
                    else {
                        console.log(results);
                        
                        if (results) {
                            res.value = "200";
                            res.message = {}
                            res.message.bookID = bookID;
                            console.log(res);
                            var updateSeats="update flightSeatDetails SET availableSeats = (availableSeats - '" + msg.passengerCount+"') WHERE flightID  in ('"+msg.depFlightID+"') and seatType = '"+msg.seatType+"'";
                            console.log("Query is:"+updateSeats);
                            mysql.fetchData(function(err,results) {
                                if (err) {
                                    res.value = "500";
                                    res.message = {};
                                    callback(null,res);
                                    throw err;
                                }
                                else {
                                    console.log(results);
                                    console.log("records updated");
                                    res.value = "200";
                                    res.message = {}
                                    res.message.bookID = bookID;
                                    console.log(res);
                                    callback(null,res);
                                }
                            },updateSeats);
                        }
                        else {
                            res.value = "400";
                            res.message = {}
                            res.message.bookID = "";
                            callback(null,res);
                        }
                    }
                }, payDepFlight);

                if(!isNaN(msg.retFlightID)) {
                    var getRetPrice = "select fd.* from flightSeatDetails fsd inner join flightDetails fd on fsd.flightID = fd.flightID where fd.flightID ='" + msg.retFlightID +"'and seatType ='"+msg.seatType+"'and availableSeats >='"+msg.passengerCount+"'";
                    console.log("Query is:" + getRetPrice);
                
                    mysql.fetchData(function (err, results) {
                        if (err) {
                            res.value = "500";
                            res.message = {};
                            callback(null,res);
                            throw err;
                        }
                        else {
                            if (results.length > 0) {
                                console.log(results);
                                res.value = "200";
                                // res.message.price = res.message.price + results[0].price*msg.passengerCount;
                                var payDepFlight = "insert into transactionFlights(bookID, flightID, fromCity, toCity, price, noOfSeats, seatType, cardNo, username) values ('" + bookID + "', '"+msg.retFlightID+"', '" + results[0]["fromCity"] + "', '" + results[0]["toCity"] + "',  '" + msg.price+"','" + msg.passengerCount+"','" + msg.seatType+"','" +msg.cardDetails+"','" + msg.username+"')";
                                console.log("Query is:" + payDepFlight);
                                mysql.fetchData(function (err, results) {
                                    if (err) {
                                        res.value = "500";
                                        res.message = {};
                                        callback(null,res);
                                        throw err;
                                    }
                                    else {
                                        console.log(results);
                                        
                                        if (results) {
                            
                                            res.value = "200";
                                            res.message = {}
                                            res.message.bookID = bookID;
                                            console.log(res);
                                            var updateSeats="update flightSeatDetails SET availableSeats = (availableSeats - '" + msg.passengerCount+"') WHERE flightID  in ('"+msg.retFlightID+"') and seatType = '"+msg.seatType+"'";
                                            console.log("Query is:"+updateSeats);
                                            mysql.fetchData(function(err,results) {
                                                if (err) {
                                                    res.value = "500";
                                                    res.message = {};
                                                    callback(null,res);
                                                    throw err;
                                                }
                                                else {
                                        
                                                    console.log(results);
                                                    console.log("records updated");
                                                    res.value = "200";
                                                    res.message = {}
                                                    res.message.bookID = bookID;
                                                    console.log(res);
                                                }
                                                callback(null,res);
                                            },updateSeats);
                                        }
                                        else {
                                            res.value = "400";
                                            res.message = {}
                                            res.message.bookID = "";
                                            callback(null,res);
                                        }
                                    }
                                }, payDepFlight);
                                console.log(res);
                            }
                            else {
                                res.value = "400";
                                res.message = {}
                                // res.message = "Bad Request";
                                res.message.bookID = "";
                                callback(null,res);
                            }
                        }
                    },getRetPrice);
                }
                else {
                    callback(null,res);
                }

            }
            else {
                res.value = "400";
                res.message = {}
                res.message.bookID = "";
                callback(null,res);
            }
        }
    }, getDepPrice); 
    }

exports.handle_request = handle_request;
