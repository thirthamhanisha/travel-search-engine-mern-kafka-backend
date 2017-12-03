var mysql = require("./mysql");
function handle_request(msg, callback) {
    if(msg.bookingType=="car") {
        var res = {};
        console.log("In handle request:" + JSON.stringify(msg));

        var getUser = "select * from transactionCars where date between '" + msg.fromDate + "'  and  '" + msg.toDate + "'";
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

                    console.log("no transactions fetched in the given time period");
                    res.value = "404";
                    res.message = "No transactions fetched in the the given time period ";

                }
                console.log("inside try:" + res);
                callback(null, res);
            }

        }, getUser);
    }else if(msg.bookingType == "hotel"){
        var res = {};
        console.log("In handle request:" + JSON.stringify(msg));


        var getUser = "select * from transactionHotels where date(time) between '" + msg.fromDate + "'  and  '" + msg.toDate + "'";
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

                    console.log("no transactions fetched in the given time period");
                    res.value = "404";
                    res.message = "No transactions fetched in the the given time period ";

                }
                console.log("inside try:" + res);
                callback(null, res);
            }

        }, getUser);

    }else{
        var res = {};
        console.log("In handle request:" + JSON.stringify(msg));


        var getUser = "select * from transactionflights where date(time) between '" + msg.fromDate + "'  and  '" + msg.toDate + "'";
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

                    console.log("no transactions fetched in the given time period");
                    res.value = "404";
                    res.message = "No transactions fetched in the the given time period ";

                }
                console.log("inside try:" + res);
                callback(null, res);
            }

        }, getUser);

    }
}

exports.handle_request = handle_request;
