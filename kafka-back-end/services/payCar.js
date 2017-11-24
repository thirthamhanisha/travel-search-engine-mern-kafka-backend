
var mysql = require("./mysql");
function handle_request(msg, callback){

    var res = {};
    console.log("In handle request:" + JSON.stringify(msg));
    console.log(msg.username); //this will be undefined since the sessions are not defined in postman, you can manually give the username and test.
    var getUser="insert into transactionCars(carID,amount,cardNo,username) values ('"+msg.carID+"','" + msg.billAmount+"','" + msg.cardNo+"','" + msg.username+"')";
    console.log("Query is:"+getUser); // TO CHECK HOW TO INSERT BOOKING id , SHOULD BE INSERT IT EXPLICITLY OR IT WILL AUTO INCREMENT IT? SHULD SEND BOOKING ID
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
            var getUser1 = "select * from transactionCars order by bookID desc LIMIT 1";

            mysql.fetchData(function(err,results1){ // WHAT WILL THE RESULTS PRINT. HAVE TO CHECK.
                if(err){
                    throw err;
                }
                else
                {
                    if(results1.length > 0){
                        console.log(results1);
                        console.log("fetching the booking ID from the table");
                        res.value = "201";
                        res.message= results1;


                    }
                    else {

                        console.log("insert valid details");
                        res.value= "401";
                        res.message="invalid details";

                    }
                    console.log("inside try:" + res);
                    callback(null, res);
                }
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