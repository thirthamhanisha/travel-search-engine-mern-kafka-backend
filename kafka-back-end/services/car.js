
var mysql = require("./mysql");
function handle_request(msg, callback){
    var carServiceCount;
    var service="Car Searching Page";
    var getUser="select count from servicesCount where service='"+service+"'";
    console.log("Query:"+getUser);
    mysql.fetchData(function(err,results){

        console.log("Car Service count:"+JSON.stringify(results));

        console.log("car service count:"+JSON.stringify(results[0].count));
        carServiceCount=+JSON.stringify(results[0].count);



        carServiceCount++;
        console.log("carServiceCount:"+carServiceCount);

        var getUser="update servicesCount set count='"+carServiceCount+"' where service='"+service+"'";
        console.log("Query is:"+getUser);
        mysql.fetchData(function(err,results){
            if(err) throw err;
            console.log(results.affectedRows + "records updated");

        },getUser);
    },getUser);
    if(msg.filter === 0) {
        console.log("msg:" + msg.filter);
        var res = {};
        console.log("handle request");
        console.log("In handle request : get list of cars based on the filter criteria" + JSON.stringify(msg));

        console.log("location:" + msg.location);
        console.log("startDate:" + msg.startDate);

        console.log("endDate" + msg.endDate);


        var getUser = "select * from CarDemo where location='" + msg["location"] + "' and seatCount='" + msg["seatCount"] + "' and carID not in (select carID from Availability where startDate between '" + msg["startDate"] + "' and '" + msg["endDate"] + "' and endDate between '" + msg["startDate"] + "' and '" + msg["endDate"] + "')";
//var getUser ="select * from carDemo where location='"+msg.location+"' and seatCount = '"+msg.seatCount+"'";
        console.log("Query is:" + getUser);

        mysql.fetchData(function (err, results) {
            console.log(results.length);
            if (err) {
                throw err;
            }
            else {
                console.log(results.length);
                if (results.length > 0) {
                    console.log(results);

                    res.value = "200";
                    res.message = results;
                    //value="200";
                    //message=results;
                    //results.send(value,message);
                    callback(null, res);
                }
                else {

                    console.log("no cars fetched with the given preferences");

                    res.value = "404";
                    res.message = "cars unavailable with the given search criteria";
                    callback(null, res);
                }
            }
        }, getUser);

    }else if(msg.filter ===1){
        console.log("msg:" + msg.city);
        var res = {};
        console.log("handle request");
        console.log("In handle request : get list of cars based on the filter criteria" + JSON.stringify(msg));

        console.log("location:" + msg.location);
        console.log("startDate:" + msg.startDate);

        console.log("endDate" + msg.endDate);


        var getUser = "select * from CarDemo where carType = '"+msg.carType+"' and location='" + msg["location"] + "' and seatCount='" + msg["seatCount"] + "' and carID not in (select carID from Availability where startDate between '" + msg["startDate"] + "' and '" + msg["endDate"] + "' and endDate between '" + msg["startDate"] + "' and '" + msg["endDate"] + "' )";

        console.log("Query is:" + getUser);

        mysql.fetchData(function (err, results) {
            console.log(results.length);
            if (err) {
                throw err;
            }
            else {
                console.log(results.length);
                if (results.length > 0) {
                    console.log(results);

                    res.value = "200";
                    res.message = results;
                    //value="200";
                    //message=results;
                    //results.send(value,message);
                    callback(null, res);
                }
                else {

                    console.log("no cars fetched with the given preferences");

                    res.value = "404";
                    res.message = "cars unavailable with the given search criteria";
                    callback(null, res);
                }
            }
        }, getUser);
    }else if(msg.filter == 2){
        console.log("msg:" + msg.city);
        var res = {};
        console.log("handle request");
        console.log("In handle request : get list of cars based on the filter criteria" + JSON.stringify(msg));

        console.log("location:" + msg.location);
        console.log("startDate:" + msg.startDate);

        console.log("endDate" + msg.endDate);


        var getUser = "select * from CarDemo where price between '"+msg.minPrice+"' and '"+msg.maxPrice+"' and location='" + msg["location"] + "' and seatCount='" + msg["seatCount"] + "' and carID not in (select carID from Availability where startDate between '" + msg["startDate"] + "' and '" + msg["endDate"] + "' and endDate between '" + msg["startDate"] + "' and '" + msg["endDate"] + "')";

        console.log("Query is:" + getUser);

        mysql.fetchData(function (err, results) {
            console.log(results.length);
            if (err) {
                throw err;
            }
            else {
                console.log(results.length);
                if (results.length > 0) {
                    console.log(results);

                    res.value = "200";
                    res.message = results;
                    //value="200";
                    //message=results;
                    //results.send(value,message);
                    callback(null, res);
                }
                else {

                    console.log("no cars fetched with the given preferences");

                    res.value = "404";
                    res.message = "cars unavailable with the given search criteria";
                    callback(null, res);
                }
            }
        }, getUser);
    }else{
        console.log("msg:" + msg.city);
        var res = {};
        console.log("handle request");
        console.log("In handle request : get list of cars based on the filter criteria" + JSON.stringify(msg));

        console.log("location:" + msg.location);
        console.log("startDate:" + msg.startDate);

        console.log("endDate" + msg.endDate);


        var getUser = "select * from CarDemo where carType='"+msg.carType+"' and price between '"+msg.minPrice+"' and '"+msg.maxPrice+"' and location='" + msg["location"] + "' and seatCount='" + msg["seatCount"] + "' and carID not in (select carID from Availability where startDate between '" + msg["startDate"] + "' and '" + msg["endDate"] + "' and endDate between '" + msg["startDate"] + "' and '" + msg["endDate"] + "')";

        console.log("Query is:" + getUser);

        mysql.fetchData(function (err, results) {
            console.log(results.length);
            if (err) {
                throw err;
            }
            else {
                console.log(results.length);
                if (results.length > 0) {
                    console.log(results);

                    res.value = "200";
                    res.message = results;
                    //value="200";
                    //message=results;
                    //results.send(value,message);
                    callback(null, res);
                }
                else {

                    console.log("no cars fetched with the given preferences");

                    res.value = "404";
                    res.message = "cars unavailable with the given search criteria";
                    callback(null, res);
                }
            }
        }, getUser);
    }
}

exports.handle_request = handle_request;
