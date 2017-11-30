var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var cors = require('cors');
require('./routes/passport');

var routes = require('./routes/index');
var users = require('./routes/users');
var mongoSessionURL = "mongodb://localhost:27017/sessions";
var expressSessions = require("express-session");
var mongoStore = require("connect-mongo/es5")(expressSessions);
var kafka = require('./routes/kafka/client');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
}
app.use(cors(corsOptions))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSessions({
    secret: "CMPE273_passport",
    resave: false,
    //Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, //force to save uninitialized session to db.
    //A session is uninitialized when it is new but not modified.
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 6 * 1000,
    store: new mongoStore({
        url: mongoSessionURL
    })
}));
app.use(passport.initialize());
app.use(passport.session());

//method to serialize user for storage
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

// method to de-serialize back for auth
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
     done(err, user);
  });
});

function days_between(date1, date2) {

    // The number of milliseconds in one day
    var ONE_DAY = 1000 * 60 * 60 * 24
     var date1P = Date.parse(date1);
    var date2P = Date.parse(date2);
    console.log(date1P);
    console.log(date2P);
    // Convert both dates to milliseconds
   /* var date1_ms = date1P.getTime();
    var date2_ms = date2P.getTime();*/

    // Calculate the difference in milliseconds
    var difference_ms = Math.abs(date1P - date2P)

    // Convert back to days and return
    return Math.round(difference_ms/ONE_DAY)

}
app.use('/', routes);
app.use('/users', users);

app.post('/logout', function(req,res) {
    console.log(req.session.user);
    req.session.destroy();
    console.log('Session Destroyed');
    res.status(200).send();
});

app.post('/login', function(req, res) {
    passport.authenticate('login', function(err, user) {
        if(err) {
            res.status(500).send();
        }

        if(!user) {
            res.status(401).send("login failed");
        }
        else {
            req.session.user = user.username;
            console.log(user);
            console.log("session initilized");
            res.status(201).send({message: "Login successful", isAdmin: user.value.isAdmin});
        }
    })(req,res);
});

app.post('/signup',function(req,res){
	passport.authenticate('signup', function(err,user){
		if(err){
			res.status(500).send();
		}
		if(user === false){
			res.status(401).send("user already exists, please use a different user name");
		}
		else {
			res.status(201).send("Signup successful, please login");
		}
	})(req,res);
});


app.post('/hotel', function(req, res) {
    console.log(req.body.city);
    console.log(req.body.fromDate);
    console.log(req.body.toDate);
    console.log(req.body.guestCount);
    console.log(req.body.roomCount);
   if (req.body.fromDate <= req.body.toDate) {
       kafka.make_request('hotel_topic', {
           "city": req.body.city, "from": req.body.fromDate, "to": req.body.toDate, "guestCount": req.body.guestCount,
           "roomCount": req.body.roomCount, "username":req.body.username
       }, function (err, results) {
           console.log('in result');
           console.log(results);

           if (err) {
               res.status(500).send(results.message);
           }

           if (results.value == 200) {
               //  done(null,true,results/*{username: username, password: password}*/);
               console.log(results.message);

               var res1 = results.message;

               res.status(201).send({
                   file: res1,
                   city: req.body.city,
                   fromDate: req.body.fromDate,
                   toDate: req.body.toDate,
                   guestCount: req.body.guestCount,
                   roomCount: req.body.roomCount
               });
           }
           if (results.value == 404) {
               //  done(null,true,results/*{username: username, password: password}*/);
               console.log(results.message);

               var res1 = results.message;

               res.status(404).send({
                   file: res1,
                   city: req.body.city,
                   fromDate: req.body.fromDate,
                   toDate: req.body.toDate,
                   guestCount: req.body.guestCount,
                   roomCount: req.body.roomCount
               });
           }
       });
   }
   else{
       res.status(500).send("please enter valid dates");
   }
});

