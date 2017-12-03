var mysql = require("./mysql");
function handle_request(msg, callback) {

    var res = {};
    var getUser1="select * from carDemo WHERE carID='"+msg.carID+"'";
    console.log("Query is:"+getUser1);
    var getUser2="update carDemo SET  carType='"+msg.carType+"',carName=  '" + msg.carName+"', price='"+msg.price+"',seatCount='"+msg.seatCount+"',location='"+msg.location+"',operator=  '" + msg.operator+"',ratings='"+msg.ratings+"' WHERE carID ='"+msg.carID+"'";
    console.log("Query is:"+getUser2); // this is to decrement the available rooms and increase the booked rooms accordingly in database.

    mysql.fetchData(function(err,results) { //
        if (err) {
            throw err;
        }
        if(results.length>0)
        {
            console.log(results);
            console.log("records updated");
            mysql.fetchData(function(err,results1) { //
                if (err) {
                    throw err;
                    console.log("error in update query");
                }
                else {
                    console.log(results1);
                    res.value = "200";
                    res.message = "car records updated successfully";
                    console.log("success in update query");

                }
                console.log("inside try:" + res);
                callback(null, res);
            },getUser2);
        }
        else
        {
            console.log("car does not exist to edit");
            res.value = "401";
            res.message= "car does not exist to edit";
        }
        console.log("inside try:" + res);
        callback(null, res);
    },getUser1);

}

exports.handle_request = handle_request;
