let apis = require('./apiRoutes');
let routes = require('./routes');

module.exports = (app, passport) => {
  app.use('/', routes);
  app.use('/api', apis);
}