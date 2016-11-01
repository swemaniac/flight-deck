var mongoose = require('mongoose');
var Constants = require('../Constants/Constants.js');

var PirepSchema = mongoose.Schema({
    pirepID:     {type: String, default: 0},
    timeReport:  {type: String, default: 0},
    acarsID:     {type: String, default: Constants.ACARS_UNKNOWN},
    userID:      {type: String, default: 0},
    flightRot:   {type: String, default: 0},
    acICAO:      {type: String, default: ''},
    flightType:  {type: String, default: 'IFR'},
    departure:   {type: String, default: ''},
    destination: {type: String, default: ''},
    alternate:   {type: String, default: ''},

    depTime:     {type: String, default: '00:00'},
    blockTime:   {type: String, default: 0},
    blockFuel:   {type: String, default: 0},
    flightTime:  {type: String, default: 0},
    flightFuel:  {type: String, default: 0},

    cruise:      {type: String, default: 0},
    pax:         {type: String, default: 0},
    cargo:       {type: String, default: 0},
    online:      {type: String, default: 0},
    message:     {type: String, default: ''}
});

export default mongoose.model('Pirep', PirepSchema);