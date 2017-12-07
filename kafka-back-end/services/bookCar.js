var mysql = require("./mysql");
function handle_request(msg, callback) {
    var carBookServiceCount;
    var service="Car Booking Page";
    var getUser="select count from servicesCount where service='"+service+"'";
    console.log("Query:"+getUser);
    mysql.fetchData(function(err,results){

        console.log("Car book Service count:"+JSON.stringify(results));

        console.log("car book service count:"+JSON.stringify(results[0].count));
        carBookServiceCount=+JSON.stringify(results[0].count);



        carBookServiceCount++;
        console.log("carBookServiceCount:"+carBookServiceCount);

        var getUser="update servicesCount set count='"+carBookServiceCount+"' where service='"+service+"'";
        console.log("Query is:"+getUser);
        mysql.fetchData(function(err,results){
            if(err) throw err;
            console.log(results.affectedRows + "records updated");

        },getUser);
    },getUser);
    var service="Booking car";
    //var getUser="select count from servicesCount where service='"+service+"'";
    var getUser = "insert into userTrace(service,username,date,time) values('"+service+"','"+msg.username+"',NOW(),5) ";
    console.log("Query:"+getUser);
    mysql.fetchData(function(err,results){


        if(err) throw err;
        console.log(results.affectedRows + "records updated");

    },getUser);

    var res = {};
    console.log("In handle request cars:" + JSON.stringify(msg));

    var getUser = "select price from carDemo where carID ='" + msg["carID"] +"'";
    console.log("Query is:" + getUser);
    mysql.fetchData(function (err, results) {
        if (err) {
            throw err;
        }
        else {
            if (results.length > 0) {
                console.log("results"+JSON.stringify(results));

                res.value = "200";
                res.message = results;
                callback(null,res);

            }
            else {

                console.log("no cars fetched with the given preferences");

                res.value = "404";
                res.message = "No car exists with the criteria";
                callback(null,res);

            }
        }
    }, getUser);

}

exports.handle_request = handle_request;
