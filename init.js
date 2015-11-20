/**
 * Created by mota on 2015-10-05.
 */



var User = require('./model/user');
var bCrypt = require('bcrypt-nodejs');
var LocalStrategy   = require('passport-local').Strategy;


module.exports = function(passport){

    passport.serializeUser(function(user, done) {
        console.log('serializing user: '+user);
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            console.log('deserializing user: '+user);
            done(err, user);
        });
    });
    passport.use('signup', new LocalStrategy({
                passReqToCallback : true
            },
            function(req, username, password, done) {
                findOrCreateUser = function(){
                    User.findOne({ 'username' :  username }, function(err, user) {
                        if (err){
                            console.log('Error in SignUp: '+err);
                            return done(err);
                        }else if (user) {
                            console.log('User already exists with username: '+username);
                            return done(null, false, req.flash('message','User already exists'));
                        } else {
                            var user = new User();
                            user.username = username;
                            user.password = createHash(password);
                            user.save(function(err) {
                                if (err){
                                    console.log('Error in Saving user: '+err);
                                    throw err;
                                }
                                console.log('User registration successful');
                                return done(null, user);
                            });
                        }
                    });
                };
                process.nextTick(findOrCreateUser);
            })
    );
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

    passport.use('login', new LocalStrategy({
                passReqToCallback : true
            },
            function(req, username, password, done) {
                User.findOne({ 'username' :  username }, function(err, user) {
                        if (err) {
                            return done(err);
                        }else if (!user){
                            console.log('User not found: '+username);
                            return done(null, false, req.flash('message', 'User not found.'));
                        }else if (!isValidPassword(user, password)){
                            console.log('Invalid password');
                            return done(null, false, req.flash('message', 'Invalid password'));
                        }
                        return done(null, user);
                    }
                );

            })
    );

    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    }



}