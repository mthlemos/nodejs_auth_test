var passport = require('passport');
var passportJWT = require('passport-jwt');
var cfg = require('./config');
var User = require('./models/user');
var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;
var params = {
  secretOrKey: cfg.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

module.exports = function() {
  var strategy = new Strategy(params, function(jwt_payload, done) {
    console.log('payload received', jwt_payload);
    User.findById(jwt_payload.id, function(err, user) {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
        // or you could create a new account
      }
    })
  });
  passport.use(strategy);
  return {
    initialize: function(){
      return passport.initialize();
    },
    authenticate: function(){
      return passport.authenticate('jwt', cfg.jwtSession);
    }
  };
};