app.post('/hotelDetails', function(req, res) {
    console.log(req.body.hotelID);


    kafka.make_request('hotelDes_topic',{"ID":req.body.hotelID}, function(err,results) {
        console.log('in result');
        console.log(results);

        if (err) {
            res.status(500).send();
        }

            if (results.value == 200) {
                //  done(null,true,results/*{username: username, password: password}*/);
                console.log(results.message);

                var res1 = results.message;

                res.status(201).send({file: res1});
            }
            if (results.value == 404) {
            //  done(null,true,results/*{username: username, password: password}*/);
            console.log(results.message);

            var res1 = results.message;

            res.status(401).send({
                file: res1,
                city: req.body.city,
                fromDate: req.body.fromDate,
                toDate: req.body.toDate,
                guestCount: req.body.guestCount,
                roomCount: req.body.roomCount
            });
        }

    });
});

app.post('/bookHotel', function(req, res) {
    console.log(req.body.hotelID);
    console.log(req.body.fromDate);
    console.log(req.body.toDate);
    console.log(req.body.guestCount);
    console.log(req.body.roomCount);

    kafka.make_request('hotelBook_topic',{"ID": req.body.hotelID, "guestCount": req.body.guestCount, "roomCount": req.body.roomCount, "fromDate" : req.body.fromDate,
    "toDate": req.body.toDate}, function(err,results) {
        console.log('in result');
        console.log(results);
       var days = days_between(req.body.toDate,req.body.fromDate);
       console.log("days" + days);
        if (err) {
            res.status(500).send();
        }

            if (results.value == 200) {
                //  done(null,true,results/*{username: username, password: password}*/);
                console.log(results.message[0]);

                var res1 = results.message[0]; //fetching the price, since there is only one item in an array
                console.log(res1.amount); // taking the amount
                var bill_amount = res1.amount * days * req.body.roomCount; // calculating bill summary
                res.status(201).send({
                    bill_amount: bill_amount,
                    ID: req.body.hotelID,
                    guestCount: req.body.guestCount,
                    roomCount: req.body.roomCount,
                    fromDate: req.body.fromDate,
                    toDate: req.body.toDate
                });
            }

                if (results.value == 404) {
                    //  done(null,true,results/*{username: username, password: password}*/);
                    console.log(results.message);

                    var res1 = results.message;

                    res.status(404).send({
                        file: res1,
                        city: req.body.city,
                        fromDate: req.body.fromDate,
                        toDate: req.body.toDate,
                        guestCount: req.body.guestCount,
                        roomCount: req.body.roomCount
                    });
                }

    });
});

