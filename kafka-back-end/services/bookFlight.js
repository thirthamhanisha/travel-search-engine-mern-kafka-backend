var mysql = require("./mysql");
function handle_request(msg, callback) {
   var flightBookServiceCount;
    var service="flightBook";
    var getUser="select count from servicesCount where service='"+service+"'";
    console.log("Query:"+getUser);
    mysql.fetchData(function(err,results){

        console.log("flight Service count:"+JSON.stringify(results));

        console.log("flight service count:"+JSON.stringify(results[0].count));
        flightBookServiceCount=+JSON.stringify(results[0].count);



        flightBookServiceCount++;
        console.log("carServiceCount:"+flightBookServiceCount);

        var getUser="update servicesCount set count='"+flightBookServiceCount+"' where service='"+service+"'";
        console.log("Query is:"+getUser);
        mysql.fetchData(function(err,results){
            if(err) throw err;
            console.log(results.affectedRows + "records updated");

        },getUser);
    },getUser);
    var res = {};
    console.log("In handle request flights:" + JSON.stringify(msg)); 
    console.log(msg);
    if(!isNaN(msg.retFlightID)) {
        
    var getDepPrice = "select price from flightSeatDetails fsd inner join flightDetails fd on fsd.flightID = fd.flightID where fd.flightID ='" + msg.depFlightID +"'and seatType ='"+msg.seatType+"'and availableSeats >='"+msg.passengerCount+"'";
    console.log("Query is:" + getDepPrice);

    mysql.fetchData(function (err, results) {
        if (err) {
            throw err;
        }
        else {
            
            if (results.length > 0) {
                console.log("results");

                res.value = "200";
                res.message = "";
                res.departure = {};
                res.departure.value = "200";
                res.departure.message = "";
                res.departure.price = results[0].price*msg.passengerCount;
                console.log(res);

            }
            else {
                res.value = "400";
                res.message = "Bad Request";
            }
        }

    var getRetPrice = "select price from flightSeatDetails fsd inner join flightDetails fd on fsd.flightID = fd.flightID where fd.flightID ='" + msg.retFlightID +"'and seatType ='"+msg.seatType+"'and availableSeats >='"+msg.passengerCount+"'";
    console.log("Query is:" + getRetPrice);
    
    mysql.fetchData(function (err, results) {
        if (err) {
            throw err;
        }
        else {
            
            if (results.length > 0) {
                console.log("results");
                res.value = "200";
                res.message = "";
                res.return = {};
                res.return.value = "200";
                res.return.message = "";
                res.return.price = results[0].price*msg.passengerCount;
                console.log(res);

            }
            else {
                res.value = "400";
                res.message = "Bad Request";
            }
        }
        callback(null,res);
    },getRetPrice);  
    }, getDepPrice);
    
    }

else {
    var getDepPrice = "select price from flightSeatDetails fsd inner join flightDetails fd on fsd.flightID = fd.flightID where fd.flightID ='" + msg.depFlightID +"'and seatType ='"+msg.seatType+"'and availableSeats >='"+msg.passengerCount+"'";
    console.log("Query is:" + getDepPrice);

    mysql.fetchData(function (err, results) {
        if (err) {
            throw err;
        }
        else {
            
            if (results.length > 0) {
                console.log("results");

                res.value = "200";
                res.message = "";
                res.departure={};
                res.departure.value = "200";
                res.departure.message = "";
                res.departure.price = results[0].price*msg.passengerCount;
                console.log(res);
            }
            else {
                res.value = "400";
                res.message = "Bad Request";
            }
        }
        callback(null,res);
},getDepPrice);
}
}

exports.handle_request = handle_request;