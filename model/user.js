/**
 * Created by mota on 2015-10-05.
 */

var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
   username: String,
    password: String
});