app.post('/payHotel', function(req, res) {
    console.log(req.body.hotelID);
    console.log(req.body.fromDate);
    console.log(req.body.toDate);
    console.log(req.body.guestCount);
    console.log(req.body.roomCount);
    console.log(req.body.cardNo);

    kafka.make_request('hotelPay_topic',{"ID": req.body.hotelID, "guestCount": req.body.guestCount, "roomCount": req.body.roomCount, "fromDate" : req.body.fromDate,
        "toDate": req.body.toDate, "billAmount": req.body.billAmount, "cardNo":req.body.cardNo, "username":req.body.username /*req.session.user*/, "location": req.body.location, "hotelName": req.body.hotelName}, function(err,results) {
        console.log('in result');
        console.log(results);

        if (err) {
            res.status(500).send();
        }

            if (results.value == 200) {
                //  done(null,true,results/*{username: username, password: password}*/);
                console.log("in 200 " + results.message);

                var res1 = results.message;

                res.status(201).send({
                    file: res1,
                    message: "booking confirmed with booking ID: ",
                    ID: req.body.hotelID,
                    guestCount: req.body.guestCount,
                    roomCount: req.body.roomCount,
                    fromDate: req.body.fromDate,
                    toDate: req.body.toDate,
                    cardNo: req.body.cardNo
                });
            }
                if (results.value == 401) {
                    //  done(null,true,results/*{username: username, password: password}*/);
                    console.log(results.message);

                    var res1 = results.message;

                    res.status(401).send({
                        file: res1,
                        city: req.body.city,
                        fromDate: req.body.fromDate,
                        toDate: req.body.toDate,
                        guestCount: req.body.guestCount,
                        roomCount: req.body.roomCount
                    });
                }

    });
});
app.post('/admin/hotel/addHotel', function(req, res) {

    kafka.make_request('hotelAdd_topic',{"hotelName": req.body.hotelName, "city": req.body.city, "fromDate": req.body.fromDate, "toDate" : req.body.toDate,
        "availableRooms": req.body.availableRooms, "guestCount": req.body.guestCount, "starHotel":req.body.starHotel, "ratings": req.body.ratings, "amount":req.body.amount }, function(err,results) {
        console.log('in result');
        console.log(results);

        if (err) {
            res.status(500).send();
        }

        if (results.value == 200) {
            //  done(null,true,results/*{username: username, password: password}*/);
            console.log("in 200 " + results.message);

            var res1 = results.message;

            res.status(201).send({
                file: res1,
                "hotelName": req.body.flightName, "city": req.body.city, "fromDate": req.body.fromDate, "toDate" : req.body.toDate,
                "availableRooms": req.body.availableRooms, "guestCount": req.body.guestCount, "starHotel":req.body.starHotel, "ratings": req.body.ratings,
                "amount":req.body.amount
            });
        }
        /* if (results.value == 401) {
             //  done(null,true,results/!*{username: username, password: password}*!/);
             console.log(results.message);

             var res1 = results.message;

             res.status(401).send({
                 file: res1,
                 city: req.body.city,
                 fromDate: req.body.fromDate,
                 toDate: req.body.toDate,
                 guestCount: req.body.guestCount,
                 roomCount: req.body.roomCount
             });
         }*/

    });
});
app.post('/admin/hotel/fetchHotel', function(req, res) {  //to fetch flights for admin



    kafka.make_request('hotelFetch_topic',{"hotelName": req.body.hotelName, "hotelID":req.body.hotelID }, function(err,results) {
        console.log('in result');
        console.log(results);

        if (err) {
            res.status(500).send();
        }

        if (results.value == 200) {
            //  done(null,true,results/*{username: username, password: password}*/);
            console.log("in 200 " + results.message);

            var res1 = results.message;

            res.status(201).send({file: res1[0], "flightName": req.body.flightName, "flightID": req.body.flightID});
        }
        if (results.value == 404) {
            //  done(null,true,results/*{username: username, password: password}*/);
            console.log("in 404" + results.message);

            var res1 = results.message;

            res.status(401).send({
                file: res1,
                "flightName": req.body.flightName, "flightID": req.body.flightID
            });
        }

    });
});

