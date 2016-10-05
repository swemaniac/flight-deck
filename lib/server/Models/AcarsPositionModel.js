var mongoose = require('mongoose');
var Constants = require('../Constants/Constants.js');

var AcarsPositionSchema = mongoose.Schema({
    msgType: {type: String},
    flightId: {type: String},
    remoteTime: {type: String, default: 0},
    posLat: {type: String, default: 0},
    posLon: {type: String, default: 0},
    flightstat: {type: String, default: Constants.FLIGHTSTATUS_UNKNOWN},
    vs: {type: String, default: Constants.VSPEED_GND},
    hdg: {type: String, default: 0},
    alt: {type: String, default: 0},
    gs: {type: String, default: 0},
    tas: {type: String, default: 0},
    ias: {type: String, default: 0},
    wnd: {type: String, default: '00000'},
    oat: {type: String, default: 0},
    tat: {type: String, default: 0},
    fob: {type: String, default: 0},
    distFromDep: {type: String, default: 0},
    distTotal: {type: String, default: 0},
    msgdata: {type: String, default: ''}
});

/*
    var $msgtype    = '??';
    var $flightID   = 0;
    var $remoteTime = 0;
    var $posLat     = 0; 
    var $posLon     = 0;
    var $flightstat = FLIGHTSTATUS_UNKNOWN;
    var $vs         = VSPEED_GND;
    var $hdg = 0;
    var $alt = 0;
    var $gs  = 0;
    var $tas = 0;
    var $ias = 0;
    var $wnd = '00000';
    var $oat = 0;
    var $tat = 0;
    var $fob = 0;
    var $distFromDep    = 0;
    var $distTotal      = 0;    
    var $msgdata = '';
*/

export default mongoose.model('AcarsPosition', AcarsPositionSchema);
