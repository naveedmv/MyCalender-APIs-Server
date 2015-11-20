var _ = require('underscore');
var express = require('express');
var router = express.Router();
var Event = require('../model/event');

/*
 * GET to eventlist.
 */
router.get('/eventlist', function(req, res) {
    Event.find().exec(function(e,docs){
        console.log(docs);
        res.send(docs);
    });
});

/*
 * POST to addevent.
 */
router.post('/addevent', function(req, res) {
    var event = new Event() ;
    event.date = req.body.date;
    event.start_time = req.body.start_time;
    event.end_time = req.body.end_time;
    event.location = req.body.location;
    event.description = req.body.description;
    event.user = req.user;

    event.save(function(err) {
        if (err) {
            console.log('Error in Saving New Event: '+err);
            throw err;
        }
        console.log('Event Addition Successful');
        res.send(event);
    });
});

/*
 * DELETE to deleteevent.
 */
router.delete('/deleteevent/:id', function(req, res) {
    Event.findByIdAndRemove(req.params.id,function(err) {
        if (err) throw err;

        console.log('Event deleted!');
        res.send();
    });
});

/*
 * PUT to updateevent.
 */
router.put('/updateevent/:id', function(req,res) {
    Event.findByIdAndUpdate(req.params.id,{date:req.body.date, start_time:req.body.start_time,
        end_time:req.body.end_time, location:req.body.location, description:req.body.description},function(err) {
        if (err) throw err;

        console.log('Event with ID:'+req.params.id+' is updated!');
        res.send('Event with ID:'+req.params.id+' is updated!');
    });
});

/*
 * POST to searchevent.
 */
router.post('/searchevent', function(req, res){
    var options = {};
    if (req.body.user) _.extend(options,{user : req.body.user});
    if (req.body.location) _.extend(options,{location : {$regex:req.body.location, $options: 'i'}});
    if (req.body.description) _.extend(options,{description : {$regex:req.body.description, $options: 'i'}});
    console.log(options);

    var Sresult = Event.find(options);
    console.log(Sresult);
    if(req.body.start_date) Sresult.where('date').gte(req.body.start_date);
    if(req.body.end_date) Sresult.where('date').lte(req.body.end_date);
    //else Sresult.where('date').lte(req.query.Startdate);
    if(req.body.start_time) Sresult.where('start_time').gte(req.body.start_time);
    if(req.body.end_time) Sresult.where('end_time').lte(req.body.end_time);
    Sresult.exec(function(e,docs){
        console.log(docs);
        res.send(docs);
    });
});



module.exports = router;