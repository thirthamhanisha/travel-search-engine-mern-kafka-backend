var mysql = require("./mysql");
function handle_request(msg, callback) {

    var res = {};
    console.log("In handle request:" + JSON.stringify(msg));
    if(msg.bookingType="car") {

        var getUser = "select * from transactionCars where bookID='"+msg.billID+"'";
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

                    console.log("no bills exists with the given ID");
                    res.value = "404";
                    res.message = "No bills exists with the given ID ";

                }
                console.log("inside try:" + res);
                callback(null, res);
            }

        }, getUser);
    }else if(bookingType="hotel"){
        var getUser = "select * from transactionHotels where bookID='"+msg.billID+"'";
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

                    console.log("no bills exists with the given ID");
                    res.value = "404";
                    res.message = "No bills exists with the given ID ";

                }
                console.log("inside try:" + res);
                callback(null, res);
            }

        }, getUser);
    }else{
        var getUser = "select * from transactionFlights where bookID='"+msg.billID+"'";
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

                    console.log("no bills exists with the given ID");
                    res.value = "404";
                    res.message = "No bills exists with the given ID ";

                }
                console.log("inside try:" + res);
                callback(null, res);
            }

        }, getUser);
    }


}

exports.handle_request = handle_request;
