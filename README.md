#Node-GTFS

node-GTFS loads transit data in [GTFS format](https://developers.google.com/transit/) from [GTFS Data Exchange](http://www.gtfs-data-exchange.com/), unzips it and stores it to a MongoDB database and provides some methods to query for agencies, routes, stops and times.  It also has spatial queries to find nearby stops, routes and agencies.

##Setup

`git clone git@github.com:brendannee/node-gtfs.git`

`cd node-gtfs`

`npm install`

All routes are secured with Basic Auth so create two environment variables called `user` and `password`.

##Configuration for loading data

The data sources are defined in the MongoDB. When data is loaded, it looks for a collection called `file_urls`. Each document in this collection has two fields: `agency_key` which is the name of the agency and `url` which is the url at which the zip file containing all the GTFS documents is located.

###To load data

    node ./scripts/download

To keep schedules up to date, you might want to schedule this to occur once per day.

##Endpoints

###List all Stops an agency has

    /api/destinations/:agency

###List all Destinations that can be reached from an agency's origin stop

    /api/destinations/:agency/:origin

###List all trips between two stops on a given date

   /api/trips/:agency/:origin/:destination/:date

##Hosting the Example App with Heroku and MongoHQ

A `Procfile` is already in the repo.

Create app on Heroku

    $ heroku apps:create YOURAPPNAME

Add MongoHQ to your app

    $ heroku addons:add mongohq:sandbox

MONGOHQ creates a user, database and exports it as a MONGOHQ_URL environment variable.

Add Heroku as a remote repo:

    $ git remote add heroku git@heroku.com:YOUR_APP_NAME.git

Push your app to Heroku

    $ git push heroku master

Execute the download script to populate the database with the agency data specified in config.js

    $ heroku run node ./scripts/download


##Pulling in updated transit data

Re-run the download script whenever you need to refresh the database. You may want to schedule this with a cronjob.  Heroku lets you do this with [scheduler](https://devcenter.heroku.com/articles/scheduler).

## License

(The MIT License)

Copyright (c) 2012 Brendan Nee <me@bn.ee>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
