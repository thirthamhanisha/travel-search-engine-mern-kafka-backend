var mysql = require("./mysql");
function handle_request(msg, callback) {

    var res = {};
    console.log("In handle request:" + JSON.stringify(msg));

    var getUser = "insert into carDemo(carType, carName, price, seatCount, operator, location, ratings) values('" + msg.carType + "','" + msg.carName + "','" + msg.price + "','" + msg.seatCount + "','" + msg.operator + "','" + msg.location + "','" + msg.ratings + "')";
    console.log("Query is:" + getUser);

    mysql.fetchData(function (err, results) {
        if (err) {
            throw err;
        }

        else  {
            console.log(results);
            res.value = "200";
            res.message = "the records have been inserted into the table carDemo";
        }
        /*else {
            console.log("no hotels fetched with the given preferences");
            res.value = "404";
            res.message = "No hotel exists with the criteria";
        }*/
        console.log("inside try:" + res);
        callback(null, res);

    }, getUser);

}

exports.handle_request = handle_request;
