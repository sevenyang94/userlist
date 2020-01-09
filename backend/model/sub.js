var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
 
mongoose.connect('mongodb://localhost:27017/usarmy').then(() => {
        console.log('Connected to USarmy DB');
    })
    .catch(error => {
        console.error('Connection to DB Failed');
        console.error(error.message);
        process.exit(-1);
    });;
 
 

var Subs   = new Schema({
    _id: {type: Schema.Types.ObjectId, ref: 'users'},
    superior: {type: Schema.Types.ObjectId, ref: 'users'},
    
});
 
module.exports  = mongoose.connection.model('subs', Subs);