app.post('/admin/hotel/EditHotel', function(req, res) {  //to fetch flights for admin



    kafka.make_request('hotelEdit_topic',{"hotelName": req.body.hotelName, "hotelID":req.body.hotelID, "city":req.body.city,
        "fromDate":req.body.fromDate,"toDate":req.body.toDate,"availableRooms":req.body.availableRooms,
        "guestCount":req.body.guestCount,"starHotel":req.body.starHotel,"ratings":req.body.ratings, "amount":req.body.amount, "bookedRooms":req.body.bookedRooms  }, function(err,results) {
        console.log('in result');
        console.log(results);

        if (err) {
            res.status(500).send();
        }

        if (results.value == 200) {
            //  done(null,true,results/*{username: username, password: password}*/);
            console.log("in 200 " + results.message);

            var res1 = results.message;

            res.status(201).send({file: res1, "hotelName": req.body.hotelName, "hotelID":req.body.hotelID, "city":req.body.city,
                "fromDate":req.body.fromDate,"toDate":req.body.toDate,"availableRooms":req.body.availableRooms,
                "guestCount":req.body.guestCount,"starHotel":req.body.starHotel,"ratings":req.body.ratings, "amount":req.body.amount, "bookedRooms":req.body.bookedRoom});
        }
        if (results.value == 404) {
            //  done(null,true,results/*{username: username, password: password}*/);
            console.log("in 404" + results.message);

            var res1 = results.message;

            res.status(401).send({
                file: res1,
                "flightName": req.body.flightName, "flightID": req.body.flightID
            });
        }

    });
});
app.post('/admin/flights/addFlight', function(req, res) {
    console.log(req.body.flightName);
    console.log(req.body.operator);
    console.log(req.body.departureTime);
    console.log(req.body.arrivalTime);
    console.log(req.body.fromCity);
    console.log(req.body.toCity);
    console.log(req.body.fromDate);
    console.log(req.body.price);
    console.log(req.body.seatCount);
    console.log(req.body.seatType);

    kafka.make_request('flightAdd_topic',{"flightName": req.body.flightName, "operator": req.body.operator, "departureTime": req.body.departureTime, "arrivalTime" : req.body.arrivalTime,
        "fromCity": req.body.fromCity, "toCity": req.body.toCity, "fromDate":req.body.fromDate, "price": req.body.price, "seatCount":req.body.seatCount, "seatType": req.body.seatType }, function(err,results) {
        console.log('in result');
        console.log(results);

        if (err) {
            res.status(500).send();
        }

        if (results.value == 200) {
            //  done(null,true,results/*{username: username, password: password}*/);
            console.log("in 200 " + results.message);

            var res1 = results.message;

            res.status(201).send({
                file: res1,
                "flightName": req.body.flightName,
                "operator": req.body.operator,
                "departureTime": req.body.departureTime,
                "arrivalTime": req.body.arrivalTime,
                "fromCity": req.body.fromCity,
                "toCity": req.body.toCity,
                "fromDate": req.body.fromDate,
                "price": req.body.price,
                "seatCount": req.body.seatCount,
                "seatType": req.body.seatType
            });
        }
           /* if (results.value == 401) {
                //  done(null,true,results/!*{username: username, password: password}*!/);
                console.log(results.message);

                var res1 = results.message;

                res.status(401).send({
                    file: res1,
                    city: req.body.city,
                    fromDate: req.body.fromDate,
                    toDate: req.body.toDate,
                    guestCount: req.body.guestCount,
                    roomCount: req.body.roomCount
                });
            }*/

    });
});
app.post('/admin/flights/fetchFlight', function(req, res) {  //to fetch flights for admin
    console.log(req.body.flightName);
    console.log(req.body.flightID);


    kafka.make_request('flightFetch_topic',{"flightName": req.body.flightName, "flightID":req.body.flightID }, function(err,results) {
        console.log('in result');
        console.log(results);

        if (err) {
            res.status(500).send();
        }

        if (results.value == 200) {
            //  done(null,true,results/*{username: username, password: password}*/);
            console.log("in 200 " + results.message);

            var res1 = results.message;

            res.status(201).send({file: res1[0], "flightName": req.body.flightName, "flightID": req.body.flightID});
        }
            if (results.value == 404) {
                //  done(null,true,results/*{username: username, password: password}*/);
                console.log("in 404" + results.message);

                var res1 = results.message;

                res.status(401).send({
                    file: res1,
                    "flightName": req.body.flightName, "flightID": req.body.flightID
                });
            }

    });
});

app.post('/admin/flights/editFlight', function(req, res) {  //to fetch flights for admin
    console.log(req.body.flightName);
    console.log(req.body.flightID);
    console.log(req.body.operator);console.log(req.body.fromCity);
    console.log(req.body.toCity);
    console.log(req.body.fromDate);
    console.log(req.body.seatCount);
    console.log(req.body.departureTime);
    console.log(req.body.arrivalTime);
    console.log(req.body.price);
    console.log(req.body.seatType);


     kafka.make_request('flightEdit_topic',{"flightName": req.body.flightName, "flightID":req.body.flightID, "operator":req.body.operator,
         "fromCity":req.body.fromCity,"toCity":req.body.toCity,"fromDate":req.body.fromDate,"seatCount":req.body.seatCount,
         "departureTime":req.body.departureTime,"arrivalTime":req.body.arrivalTime,"price":req.body.price, "seatType":req.body.seatType }, function(err,results) {
        console.log('in result');
        console.log(results);

        if (err) {
            res.status(500).send();
        }

        if (results.value == 200) {
            //  done(null,true,results/*{username: username, password: password}*/);
            console.log("in 200 " + results.message);

            var res1 = results.message;

            res.status(201).send({file: res1, "flightName": req.body.flightName, "flightID":req.body.flightID, "operator":req.body.operator,
                "fromCity":req.body.fromCity,"toCity":req.body.toCity,"fromDate":req.body.fromDate,"seatCount":req.body.seatCount,
                "departureTime":req.body.departureTime,"arrivalTime":req.body.arrivalTime,"price":req.body.price, "seatType":req.body.seatType });
        }
            /*if (results.value == 404) {
                //  done(null,true,results/!*{username: username, password: password}*!/);
                console.log(results.message);

                var res1 = results.message;

                res.status(401).send({
                    file: res1,
                    "flightName": req.body.flightName, "flightID": req.body.flightID
                });
            }*/

    });
});

