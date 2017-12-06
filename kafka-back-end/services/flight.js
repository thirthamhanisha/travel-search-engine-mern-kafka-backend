var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/login";
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var moment = require('moment-timezone');
var mysql = require("./mysql");
const timezone = "America/Los_Angeles";
function handle_request(msg, callback){
 var flightSearchServiceCount;
    var service="Flight Searching Page";
    var getUser="select count from servicesCount where service='"+service+"'";
    console.log("Query:"+getUser);
    mysql.fetchData(function(err,results){

        console.log("Flight Search Service count:"+JSON.stringify(results));

        console.log("Flight search service count:"+JSON.stringify(results[0].count));
        flightSearchServiceCount=+JSON.stringify(results[0].count);



        flightSearchServiceCount++;
        console.log("flightSearchServiceCount:"+flightSearchServiceCount);

        var getUser="update servicesCount set count='"+flightSearchServiceCount+"' where service='"+service+"'";
        console.log("Query is:"+getUser);
        mysql.fetchData(function(err,results){
            if(err) throw err;
            console.log(results.affectedRows + "records updated");

        },getUser);
    },getUser);
    var service="Searched for flights";
    //var getUser="select count from servicesCount where service='"+service+"'";
    var getUser = "insert into userTrace(service,username,date) values('"+service+"','"+msg.username+"',NOW()) ";
    console.log("Query:"+getUser);
    mysql.fetchData(function(err,results){


        if(err) throw err;
        console.log(results.affectedRows + "records updated");

    },getUser);
      var res = {};
      console.log("In handle request:" + JSON.stringify(msg));
        console.log(msg.to + msg.from);

            if(msg.filter === 0)
            {

        var departureTime=Date.parse(msg.departureDate);
        if (isNaN(departureTime)==false)
        {
            //valid
            const departureDateStart = moment(msg.departureDate,timezone).format('YYYY-MM-DD 00:00:00');
            const departureDateEnd = moment(msg.departureDate,timezone).format('YYYY-MM-DD 23:59:59');

            var returnTime=Date.parse(msg.returnDate);
            console.log(returnTime)
            console.log(isNaN(returnTime))
            if (isNaN(returnTime)==false)
            {
                //valid
                if(departureTime<returnTime)
                {
                    //valid
                    var getDepFlights = "select * from flightDetails fd inner join flightSeatDetails fsd on fd.flightID = fsd.flightID where fromCity = '"+msg.fromCity+"'and toCity = '"+msg.toCity+"'and departureTime >= '"+departureDateStart+"'and departureTime <= '"+departureDateEnd+"' and seatType = '"+msg.seatType+"'and availableSeats >= '"+msg.passengerCount+"'";
                    console.log("Query is:"+getDepFlights);
        
                    mysql.fetchData(function (err, results) {
                        if (err) {
                            throw err;
                        }
                        else {
                            if (results.length > 0) {
                                console.log(results);
                                res.value = "201";
                                res.message = "";
                                res.departure = {};
                                res.departure.value = "200";
                                res.departure.message = "";
                                res.departure.flights = results;
                                console.log(res);
                            }
                            else {
            
                                res.value = "404";
                                res.message = "";
                                res.departure = {};
                                res.departure.value = "404";
                                res.departure.message = "No flights fetched with the given preferences";
                                res.departure.flights = results;
                            }

                            const returnDateStart = moment(msg.returnDate,timezone).format('YYYY-MM-DD 00:00:00');
                            const returnDateEnd = moment(msg.returnDate,timezone).format('YYYY-MM-DD 23:59:59');

                            var getRetFlights = "select * from flightDetails fd inner join flightSeatDetails fsd on fd.flightID = fsd.flightID where fromCity = '"+msg.toCity+"'and toCity = '"+msg.fromCity+"'and departureTime >= '"+returnDateStart+"'and departureTime <= '"+returnDateEnd+"' and seatType = '"+msg.seatType+"'and availableSeats >= '"+msg.passengerCount+"'";
                            console.log("Query is:"+getRetFlights);
                            
                            mysql.fetchData(function (err, results) {
                                if (err) {
                                    throw err;
                                }
                                else {
                                    if (results.length > 0) {
                                        console.log(results);
                                        res.value = "201";
                                        res.message = "Success";
                                        res.return = {};
                                        res.return.value = "200";
                                        res.return.message = "";
                                        res.return.flights = results;
                                        console.log(res);
                                    }
                                    else {
                                        res.value = "404";
                                        res.message = "";
                                        res.return = {};
                                        res.return.value = "404";
                                        res.return.message = "No return flights fetched with the given preferences";
                                        res.return.flights = results;  
                                    }     
                                    callback(null,res);                             
                                }
                            }, getRetFlights);
                        }
                    }, getDepFlights);
                }
                else
                {
                    //invalid
                    res.value="400";
                    res.message="Return Date should be greater than the Arrival Date.";
                    callback(null,res);
                }
            }
            else
            {
                //invalid
                var getFlights = "select * from flightDetails fd inner join flightSeatDetails fsd on fd.flightID = fsd.flightID where fromCity = '"+msg.fromCity+"'and toCity = '"+msg.toCity+"'and departureTime >= '"+departureDateStart+"'and departureTime <= '"+departureDateEnd+"' and seatType = '"+msg.seatType+"'and availableSeats >= '"+msg.passengerCount+"'";
                console.log("Query is:"+getFlights);
    
                mysql.fetchData(function (err, results) {
                    if (err) {
                        throw err;
                    }
                    else {
                        if (results.length > 0) {
                            console.log(results);
                            res.value = "201";
                            res.message = "Success";
                            res.departure = {}
                            res.departure.value = "200";
                            res.departure.message = "";
                            res.departure.flights = results;
                            console.log(res);
                        }
                        else {
        
                            res.value = "200";
                            res.message = "Success";
                            res.departure = {}
                            res.departure.value = "404";
                            res.departure.message = "No flights fetched with the given preferences";
                            res.departure.flights = results;
                        }
                        res.return = {}
                        res.return.value = "400";
                        res.return.message = "Invalid return date format";
                        res.return.flights = [];
                        callback(null,res);
                    }
                }, getFlights);
            }
        }
         else
        {
            //invalid
            res.value="400";
            res.message="Invalid departure date format";
            callback(null,res);
        }
    }

    else
    {
        var departureTime=Date.parse(msg.departureDate);
        if (isNaN(departureTime)==false)
        {
            //valid
            const departureDateStart = moment(msg.departureDate,timezone).format('YYYY-MM-DD 00:00:00');
            const departureDateEnd = moment(msg.departureDate,timezone).format('YYYY-MM-DD 23:59:59');

            var returnTime=Date.parse(msg.returnDate);
            console.log(returnTime)
            console.log(isNaN(returnTime))
            if (isNaN(returnTime)==false)
            {
                //valid
                if(departureTime<returnTime)
                {
                    //valid
                    var getDepFlights = "select * from flightDetails fd inner join flightSeatDetails fsd on fd.flightID = fsd.flightID where fromCity = '"+msg.fromCity+"'and toCity = '"+msg.toCity+"'and departureTime >= '"+departureDateStart+"'and departureTime <= '"+departureDateEnd+"' and seatType = '"+msg.seatType+"'and availableSeats >= '"+msg.passengerCount+"' and price between '"+msg.minPrice+"' and '"+msg.maxPrice+"'";
                    console.log("Query is:"+getDepFlights);
        
                    mysql.fetchData(function (err, results) {
                        if (err) {
                            throw err;
                        }
                        else {
                            if (results.length > 0) {
                                console.log(results);
                                res.value = "201";
                                res.message = "";
                                res.departure = {};
                                res.departure.value = "200";
                                res.departure.message = "";
                                res.departure.flights = results;
                                console.log(res);
                            }
                            else {
            
                                res.value = "404";
                                res.message = "";
                                res.departure = {};
                                res.departure.value = "404";
                                res.departure.message = "No flights fetched with the given preferences";
                                res.departure.flights = results;
                            }

                            const returnDateStart = moment(msg.returnDate,timezone).format('YYYY-MM-DD 00:00:00');
                            const returnDateEnd = moment(msg.returnDate,timezone).format('YYYY-MM-DD 23:59:59');

                            var getRetFlights = "select * from flightDetails fd inner join flightSeatDetails fsd on fd.flightID = fsd.flightID where fromCity = '"+msg.toCity+"'and toCity = '"+msg.fromCity+"'and departureTime >= '"+returnDateStart+"'and departureTime <= '"+returnDateEnd+"' and seatType = '"+msg.seatType+"'and availableSeats >= '"+msg.passengerCount+"'";
                            console.log("Query is:"+getRetFlights);
                            
                            mysql.fetchData(function (err, results) {
                                if (err) {
                                    throw err;
                                }
                                else {
                                    if (results.length > 0) {
                                        console.log(results);
                                        res.value = "201";
                                        res.message = "Success";
                                        res.return = {};
                                        res.return.value = "200";
                                        res.return.message = "";
                                        res.return.flights = results;
                                        console.log(res);
                                    }
                                    else {
                                        res.value = "404";
                                        res.message = "";
                                        res.return = {};
                                        res.return.value = "404";
                                        res.return.message = "No return flights fetched with the given preferences";
                                        res.return.flights = results;  
                                    }     
                                    callback(null,res);                             
                                }
                            }, getRetFlights);
                        }
                    }, getDepFlights);
                }
                else
                {
                    //invalid
                    res.value="400";
                    res.message="Return Date should be greater than the Arrival Date.";
                    callback(null,res);
                }
            }
            else
            {
                //invalid
                var getFlights = "select * from flightDetails fd inner join flightSeatDetails fsd on fd.flightID = fsd.flightID where fromCity = '"+msg.fromCity+"'and toCity = '"+msg.toCity+"'and departureTime >= '"+departureDateStart+"'and departureTime <= '"+departureDateEnd+"' and seatType = '"+msg.seatType+"'and availableSeats >= '"+msg.passengerCount+"'";
                console.log("Query is:"+getFlights);
    
                mysql.fetchData(function (err, results) {
                    if (err) {
                        throw err;
                    }
                    else {
                        if (results.length > 0) {
                            console.log(results);
                            res.value = "201";
                            res.message = "Success";
                            res.departure = {}
                            res.departure.value = "200";
                            res.departure.message = "";
                            res.departure.flights = results;
                            console.log(res);
                        }
                        else {
        
                            res.value = "401";
                            res.message = "No flights fetched with the given preferences";
                            res.departure = {}
                            res.departure.value = "404";
                            res.departure.message = "No flights fetched with the given preferences";
                            res.departure.flights = results;
                        }
                        res.return = {}
                        res.return.value = "400";
                        res.return.message = "Invalid return date format";
                        res.return.flights = [];
                        callback(null,res);
                    }
                }, getFlights);
            }
        }
         else
        {
            //invalid
            res.value="400";
            res.message="Invalid departure date format";
            callback(null,res);
        }
    }

        var getUser = "select * from users where username='" + msg.username + "'";
        console.log("Query is:" + getUser);
    
        mysql.fetchData(function (err, results1) {
            if (err) {
                throw err;
            }
            else {
                if (results1.length > 0) {
                    console.log(results1);
                    res.value = "200";
                    res.message = results1;
                    console.log(res);
    
                    mongo.myconnect(mongoURL, function(){
                        console.log('Connected to mongo at: ' + mongoURL);
                        var coll = mongo.collection('search');
                        //   process.nextTick(function(){
                              delete results1[0]["password"];
                              console.log(results1[0]);
                        var myobj = {
                            user: results1[0],
                             //   JSON.stringify(results1[0]),
                            flight: {
                                "fromCity": msg.fromCity,
                                "toCity": msg.toCity,
                                "departureDate": msg.departureDate,
                                "returnDate":msg.returnDate,
                                "seatType":msg.seatType,
                                "passengerCount":msg.passengerCount
                            }
                        };
                        console.log("Sending msg to mongo: " + myobj);
                        coll.insertOne(myobj, function (err, u) {
                            if (err)
                                console.log(err);
                                return err;
                            console.log("1 document inserted");
    
                        });
                        res.value =  msg;
                        res.code = 200;
                        // }
                        console.log("inside try:" + res);
                    });
    
                }
                else {
    
                    console.log("not authorised ");
                    res.value = "404";
                    res.message = "not authorised ";
    
                }
                console.log("inside try:" + res);
            }
        }, getUser);
    

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
exports.handle_request = handle_request;
