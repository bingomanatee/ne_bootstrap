# Nuby-Expres Home

This is a "seed" project for housing your Nuby-Express site.

Note there are two roots.

 * index.js is what you should launch in node or forever -- sudo node.js
   (in practice I find you often need sudo to access port 80). It is a script = there is nothing exposed
   via module.exports.

 * web.js is a true module. It exposes a function that launches a server and returns the framework as the output
   of that function. Note that you can pass configuration options into the function to
    * override the port
    * change the name of the default database

This makes the web.js file a useful tool for unit tests. You can write each test with a different port
and database and not worry about overlap. (as long as you destroy the database at the end of the test...)

By default the core logger of Node will write to logs/nuby_express.log.

It will be a dull ride indeed without content in the app.

## Important Customization

The session secret is embedded in the config.json file; please change it.
Also, we are using node memory storage here for sessions.
You might want to consider something more permanent for deployed sites with significant traffic.

The database name is stored in your frame_config file as mongoose.db

# Version Compatibility

At the time of this writing this package is consistent with Mongoose 3.x and Nuby-Express 2.2.x,
which is in turn consistent with Mongodb 2.0.x. All of this is running under Node 0.8.x.
It has been tested under Mac OSX and Ubuntu. 