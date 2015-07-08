var gtfs = require('./lib/gtfs');

module.exports = function routes(app) {

  //List the stops for an agency
  app.get('/api/destinations/:agency', function (req, res) {
    var agency_key = req.params.agency;
    var accepted_operators = null;
    try{
      if (req.query.ops){
        accepted_operators = JSON.parse(req.query.ops);
      } else {
        accepted_operators = null;
      }
    } catch (ex){
      return res.send(400, { error: 'Ops field must be a valid JSON object' });
    }
    gtfs.getStopsByAgency(agency_key, accepted_operators, function (e, data) {
      res.send(data || {error: 'No stops for agency_key ' + agency_key});
    });
  });

  app.get('/api/trips/:agency/:origin/:destination/:date', function (req, res) {
    var agency_key = req.params.agency;
    var origin = req.params.origin;
    var dest = req.params.destination;
    var date = req.params.date;
    var accepted_operators = null;
    try{
      if (req.query.ops){
        accepted_operators = JSON.parse(req.query.ops);
      } else {
        accepted_operators = null;
      }
    } catch (ex){
      return res.send(400, { error: 'Ops field must be a valid JSON object' });
    }
    gtfs.getTrips(agency_key, origin, dest, date, accepted_operators, function (e, data) {
      res.send(data || {error: 'No trips for agency_key ' + agency_key});
    })
  });

  //List of destinations that can be reached from the origin
  app.get('/api/destinations/:agency/:origin', function (req, res) {
    var agency_key = req.params.agency;
    var origin = req.params.origin;
    var accepted_operators = null;
    try{
      if (req.query.ops){
        accepted_operators = JSON.parse(req.query.ops);
      } else {
        accepted_operators = null;
      }
    } catch (ex){
      return res.send(400, { error: 'Ops field must be a valid JSON object' });
    }
    gtfs.getDestinationsFromOrigin(agency_key, origin, accepted_operators, function (e, data) {
      res.send(data || {error: 'No stops from ' + origin + ' for agency_key ' + agency_key});
    });
  });

  //Nothing specified
  app.all('*', function notFound(req, res) {

    res.contentType('application/json');
    res.status(404);
    res.send({
      error: 'No API call specified'
    });
  });

}
