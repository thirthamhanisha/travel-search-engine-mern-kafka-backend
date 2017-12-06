var mysql = require("./mysql");


function handle_request(msg, callback){

    var res = {};
    var getUser = "select username,service,time(date) as time from userTrace where username='"+msg.username+"' and date(date)='"+msg.date+"'";
    mysql.fetchData(function(err,results){
        console.log(results.length);
        if(err){
            console.log("ERROR");
        }
         if(results.length>0){
            res.value = "200";
            //  res.message= results;
            res.message = results;
             callback(null,res);
        }
        else{
             res.value = "404";
             res.message = "records not fetched";
             callback(null,res);
         }
    },getUser);

}

exports.handle_request = handle_request;