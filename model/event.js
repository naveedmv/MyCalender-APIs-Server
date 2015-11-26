/**
 * Created by mota on 2015-10-05.
 */
var mongoose = require('mongoose');
var schema = mongoose.Schema;

module.exports = mongoose.model('Event',{
    from_date: String,
    to_date: String,
	start_time: String,
    end_time: String,
    location: String,
    description: String,
    google_id: String,
    user: {
        type: schema.ObjectId,
        ref: 'user'
    }
});