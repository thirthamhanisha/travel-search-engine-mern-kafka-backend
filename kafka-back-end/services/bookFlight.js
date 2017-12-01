var mysql = require("./mysql");
function handle_request(msg, callback) {

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
                res.message = {};
                res.message.price = results[0].price*msg.passengerCount;
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
                    res.message.price = res.message.price + results[0].price*msg.passengerCount;
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
                res.message = {};
                res.message.price = results[0].price*msg.passengerCount;
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