app.post('/admin/users/addUser', function(req, res) {
    console.log(req.body.username);
    console.log(req.body.firstName);
    console.log(req.body.lastName);
    console.log(req.body.password);
    console.log(req.body.city);
    console.log(req.body.address);
    console.log(req.body.state);
    console.log(req.body.zipcode);
    console.log(req.body.email);


    kafka.make_request('userAdd_topic',{"username": req.body.username, "firstName":req.body.firstName, "lastName":req.body.lastName,
        "password":req.body.password,"city":req.body.city,"address":req.body.address,"state":req.body.state,
        "zipcode":req.body.zipcode,"email":req.body.email }, function(err,results) {
        console.log('in result');
        console.log(results);

        if (err) {
            res.status(500).send();
        }

        if (results.code == 200) {
            //  done(null,true,results/*{username: username, password: password}*/);
            console.log("in 200 " + results.value);

            var res1 = results.value;

            res.status(201).send({
                file: res1,
                msg: "user has been inserted successfully",
                "username": req.body.username, "firstName":req.body.firstName, "lastName":req.body.lastName,
                "password":req.body.password,"city":req.body.city,"address":req.body.address,"state":req.body.state,
                "zipcode":req.body.zipcode,"email":req.body.email
            });
        }
         if (results.code == 401) {
             //  done(null,true,results/!*{username: username, password: password}*!/);
             console.log(results.value);

             var res1 = results.value;

             res.status(401).send({
                 file: res1,
                 city: req.body.city,
                 fromDate: req.body.fromDate,
                 toDate: req.body.toDate,
                 guestCount: req.body.guestCount,
                 roomCount: req.body.roomCount
             });
         }

    });
});
app.post('/admin/users/fetchUser', function(req, res) {  //to fetch flights for admin
    console.log(req.body.username);



    kafka.make_request('userFetch_topic',{"username": req.body.username }, function(err,results) {
        console.log('in result');
        console.log(results);

        if (err) {
            res.status(500).send();
        }

        if (results.value == 200) {
            //  done(null,true,results/*{username: username, password: password}*/);
            console.log("in 200 " + results.message);

            var res1 = results.message;

            res.status(201).send({file: res1[0]});
        }
        if (results.value == 404) {
            //  done(null,true,results/*{username: username, password: password}*/);
            console.log("in 404" + results.message);

            var res1 = results.message;

            res.status(401).send({
                file: res1,

            });
        }

    });
});

