
var config = require('./config'),
    routes = require('./routes'),
    express = require('express'),
    raven = require('raven'),
    app = express();

app.use(express.basicAuth(process.env.user, process.env.password));
app.use(raven.middleware.express());

config(app);
routes(app);

if (!module.parent) {
  var port = process.env.PORT || 8081;
  app.listen(port, function(){
    console.error('\x1b[32m' + app.set('domain') + '\x1b[0m running on port %d', port);
  });

}
