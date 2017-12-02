
var mysql = require("./mysql");
function handle_request(msg, callback){
 var payCarServiceCount;
    var service="Car Payment Page";
    var getUser="select count from servicesCount where service='"+service+"'";
    console.log("Query:"+getUser);
    mysql.fetchData(function(err,results){

        console.log("car pay Service count:"+JSON.stringify(results));

        console.log("car pay service count:"+JSON.stringify(results[0].count));
        payCarServiceCount=+JSON.stringify(results[0].count);



        payCarServiceCount++;
        console.log("payCarServiceCount:"+payCarServiceCount);

        var getUser="update servicesCount set count='"+payCarServiceCount+"' where service='"+service+"'";
        console.log("Query is:"+getUser);
        mysql.fetchData(function(err,results){
            if(err) throw err;
            console.log(results.affectedRows + "records updated");

        },getUser);
    },getUser);
    var res = {};
    console.log("In handle request:" + JSON.stringify(msg));
    console.log(msg.username); //this will be undefined since the sessions are not defined in postman, you can manually give the username and test.
    var getUser="insert into transactionCars(carID,amount,cardNo,username,date) values ('"+msg.carID+"','" + msg.billAmount+"','" + msg.cardNo+"','" + msg.username+"',NOW())";
    console.log("Query is:"+getUser);// TO CHECK HOW TO INSERT BOOKING id , SHOULD BE INSERT IT EXPLICITLY OR IT WILL AUTO INCREMENT IT? SHULD SEND BOOKING ID
    mysql.fetchData(function(err,results){ // WHAT WILL THE RESULTS PRINT. HAVE TO CHECK.
        if(err){
            throw err;
        }
        else
        {

            console.log(results);
            console.log("records inserted into the transactions table with the bill amount and username");
            res.value = "201";
            res.message= results;
            //var getUser1 = "select * from transactionCars order by bookID desc LIMIT 1";
            var getUser1 = "insert into Availability(carID,startDate,endDate) values ('"+msg.carID+"','"+msg.startDate+"','"+msg.endDate+"')";
            mysql.fetchData(function(err,results1){ // WHAT WILL THE RESULTS PRINT. HAVE TO CHECK.

                console.log("results1 length",results1.length);
                if(err){
                    throw err;
                }
                else {

                    console.log(JSON.stringify(results1));
                    console.log("inserted the booking ID into the table");
                    res.value = "201";
                    res.message = results1;


                }

                    console.log("inside try:" + JSON.stringify(res));
                    callback(null, res);

            },getUser1);


            /* else {

                 console.log("insert valid details");
                 res.value= "401";
                 res.message="invalid details";

             }*/
            /*console.log("inside try:" + res);
            callback(null, res);*/
        }
    },getUser);



}

exports.handle_request = handle_request;
