var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/login";
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var mysql = require("./mysql");
function handle_request(msg, callback){
var hotelPayServiceCount;
    var service="Hotel Payment Page";
    var getUser="select count from servicesCount where service='"+service+"'";
    console.log("Query:"+getUser);
    mysql.fetchData(function(err,results){

        console.log("hotel pay Service count:"+JSON.stringify(results));

        console.log("hotel pay service count:"+JSON.stringify(results[0].count));
        hotelPayServiceCount=+JSON.stringify(results[0].count);



        hotelPayServiceCount++;
        console.log("hotelSearchServiceCount:"+hotelPayServiceCount);

        var getUser="update servicesCount set count='"+hotelPayServiceCount+"' where service='"+service+"'";
        console.log("Query is:"+getUser);
        mysql.fetchData(function(err,results){
            if(err) throw err;
            console.log(results.affectedRows + "records updated");

        },getUser);
    },getUser);
//<<<<<<< final-branch
    var service="Payment for hotel";
    //var getUser="select count from servicesCount where service='"+service+"'";
    var getUser = "insert into userTrace(service,username,date,time) values('"+service+"','"+msg.username+"',NOW(),6) ";

    console.log("Query:"+getUser);
    mysql.fetchData(function(err,results){


        if(err) throw err;
        console.log(results.affectedRows + "records updated");

    },getUser);
    var res = {};
    console.log("In handle request:" + JSON.stringify(msg));
    console.log(msg.username); //this will be undefined since the sessions are not defined in postman, you can manually give the username and test.
    var getUser="insert into transactionHotels(hotelID,billAmount, noOfRooms, noOfGuests, cardNo,username,location,time,hotelName) values ('"+msg.ID+"','" + msg.billAmount+"','" + msg.roomCount+"','" + msg.guestCount+"','" + msg.cardNo+"','" + msg.username+"','" + msg.location+"',NOW(),'" + msg.hotelName+"')";
    console.log("Query is:"+getUser); // TO CHECK HOW TO INSERT BOOKING id , SHOULD BE INSERT IT EXPLICITLY OR IT WILL AUTO INCREMENT IT? SHULD SEND BOOKING ID
    mysql.fetchData(function(err,results){ // WHAT WILL THE RESULTS PRINT. HAVE TO CHECK.
        if(err){
            throw err;
        }
        else
        {

            console.log(results);
            console.log("records inserted into the transactions table with the bill amount and username");
            res.value = "200";
            res.message= results;
            var getUser1 = "select * from transactionHotels order by bookID desc LIMIT 1";

            mysql.fetchData(function(err,results1){ // WHAT WILL THE RESULTS PRINT. HAVE TO CHECK.
                if(err){
                    throw err;
                }
                else
                {
                    if(results1.length > 0){
                        console.log(results1);
                        console.log("fetching the booking ID from the table");
                        res.value = "200";
                        res.message= results1;


                    }
                    else {

                        console.log("insert valid details");
                        res.value= "401";
                        res.message="invalid details";

                    }
                    console.log("inside try:" + res);
                    callback(null, res);
                }
            },getUser1);


            /* else {

                 console.log("insert valid details");
                 res.value= "401";
                 res.message="invalid details";

             }*/
            /*console.log("inside try:" + res);
            callback(null, res);*/
        }
    },getUser);

    var getUser2="update hotelDetails SET availableRooms =availableRooms - '" + msg.roomCount+"', bookedRooms= bookedRooms + '" + msg.roomCount+"' WHERE hotelID ='"+msg.ID+"'";
    console.log("Query is:"+getUser); // this is to decrement the available rooms and increase the booked rooms accordingly in database.
    mysql.fetchData(function(err,results) { //
        if (err) {
            throw err;
        }
        else {

            console.log(results);
            console.log("records updated");
            res.value = "200";
            res.message = results;
        }
    },getUser2);

}

exports.handle_request = handle_request;
