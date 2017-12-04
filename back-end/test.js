var http = require('http');
var assert = require('assert');
var should = require('should');

var expect = require('chai').expect;
//var server = require('./server');
var request = require('supertest');

var server = require('./bin/www');

const userCredentials = {
    username: 'first21@last21.com',
    password: 'password'
}

var listen = request.agent('localhost:3001');

describe('Server test', function() {

    /*before(function(){
        serlisten(3001);
    })*/

    describe('Sign up', function () {
        it('Should register the user successfully', function (done) {
            const newUser = {
                firstName: 'first27',
                lastName: 'last27',
                username: 'first27@last27.com',
                password: 'password',
                city: 'San Jose',
                address: 'One Washington Square',
                state: 'California',
                zipcode: '95112',
                email: 'first27@last27.com'
            }
            listen
            .post('/signup')
            .send(newUser)
            .end(function (err, response) {
                expect(response.statusCode).to.equal(201);
                // expect('Location', '/login');
                done();
            });
        });
    });

    describe('Log in', function () {
        it('Should log in the user successfully', function (done) {

            listen
            .post('/login')
            .send(userCredentials)
            .end(function (err, response) {
                expect(response.statusCode).to.equal(201);
                        // expect('Location', '/home');
                        done();
                    });


        });
    });

        describe('Search Cars', function () {
            it('Fetching Car results based on our criteria', function (done) {
                const fetchCars = {
                    location: "San Jose",
                    startDate: "2017-11-22",
                    endDate: "2017-11-23",
                    seatCount: 5,
                    carType: "Economy"
                }
                listen
                    .post('/car')
                    .send(fetchCars)
                    .end(function (err, response) {
                        expect(response.statusCode).to.equal(200    );
                        // expect('Location', '/Welcome');
                        done();
                    });
                });
        });


        describe('Search Flights', function () {
            it('Fetching Flight results based on our criteria', function (done) {
                const fetchFlights = { 
                fromCity:'a',
                toCity:'b',
                departureDate:'2017-11-11',
                seatType:'Economy',
                passengerCount:2,
                filter:1,
                minPrice:200,
                maxPrice:400
                }
                listen
                    .post('/flight')
                    .send(fetchFlights)
                    .end(function (err, response) {
                        expect(response.statusCode).to.equal(200);
                        // expect('Location', '/Welcome');
                        done();
                    });
            });
        });


        describe('Fetch Flight Details', function () {
            it('Fetching the details of a flight given a Flight ID', function (done) {
                const fetchFlight = {
                    "flightID": "1122",
                    "seatType": "Economy"
                }
                listen
                    .post('/flightDetails')
                    .send(fetchFlight)
                    .end(function (err, response) {
                        expect(response.statusCode).to.equal(200);
                        //expect('Location', '/Welcome');
                        done();
                    });
            });
        });
        
        describe('Book Flight Details', function () {
            it('Book a Flight ticket', function (done) {
                const bookFlight = {
                    depFlightID: '1122',
                    seatType: 'Economy',
                    passengerCount: 2
                }
                listen
                    .post('/bookFlight')
                    .send(bookFlight)
                    .end(function (err, response) {
                        expect(response.statusCode).to.equal(200);
                        //expect('Location', '/Welcome');
                        done();
                    });
            });
        }); 

        describe('Pay Flight ticket', function () {
            it('Pay for a Flight ticket', function (done) {
                const payFlight = {
                    username : 'first21@last21.com',
                    cardDetails : '1234567812345678',
                    depFlightID : '1122',
                    seatType : 'Economy',
                    passengerCount : '2',
                    price : '450'
                }
                listen
                    .post('/payFlight')
                    .send(payFlight)
                    .end(function (err, response) {
                        expect(response.statusCode).to.equal(200);
                        //expect('Location', '/Welcome');
                        done();
                    });
            });
        });

        describe('Search Hotels', function () {
            it('Fetching Hotel results based on our criteria', function (done) {
                const fetchHotel = {
                    city: 'New Jersey',
                    fromDate: '2017-11-17',
                    toDate: '2017-11-18',
                    guestCount: '2',
                    roomCount: '3',
                    username: 'first21@last21.com'
                }
                listen
                    .post('/hotel')
                    .send(fetchHotel)
                    .end(function (err, response) {
                        expect(response.statusCode).to.equal(201);
                        //expect('Location', '/Welcome');
                        done();
                    });
            });
        });

        describe('Fetch Hotel Details', function () {
            it('Fetching the details of a hotel given a Hotel ID', function (done) {
                const fetchHotel = {
                hotelID: '60'
                }
                listen
                    .post('/hotelDetails')
                    .send(fetchHotel)
                    .end(function (err, response) {
                        expect(response.statusCode).to.equal(201);
                        //expect('Location', '/Welcome');
                        done();
                    });
            });
        });

        describe('Book Hotel Details', function () {
            it('Book a Hotel', function (done) {
                const bookHotel = {
                hotelID: 60,
                hotelRequested: 
                    { 
                    fromDate: '2017-11-17',
                    toDate: '2017-11-18',
                    guestCount: 2,
                    roomCount: 3
                    }
                }
                listen
                    .post('/bookHotel')
                    .send(bookHotel)
                    .end(function (err, response) {
                        expect(response.statusCode).to.equal(201);
                        //expect('Location', '/Welcome');
                        done();
                    });
            });
        });

        describe('Pay Hotel Room', function () {
            it('Pay for a Hotel', function (done) {
                const payHotel = {
                    hotelID: '60',
                    fromDate: '2017-11-17',
                    toDate: '2017-11-18',
                    guestCount: '2',
                    roomCount: '3',
                    billAmount: '600',
                    cardNo: '7777777777777777',
                    location: 'New Jersey',
                    hotelName: 'Oriental Cave'
                }
                listen
                    .post('/payHotel')
                    .send(payHotel)
                    .end(function (err, response) {
                        expect(response.statusCode).to.equal(201);
                        //expect('Location', '/Welcome');
                        done();
                    });
            });
        });

    });