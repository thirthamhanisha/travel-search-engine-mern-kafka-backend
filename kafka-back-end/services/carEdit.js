var mysql = require("./mysql");
function handle_request(msg, callback) {

    var res = {};

    var getUser2="update carDemo SET  carType='"+msg.carType+"',carName=  '" + msg.carName+"', price='"+msg.price+"',seatCount='"+msg.seatCount+"',location='"+msg.location+"',operator=  '" + msg.operator+"',ratings='"+msg.ratings+"' WHERE carID ='"+msg.carID+"'";
    console.log("Query is:"+getUser2); // this is to decrement the available rooms and increase the booked rooms accordingly in database.
    mysql.fetchData(function(err,results) { //
        if (err) {
            throw err;
        }
        else {

            console.log(results);
            console.log("records updated");
            res.value = "200";
            res.message = "records updated successfully";
        }
        console.log("inside try:" + res);
        callback(null, res);
    },getUser2);

}

exports.handle_request = handle_request;