app.post('/admin/users/editUser', function(req, res) {  //to fetch flights for admin
    console.log(req.body.firstName);
    console.log(req.body.username);
    console.log(req.body.lastName);
    console.log(req.body.password);
    console.log(req.body.city);
    console.log(req.body.address);
    console.log(req.body.state);
    console.log(req.body.zipcode);
    console.log(req.body.email);


    kafka.make_request('userEdit_topic',{"username": req.body.username, "firstName":req.body.firstName, "lastName":req.body.lastName,
        "password":req.body.password,"city":req.body.city,"address":req.body.address,"state":req.body.state,
        "zipcode":req.body.zipcode,"email":req.body.email }, function(err,results) {
        console.log('in result');
        console.log(results);

        if (err) {
            res.status(500).send();
        }

        if (results.value == 200) {
            //  done(null,true,results/*{username: username, password: password}*/);
            console.log("in 200 " + results.message);

            var res1 = results.message;

            res.status(201).send({file: res1, "username": req.body.username, "firstName":req.body.firstName, "lastName":req.body.lastName,
                "password":req.body.password,"city":req.body.city,"address":req.body.address,"state":req.body.state,
                "zipcode":req.body.zipcode,"email":req.body.email  });
        }
        if (results.value == 401) {
            //  done(null,true,results/!*{username: username, password: password}*!/);
            console.log(results.message);

            var res1 = results.message;

            res.status(401).send({
                file: res1,
                city: req.body.city,
                fromDate: req.body.fromDate,
                toDate: req.body.toDate,
                guestCount: req.body.guestCount,
                roomCount: req.body.roomCount
            });
        }
         else{
            res.send("user record is edited");
        }

    });
});
app.post('/car', function(req, res) {

 console.log("in car api");
  //  console.log(req.body.city);
  //  console.log(req.body.date);
  //  console.log(req.body.to);


    kafka.make_request('car_topic',{"location":req.body.location,"startDate":req.body.startDate,"endDate":req.body.endDate,"seatCount":req.body.seatCount}, function(err,results) {
        console.log('in result');
        console.log(results);

        if (err) {
            res.status(500).send();
        }
        else {
            if (results.value == 200) {
                //  done(null,true,results/*{username: username, password: password});
                console.log(results.value);

                var res1 = results.value;

                res.status(200).send({message: results});
            }
        }
    });
});
app.post('/carDetails', function(req, res) {
    console.log(req.body.city);
    console.log(req.body.fromDate);
    console.log(req.body.toDate);
    console.log(req.body.guestCount);
    console.log(req.body.roomCount);

    kafka.make_request('carDes_topic',{"carID":req.body.carID}, function(err,results) {
        console.log('in result');
        console.log(results);

        if (err) {
            res.status(500).send();
        }
        else {
            if (results.value == 200) {
                //  done(null,true,results/*{username: username, password: password});
                console.log(results.value);



                res.status(200).send({results: results});
            }
        }
    });
});
app.post('/bookCar', function(req, res) {
    console.log(req.body.carID);
    console.log(req.body.location);
    console.log(req.body.startDate);
    console.log(req.body.endDate);
    console.log(req.body.seatCount);
    var days = days_between(req.body.startDate,req.body.endDate);
    console.log("number of days needed:"+days);
    kafka.make_request('bookCar_topic',{"carID":req.body.carID,"location":req.body.location,"startDate":req.body.startDate, "endDate":req.body.endDate, "seatCount": req.body.seatCount,days:days}, function(err,results) {
        console.log('in result');
        console.log(results);

        if (err) {
            console.log("ERROR");
            res.status(500).send();
        }
        else {
            if (results.value == 200) {
                //  done(null,true,results/*{username: username, password: password});
                console.log(results.message[0]);

              //  var res1 = results.value;
                 var res2 = results.message[0];
                 var bill_amount=res2.price * days;
                 console.log("bill amount: "+bill_amount);
                res.status(200).send({bill_amount: bill_amount,carID:req.body.carID,seatCount:req.body.seatCount,startDate:req.body.startDate,endDate:req.body.endDate,location:req.body.location});
            }
        }
    });
});
app.post('/payCar', function(req, res) {
    console.log(req.body.carID);
    console.log(req.body.startDate);
    console.log(req.body.endDate);
    console.log(req.body.seatCount);
    //console.log(req.body.roomCount);
    console.log(req.body.billAmount);
    console.log(req.body.cardNo);

    kafka.make_request('payCar_topic',{"carID": req.body.carID, "seatCount": req.body.seatCount, "startDate" : req.body.startDate,
        "endDate": req.body.endDate,"location":req.body.location,"billAmount": req.body.billAmount, "cardNo":req.body.cardNo, "username": req.body.username}, function(err,results) {
        console.log('in result');
        console.log(results);

        if (err) {
            res.status(500).send();
        }

        if (results.value == 201) {
            //  done(null,true,results/*{username: username, password: password}*/);
            console.log("in 201 " + results.message);

            var res1 = results.message;

            res.status(201).send({results: results, message: "booking confirmed with booking ID: ",bookID:res1.bookID, carID: req.body.carID, seatCount: req.body.seatCount, startDate : req.body.startDate,
                endDate: req.body.endDate, cardNo : req.body.cardNo, location: req.body.location, billAmount: req.body.billAmount});
            if (results.value == 401) {
                //  done(null,true,results/*{username: username, password: password}*/);
                console.log(results.message);

                var res1 = results.message;

                res.status(201).send({
                    results: res1,
                    bookID: res1.bookID,
                    startDate: req.body.startDate,
                    endDate: req.body.endDate,
                    seatCount: req.body.seatCount,
                    location: req.body.location
                });
            }
        }
    });
});
app.post('/admin/cars/addCar', function(req, res) {
    console.log(req.body.carName);
    console.log(req.body.carType);
    console.log(req.body.operator);
    console.log(req.body.location);
    console.log(req.body.price);
    console.log(req.body.seatCount);
    console.log(req.body.ratings);


    kafka.make_request('carAdd_topic',{"carName": req.body.carName, "carType": req.body.carType, "operator": req.body.operator, "location": req.body.location, "price": req.body.price, "seatCount":req.body.seatCount, "ratings":req.body.ratings }, function(err,results) {
        console.log('in result');
        console.log(results);

        if (err) {
            res.status(500).send();
        }

        if (results.value == 200) {
            //  done(null,true,results/*{username: username, password: password}*/);
            console.log("in 200 " + results.message);

            var res1 = results.message;

            res.status(201).send({
                file: res1,
                "carName": req.body.carName,
                "carType":req.body.carType,
                "operator": req.body.operator,
                "location": req.body.location,
                "price": req.body.price,
                "seatCount": req.body.seatCount,
                "ratings": req.body.ratings
            });
        }
        if (results.value == 404) {
            //  done(null,true,results/*{username: username, password: password}*/);
            console.log(results.message);

            var res1 = results.message;

            res.status(404).send({
                message: res1,

            });
        }

    });
});
app.post('/admin/cars/fetchCar', function(req, res) {  //to fetch flights for admin
    console.log(req.body.carName);
    console.log(req.body.carID);


    kafka.make_request('carFetch_topic',{"carName": req.body.carName, "carID":req.body.carID }, function(err,results) {
        console.log('in result');
        console.log(results);

        if (err) {
            res.status(500).send();
        }

        if (results.value == 200) {
            //  done(null,true,results/*{username: username, password: password}*/);
            console.log("in 200 " + results.message);

            var res1 = results.message;

            res.status(201).send({file: res1, "carName": req.body.carName, "carID": req.body.carID});
        }
        if (results.value == 404) {
            //  done(null,true,results/*{username: username, password: password}*/);
            console.log("in 404" + results.message);

            var res1 = results.message;

            res.status(401).send({
                file: res1,
                "carName": req.body.carName, "carID": req.body.carID
            });
        }

    });
});
app.post('/admin/cars/editcar', function(req, res) {  //to fetch flights for admin
    console.log(req.body.carName);
    console.log(req.body.carID);
    console.log(req.body.carType);
    console.log(req.body.operator);
    console.log(req.body.location);
    console.log(req.body.ratings);
    console.log(req.body.seatCount);
    console.log(req.body.price);



    kafka.make_request('carEdit_topic',{"carName": req.body.carName, "carID":req.body.carID,"carType":req.body.carType, "operator":req.body.operator,
        "location":req.body.location,"seatCount":req.body.seatCount, "price":req.body.price, "ratings":req.body.ratings }, function(err,results) {
        console.log('in result');
        console.log(results);

        if (err) {
            res.status(500).send();
        }

        if (results.value == 200) {
            //  done(null,true,results/*{username: username, password: password}*/);
            console.log("in 200 " + results.message);

            var res1 = results.message;

            res.status(201).send({file: res1, "flightName": req.body.flightName, "flightID":req.body.flightID, "operator":req.body.operator,
                "fromCity":req.body.fromCity,"toCity":req.body.toCity,"fromDate":req.body.fromDate,"seatCount":req.body.seatCount,
                "departureTime":req.body.departureTime,"arrivalTime":req.body.arrivalTime,"price":req.body.price, "seatType":req.body.seatType });
        }
        /*if (results.value == 404) {
            //  done(null,true,results/!*{username: username, password: password}*!/);
            console.log(results.message);
            var res1 = results.message;
            res.status(401).send({
                file: res1,
                "flightName": req.body.flightName, "flightID": req.body.flightID
            });
        }*/

    });
});
app.post('/bills/cars/fromDte/toDate', function(req, res) {
    console.log(req.body.startDate);
    console.log(req.body.toDate);

    kafka.make_request('carBills_topic', {
        "fromDate": req.body.fromDate,
        "toDate": req.body.toDate
    }, function (err, results) {
        console.log('in result');
        console.log(results);


        if (err) {
            res.status(500).send();
        }

        if (results.value == 200) {
            //  done(null,true,results/*{username: username, password: password}*/);
            console.log("in 200 " + results.message);

            var res1 = results.message;

            res.status(201).send({
                results: res1,
                "fromDate": req.body.startDate,
                "toDate": req.body.toDate

            });
        }
        if (results.value == 404) {
            //  done(null,true,results/*{username: username, password: password}*/);
            console.log(results.message);

            var res1 = results.message;

            res.status(404).send({
                message: res1,

            });
        }

    });
});
app.post('/bills/billID', function(req, res) {


    kafka.make_request('bill_topic', {
        "billID": req.body.billID,
        "bookingType":req.body.bookingType

    }, function (err, results) {
        console.log('in result');
        console.log(results);


        if (err) {
            res.status(500).send();
        }

        if (results.value == 200) {
            //  done(null,true,results/*{username: username, password: password}*/);
            console.log("in 200 " + results.message);

            var res1 = results.message;

            res.status(201).send({
                results: res1,
                "fromDate": req.body.startDate,
                "toDate": req.body.toDate

            });
        }
        if (results.value == 404) {
            //  done(null,true,results/*{username: username, password: password}*/);
            console.log(results.message);

            var res1 = results.message;

            res.status(404).send({
                message: res1,

            });
        }

    });
});


