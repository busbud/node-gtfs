var mongoose = require('mongoose')
  , utils = require('../lib/utils')
  , StopTime = mongoose.model('StopTime', new mongoose.Schema({
        agency_key        :  { type: String, index: true }
      , trip_id           :  { type: String, index: true }
      , arrival_time      :  { type: String, get: utils.secondsToTime, set: utils.timeToSeconds }
      , departure_time    :  { type: String, index: true, get: utils.secondsToTime, set: utils.timeToSeconds }
      , stop_id           :  { type: String, index: true }
      , stop_sequence     :  { type: Number, index: true }
      , stop_headsign     :  { type: String }
      , pickup_type       :  { type: String }
      , drop_off_type     :  { type: String }
      , shape_dist_traveled :  { type: String }
      , trip              : { agency_key        :  { type: String, index: true }
                            , route_id          :  { type: String, index: true }
                            , service_id        :  { type: String, index: true }
                            , trip_id           :  { type: String }
                            , trip_headsign     :  { type: String }
                            , trip_short_name   :  { type: String }
                            , direction_id      :  { type: Number, index: true, min:0, max:1 }
                            , block_id          :  { type: String }
                            , shape_id          :  { type: String }
                            }
    }));
