import Server from './Server';
import mongoose from 'mongoose';

var config = {
    database: 'mongodb://localhost:27020/flight-data',
    port: 3000
}

mongoose.Promise = Promise;
mongoose.connect(config.database);
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function() {
    console.log("Connected to DB");
});

let server = new Server(config);