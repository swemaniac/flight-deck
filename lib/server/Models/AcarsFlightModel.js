var mongoose = require('mongoose');
var Constants = require('../Constants/Constants.js');

var AcarsFlightSchema = mongoose.Schema({
    flightId: {type: String},
    userId: {type: String},
    acarsId: {type: String, default: Constants.ACARS_XACARS},
    aircraft: {type: String, default: ''},
    flightRot: {type: String, default: ''},
    flightType: {type: String, default: 'IFR'},
    flightPlan: {type: String, default: ''},
    departure: {type: String, default: ''},
    destination: {type: String, default: ''},
    curPositionId: {type: String, default: 0}
});

export default mongoose.model('AcarsFlight', AcarsFlightSchema);