app.post('/flight', function(req, res) {
    console.log(req.body.username);
    console.log(req.body.fromCity);
    console.log(req.body.toCity);
    console.log(req.body.departureDate);
    console.log(req.body.returnDate);
    console.log(req.body.seatType);
    console.log(req.body.passengerCount);


    kafka.make_request('flight_topic',{"username": req.body.username, "fromCity":req.body.fromCity, "toCity":req.body.toCity, "departureDate":req.body.departureDate,
    "returnDate":req.body.returnDate, "seatType":req.body.seatType, "passengerCount":req.body.passengerCount},
    function(err,results) {
        console.log('in result');
        console.log(results);

        if (err) {
            res.status(500).send(results.message);
        }
        else {
            if (results.value == 200) {
                //  done(null,true,results/{username: username, password: password}/);

                res.status(200).send(results);
            }
        }    
    });
});



app.post('/flightDetails', function(req,res) {
    console.log(req.body.flightID);
    console.log(req.body.seatType);

    kafka.make_request('flightDes_topic',{"flightID":req.body.flightID, "seatType":req.body.seatType},
    function(err,results) {
        console.log('in result');
        console.log(results);
        
        if (err) {
            res.status(500).send(results.message);
        }

            if (results.value == 200) {
                //  done(null,true,results/*{username: username, password: password}*/);
                res.status(200).send(results);
            }
            if (results.value == 404) {
            //  done(null,true,results/*{username: username, password: password}*/);
            console.log(results.message);

            res.status(404).send(results);
            }    
    });
});

