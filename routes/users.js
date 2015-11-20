var _ = require('underscore');
var express = require('express');
var router = express.Router();
var User = require('../model/user');

/*
 * GET userlist.
 */
router.get('/userlist', function(req, res) {
    User.find().exec(function(e,docs){
        console.log(docs);
        res.send(docs);
    });
});

/*
 * POST to adduser.
 */
router.post('/adduser', function(req, res) {
    var user = new User() ;
    user.username = req.body.username;
    user.password = req.body.password;

    user.save(function(err) {
        if (err) {
            console.log('Error in Saving New User: '+err);
            throw err;
        }
        console.log('User Added!');
        res.send(user);
    });
});

/*
 * DELETE to deleteuser.
 */
router.delete('/deleteuser/:id', function(req, res) {
    User.findByIdAndRemove(req.params.id,function(err) {
        if (err) throw err;

        console.log('User with ID:'+req.params.id+' is deleted!');
        res.send('User with ID:'+req.params.id+' is deleted!');
    });
});

/*
 * PUT to updateuser.
 */
router.put('/updateuser/:id', function(req,res) {
    User.findByIdAndUpdate(req.params.id,{username:req.body.username, password:req.body.password},function(err) {
        if (err) throw err;

        console.log('User with ID:'+req.params.id+' is  Updated!');
        res.send('User with ID:'+req.params.id+' is  Updated!');
    });
});

/*
 * POST to searchuser.
 */
router.post('/searchuser', function(req, res){
    var options = {};
    if (req.body.username) _.extend(options,{username : req.body.username});
    console.log(options);
    User.find(options).exec(function(e,docs){
        console.log(docs);
        res.send(docs);
    });
});


module.exports = router;