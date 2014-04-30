var async = require('async')
    , mongoose = require('mongoose')
    , _ = require('underscore')
    , utils = require('./utils')
    , lodash = require('lodash');

var db = mongoose.connect(process.env.MONGOHQ_URL);

require('../models/Agency');
require('../models/Calendar');
require('../models/CalendarDate');
require('../models/FareAttribute');
require('../models/FareRule');
require('../models/FeedInfo');
require('../models/Frequencies');
require('../models/Route');
require('../models/Stop');
require('../models/StopTime');
require('../models/Transfer');
require('../models/Trip');

var Agency = db.model('Agency')
    , Route = db.model('Route')
    , Stop = db.model('Stop')
    , StopTime = db.model('StopTime')
    , Trip = db.model('Trip')
    , Calendar = db.model('Calendar')
    , FareRule = db.model('FareRule')
    , FareAttribute = db.model('FareAttribute');


module.exports = {
    getDestinationsFromOrigin: function (agency_key, stop_id, cb) {
        FareRule.find({origin_id: stop_id}, {destination_id: true, _id: false})
            .exec(function (err, results) {
                cb(err, results.map(function (result) {
                    return result['destination_id'];
                }));
            });
    },

    getStopsByAgency: function (agency_key, cb) {
        Stop.find({agency_key: agency_key}, cb);
    },

    getTrips: function (agency_key, origin, destination, date, cb) {
        var valid_calendar = [],
            origin_times = [],
            destination_times = [],
            service_ids = [],
            matches = [],
            origin_stop, destination_stop, final_result;

        async.series([
            getOriginStop,
            getDestStop,
            getServiceIds,
            getOriginTimes,
            getDestinationTimes,
            matchOriginDestination,
            matchToFare,
            getFare,
            buildObject
        ], function (err) {
            cb(err, final_result);
        });

        function getOriginStop(cb) {
            Stop.findOne({stop_id: origin}, 'stop_id stop_name stop_desc stop_lat stop_lon zone_id -_id', function (error, result) {
                origin_stop = result;
                cb(error);
            })
        }

        function getDestStop(cb) {
            Stop.findOne({stop_id: destination}, 'stop_id stop_name stop_desc stop_lat stop_lon zone_id -_id', function (error, result) {
                destination_stop = result;
                cb(error);
            })
        }

        function getServiceIds(cb) {
            Calendar.find({agency_key: agency_key, start_date: { $lte: date }, end_date: { $gte: date } }, function (error, result) {
                valid_calendar = result;
                async.each(valid_calendar, function (item) {
                    service_ids.push(item.service_id);
                });
                cb(error);
            });
        }

        function getOriginTimes(cb) {
            StopTime.find({agency_key: agency_key, stop_id: origin, "trip.service_id": { $in: service_ids } },
                'arrival_time departure_time stop_id stop_sequence trip_id trip.route_id trip.service_id -_id',
                function (error, results) {
                    origin_times = results;
                    cb(error);
                });
        }

        function getDestinationTimes(cb) {
            StopTime.find({agency_key: agency_key, stop_id: destination, "trip.service_id": { $in: service_ids } },
                'arrival_time departure_time stop_id stop_sequence trip_id trip.route_id trip.service_id -_id',
                function (error, result) {
                    destination_times = result;
                    cb(error);
                });
        }

        function matchOriginDestination(cb) {
            async.each(origin_times, function (origin, done) {
                var dest = lodash.find(destination_times, function (dest) {
                    return origin.trip_id == dest.trip_id && origin.stop_sequence < dest.stop_sequence;
                });
                if (dest)
                    matches.push({origin: origin, destination: dest});
                done();
            }, function(error){
                cb(error);
            });
        }

        function matchToFare(cb) {
            async.each(matches, function (match, done) {
                FareRule.findOne({ route_id: match.origin.trip.route_id, origin_id: origin_stop.zone_id, destination_id: destination_stop.zone_id}, function(error, result){
                    match.fare = result;
                    done(error);
                });
            }, function(error){
                cb(error);
            });
        }

        function getFare(cb) {
            async.each(matches, function (match, done) {
                FareAttribute.findOne({ fare_id: match.fare.fare_id}, 'price currency_type -_id', function(error, result){
                    match.fare = result;
                    done(error);
                });
            }, function(error){
                cb(error);
            });
        }

        function buildObject(cb) {
            final_result = {stops: {origin: origin_stop, destination: destination_stop}, departures: matches};
            cb(null);
        }

    }
};

function handleError(e) {
    console.error(e || 'Unknown Error');
    process.exit(1)
};
