var _ = require('underscore');
var express = require('express');
var router = express.Router();
var Event = require('../model/event');
var User = require('../model/user');

var isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}


module.exports = function(passport){

	router.get('/', function(req, res) {
		res.send({LoginMessage:'Please Login with username and password at http://130.233.42.143:8080/login' , LoginErrorMessage: req.flash('message') });
	});

	router.post('/login', passport.authenticate('login', { // home view
		successRedirect: '/userFound',
		failureRedirect: '/userNotFound',
		failureFlash : true
	}));

	router.get('/userFound',isAuthenticated, function(req, res){
		var validUser= "Valid Username and Password!";
		console.log(req.user);
		res.json({"user":req.user,"success":true,"message": validUser});
	});

	router.get('/userNotFound', function(req, res){
		var invalidmessage = req.flash('message');
		var invalidUser= "Invalid Username or Password!";
		res.json({"success":false, "message": invalidUser });
	});
	
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/userRegistered',
		failureRedirect: '/userNotRegistered',
		failureFlash : true
	}));
	
	router.get('/userRegistered', function(req, res){
		var userAdded= "User Successfully Added!";
		res.json({"success":true, "message": userAdded});
	});

	router.get('/userNotRegistered', function(req, res){
		var userAddError= "Username Already Exists!";
		res.json({"success":false, "message": userAddError});
	});

	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

//EVENT----------------------------------------------
	/*
	 * GET to eventlist.
	 */
	router.get('/eventlist', function(req, res) {
		Event.find({user: req.user}).exec(function(e,docs){
			console.log(docs);
			res.json(docs);
		});
	});

	/*
	 * POST to addevent.
	 */
	router.post('/addevent', isAuthenticated, function(req, res) {

		var event2add = new Event();
		event2add.from_date = req.body.from_date;
		event2add.to_date = req.body.to_date;
		event2add.start_time = req.body.start_time;
		event2add.end_time = req.body.end_time;
		event2add.location = req.body.location;
		event2add.description = req.body.description;
		event2add.user = req.user;
		if(req.body.google_id) {event2add.google_id = req.body.google_id};

		var savedEvents= AllEvents;
		var flag=0;
		for (i = 0; i < savedEvents.length; i++){
			if(event2add.from_date==savedEvents[i].from_date && event2add.to_date==savedEvents[i].to_date && event2add.start_time==savedEvents[i].start_time
				&& event2add.end_time==savedEvents[i].end_time && event2add.location==savedEvents[i].location && event2add.description==savedEvents[i].description) {
				flag=1;
			}
		}

		if(flag===0) { //event does not exist
			event2add.save(function(err) {
				if (err) {
					console.log('Error in Saving New Event: '+err);
					throw err;
				}
				console.log('Event Added!');
				console.log(event2add);
				res.json({"exists":false, "message": "Event Added"});
			});
		}
		else if (flag===1) {
			console.log('Event Exists!');
			res.json({"exists":true, "message": "Event Exists!Not Added"});
		}
	});

	/*
	 * DELETE to deleteevent.
	 */
	router.delete('/deleteevent/:id', function(req, res) {
		Event.findByIdAndRemove(req.params.id,function(err) {
			if (err) throw err;

			console.log('Event with ID:'+req.params.id+' is deleted!');
			res.send('Event with ID:'+ req.params.id+ ' is deleted!');
		});
	});

	/*
	 * PUT to updateevent.
	 */
	router.put('/updateevent/:id', function(req,res) {
		var options = {};
		if (req.body.date)  _.extend(options,{date : req.body.date});
		if (req.body.start_time) _.extend(options,{start_time : req.body.start_time});
		if (req.body.end_time) _.extend(options,{end_time : req.body.end_time});
		if (req.body.location) _.extend(options,{location : req.body.location});
		if (req.body.description) _.extend(options,{description : req.body.description});
		Event.findByIdAndUpdate(req.params.id,options,function(err) {
			if (err) throw err;

			console.log('Event with ID:'+req.params.id+' is updated!');
			res.send('Event with ID:'+req.params.id+' is updated!');
		});
	});

	/*
	 * GET to searchevent.
	 */
	router.get('/searchevent', function(req, res){
		var options = {};
		options={user : req.user};
		if (req.query.location) _.extend(options,{location : {$regex:req.query.location, $options: 'i'}});
		if (req.query.description) _.extend(options,{description : {$regex:req.query.description, $options: 'i'}});
		console.log(options);

		var Sresult = Event.find(options);
		console.log(Sresult);
		if(req.query.start_date) Sresult.where('date').gte(req.query.start_date);
		if(req.query.end_date) Sresult.where('date').lte(req.query.end_date);
		//else Sresult.where('date').lte(req.query.Startdate);
		if(req.query.start_time) Sresult.where('start_time').gte(req.query.start_time);
		if(req.query.end_time) Sresult.where('end_time').lte(req.query.end_time);
		Sresult.exec(function(e,docs){
			console.log(docs);
			res.send(docs);
		});
	});



  return router;
}


/*
 * GET to userinfo.
 */
router.get('/userinfo', function(req, res) {
	User.find({username: req.user.username}).exec(function(e,docs){
		console.log(docs);
		res.json(docs);
	});
});

/*
 * PUT to updateuser.
 */
router.put('/updateuser', function(req,res) {
	User.findByIdAndUpdate({username:req.user.username},{username:req.body.username, password:req.body.password},function(err) {
		if (err) throw err;

		console.log('User info is  Updated!');
		res.send('User info is  Updated!');
	});
});