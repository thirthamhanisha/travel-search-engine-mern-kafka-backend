var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/login";
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var mysql = require("./mysql");
function handle_request(msg, callback){
var hotelSearchServiceCount;
    var service="Hotel Searching Page";
    var getUser="select count from servicesCount where service='"+service+"'";
    console.log("Query:"+getUser);
    mysql.fetchData(function(err,results){

        console.log("hotel Search Service count:"+JSON.stringify(results));

        console.log("hotel search service count:"+JSON.stringify(results[0].count));
        hotelSearchServiceCount=+JSON.stringify(results[0].count);



        hotelSearchServiceCount++;
        console.log("hotelSearchServiceCount:"+hotelSearchServiceCount);

        var getUser="update servicesCount set count='"+hotelSearchServiceCount+"' where service='"+service+"'";
        console.log("Query is:"+getUser);
        mysql.fetchData(function(err,results){
            if(err) throw err;
            console.log(results.affectedRows + "records updated");

        },getUser);
    },getUser);
    var res = {};
    console.log("In handle request:" + JSON.stringify(msg));

        console.log(msg.to + msg.from);
    if(msg.filter === 0){
        var getUser = "select * from hoteldetails where city='" + msg.city + "'and fromDate>='" + msg.from + "'and toDate<= '" + msg.to + "'and availableRooms>='" + msg.roomCount + "'";
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
                    console.log(res);


                }
                else {

                    console.log("no hotels fetched with the given preferences");
                    res.value = "404";
                    res.message = "No hotel exists with the criteria";

                }
                console.log("inside try:" + res);
                callback(null, res);
            }
        }, getUser);}
    else if(msg.filter === 1){
        // var getUser = "select * from hoteldetails where city='" + msg.city + "'and fromDate<='" + msg.from + "'and toDate>= '" + msg.to + "'and availableRooms>='" + msg.roomCount + "'";
       var getUser = "select * from hoteldetails where city='" + msg.city + "'and fromDate>='" + msg.from + "'and toDate<= '" + msg.to + "'and availableRooms>='" + msg.roomCount + "' and starHotel>='"+msg.star+"'";
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
                    console.log(res);


                }
                else {

                    console.log("no hotels fetched with the given preferences");
                    res.value = "404";
                    res.message = "No hotel exists with the criteria";

                }
                console.log("inside try:" + res);
                callback(null, res);
            }
        }, getUser);
    }else if(msg.filter === 2){
         //var getUser = "select * from hoteldetails where city='" + msg.city + "'and fromDate<='" + msg.from + "'and toDate>= '" + msg.to + "'and availableRooms>='" + msg.roomCount + "' and starHotel>='"+msg.star+"'";
         var getUser = "select * from hoteldetails where city='" + msg.city + "'and fromDate>='" + msg.from + "'and toDate<= '" + msg.to + "'and availableRooms>='" + msg.roomCount + "' and amount between '"+msg.minPrice+"' and '"+msg.maxPrice+"'";
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
                    console.log(res);


                }
                else {

                    console.log("no hotels fetched with the given preferences");
                    res.value = "404";
                    res.message = "No hotel exists with the criteria";

                }
                console.log("inside try:" + res);
                callback(null, res);
            }
        }, getUser);
    }else if(msg.filter === 3) {
        //var getUser = "select * from hoteldetails where city='" + msg.city + "'and fromDate<='" + msg.from + "'and toDate>= '" + msg.to + "'and availableRooms>='" + msg.roomCount + "'";

        var getUser = "select * from hoteldetails where city='" + msg.city + "'and fromDate>='" + msg.from + "'and toDate<= '" + msg.to + "'and availableRooms>='" + msg.roomCount + "' and starHotel>='"+msg.star+"' and amount between '"+msg.minPrice+"' and '"+msg.maxPrice+"'";
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
                    console.log(res);


                }
                else {

                    console.log("no hotels fetched with the given preferences");
                    res.value = "404";
                    res.message = "No hotel exists with the criteria";

                }
                console.log("inside try:" + res);
                callback(null, res);
            }
        }, getUser);
    }

    else{
        var getUser = "select * from hoteldetails where city='" + msg.city + "'and fromDate>='" + msg.from + "'and toDate<= '" + msg.to + "'and availableRooms>='" + msg.roomCount + "'";
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
                    console.log(res);


                }
                else {

                    console.log("no hotels fetched with the given preferences");
                    res.value = "404";
                    res.message = "No hotel exists with the criteria";

                }
                console.log("inside try:" + res);
                callback(null, res);
            }
        }, getUser);
    }

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
    var getUser1 = "select * from users where username='" + msg.username + "'";
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
                   //   var msg1 = [];
                 var  msg1 = JSON.stringify(results1[0]);
                 var msg2 = JSON.parse(msg1);
                          console.log("msg1"+msg1);
                    console.log("msg2"+msg2);
                    var key ="273"
                    var hash = crypto.createHmac('sha512', key); //encrytion using SHA512
                    hash.update(msg2.password);
                    msg2.password = hash.digest('hex');
                    var myobj = {
                        user: {
                            username: msg2.username,
                            firstName: msg2.firstName,
                            lastName: msg2.lastName,
                            password: msg2.password,
                            address: msg2.address,
                            city: msg2.city,
                            state: msg2.state,
                            zipcode: msg2.zipcode,
                            email: msg2.email,
                            isAdmin: msg2.isAdmin
                        }
                        ,
                         //   JSON.stringify(results1[0]),
                        hotel: {
                            "city": msg.city,
                            "fromDate": msg.from,
                            "toDate": msg.to,
                            "guestCount":msg.guestCount,
                            "roomCount":msg.roomCount
                        }
                    };
                    console.log(myobj);
                    coll.insertOne(myobj, function (err, u) {
                        if (err)
                            console.log(err);
                            return err;
                        console.log("1 document inserted");

                    });
                    /*res.value =  msg;
                    res.code = 200;*/
                    // }
                    /*console.log("inside try:" + res);
                    callback(null, res);*/
                });

            }
            else {

                console.log("not authorised ");
                res.value = "404";
                res.message = "not authorised ";

            }
            /*console.log("inside try:" + res);
            callback(null, res)*/;
        }
    }, getUser1);

        //  done (null, {username:username, password:password, firstname:req.body.firstname, lastname: req.body.lastname});


   // });
}

exports.handle_request = handle_request