app.post('/bookFlight', function(req,res) {
    console.log(req.body.depFlightID);
    console.log(req.body.retFlightID);
    console.log(req.body.seatType);
    console.log(req.body.passengerCount);

    kafka.make_request('bookFlight_topic',{"depFlightID":req.body.depFlightID, "retFlightID":req.body.retFlightID, "seatType":req.body.seatType, "passengerCount":req.body.passengerCount},
    function(err,results) {
        console.log('in result');
        console.log(results);
        if (err) {
            res.status(500).send(results.message);
        }
        else {
            if (results.value == 200) {
                //  done(null,true,results/{username: username, password: password}/);
                console.log(results.value);
                res.status(200).send(results);
            }
        }    
    });
});
app.post('/payFlight', function(req,res) {
    console.log(req.body.username);
    console.log(req.body.cardDetails)
    console.log(req.body.depFlightID);
    console.log(req.body.retFlightID);
    console.log(req.body.seatType);
    console.log(req.body.passengerCount);
    console.log(req.body.price);

    kafka.make_request('payFlight_topic',{"username":req.body.username,"cardDetails":req.body.cardDetails, "depFlightID":req.body.depFlightID, "retFlightID":req.body.retFlightID, "seatType":req.body.seatType, "passengerCount":req.body.passengerCount, "price":req.body.price},
    function(err,results) {
        console.log('in result');
        console.log(results);
        if (err) {
            res.status(500).send(results.message);
        }
        else {
            if (results.value == 200) {
                //  done(null,true,results/{username: username, password: password}/);
                console.log(results.value);
                res.status(200).send({results});
            }
        }    
    });
});


module.exports = app;
