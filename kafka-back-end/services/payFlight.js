var mysql = require("./mysql");
function handle_request(msg, callback) {
var flightPayServiceCount;
    var service="flightPay";
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
    console.log("In handle request flights:" + JSON.stringify(msg));

    var payDepFlight = "insert into transactionFlights(departureFlightID, returnFlightID, price, noOfSeats, seatType, cardNo, username) values ('"+msg.depFlightID+"','" + msg.retFlightID+"','" + msg.price+"','" + msg.passengerCount+"','" + msg.seatType+"','" +msg.cardDetails+"','" + msg.username+"')";
    console.log("Query is:" + payDepFlight);
    mysql.fetchData(function (err, results) {
        if (err) {
            throw err;
        }
        else {
            console.log(results);
            
            if (results) {

                res.value = "200";
                res.message = results.insertId;
                console.log(res);

            }
            else {
                res.value = "400";
                res.bookingID = "Bad Request";
            }
        }

        var updateSeats="update flightSeatDetails SET availableSeats = (availableSeats - '" + msg.passengerCount+"') WHERE flightID  in ('"+msg.depFlightID+"','"+msg.retFlightID+"') and seatType = '"+msg.seatType+"'";
        console.log("Query is:"+updateSeats);
        mysql.fetchData(function(err,results) {
            if (err) {
                throw err;
            }
            else {
    
                console.log(results);
                console.log("records updated");
                res.value = "200";
                res.message = results;
            }
        },updateSeats);

      callback(null,res);
    }, payDepFlight);
    }

exports.handle_request = handle_request;
