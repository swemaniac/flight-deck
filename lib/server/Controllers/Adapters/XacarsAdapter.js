import BaseAdapter from './BaseAdapter';
import Constants from '../../Constants/Constants';
import ResponseModel from '../../Models/ResponseModel';

class XacarsAdapter extends BaseAdapter {
    constructor(acarsFlightModel, acarsPositionModel){
        super();
        this._flightModel = acarsFlightModel;
        this._positionModel = acarsPositionModel;
    }

    checkXAcarsVersion(data) {
        var version;
        switch(data) {
            case 'XACARS|1.0':
            case 'XACARS|1.1':
            case 'XACARS|2.0':
            case 'XACARS|2.5':
            case 'XACARS|3.0':
                version = Constants.ACARS_XACARS;
            break;
            case 'XACARS_MSFS|1.0':
            case 'XACARS_MSFS|1.1':
            case 'XACARS_MSFS|2.0':
            case 'XACARS_MSFS|2.5':
            case 'XACARS_MSFS|3.0':
                version = Constants.ACARS_XACARS_MSFS;
            break;
            default:
                version = Constants.ACARS_UNKNOWN;
            break;
        }

        return version;
    }

    decodeRequest(req) {
        var data1 = req.query.DATA1 || req.body.DATA1;
        var data2 = req.query.DATA2 || req.body.DATA2;
        var data3 = req.query.DATA3 || req.body.DATA3 || '';
        var data4 = req.query.DATA4 || req.body.DATA4 || '';
        var version;

        if (!data1) {
            throw new Error('0|Invalid Data1');
        }
        if (!data2) {
            throw new Error('0|Invalid Data2');
        }

        version = this.checkXAcarsVersion(data1);

        if (version <= 0) {
            throw new Error('0|Invalid XAcars Version');
        }

        return {
            data2: data2.replace("\'", "''"),
            data3: data3.replace("\'", "''"),
            data4: data4.replace("\'", "''")
        }


    } 

    handleRequest(req, res) {
        var responseModel = new ResponseModel(res);
        var response = '';
        var requestData;
        
        try {
            requestData = this.decodeRequest(req);
        } catch(err) {
            responseModel.setMessage(err.message).respond(500);
            return;
        } 


        switch(requestData.data2) {
            case 'TEST':
                response = this.respondTest(requestData);
            break;
            case 'MESSAGE':
                response = this.respondMessage(requestData);
            break;
            case 'BEGINFLIGHT':
                response = this.respondBeginFlight(requestData);
            break;
            case 'PAUSEFLIGHT':
                response = this.respondPauseFlight(requestData);
            break;
            case 'ENDFLIGHT':
                response = this.respondEndFlight(requestData);
            break;
            default: 
                response = '0|Wrong Function';
            break;
        }


        responseModel.setMessage(response).respond();

    }

    testUserLogin(pilotId, password) {
        /*
        $q_user = @mysql_query("SELECT id FROM user WHERE isactive=1 and username = '$pid' and password = '$pw' LIMIT 1");
        if(@mysql_num_rows($q_user) <= 0)
        {
        return -1;
        }
        else
        {
        $user = @mysql_fetch_array($q_user); 
        return $user['id'];
        }
         */

        return 123;
    }

    testPilotId(pilotId) {
        /*
        $q_user = @mysql_query("SELECT id FROM user WHERE isactive=1 and username = '{$pid}' LIMIT 1");
        
        if(@mysql_num_rows($q_user) == 0)
            return -1;
        else
        {
            $user = @mysql_fetch_array($q_user);
            return $user['id'];
        }
        */

        return 123;
    }

    latDegDecMin2DecDeg(dat) {
        if (data === '') {
            return 0;
        }

        var i = 0;
        var j = dat.indexOf(' ');
        var k = Math.max(dat.indexOf('.'), j+1);

        var dec = dat.substr(1, j);             // Degrees
        dec += dat.substr(j+1, k-j+2) / 60;     // Decimal minutes

        if (dat[0] === 'S') {
            dec = -dec;
        }

        return dec.toFixed(4);
    }

    lonDegDecMin2DecDeg( $dat ) {
        if (dat === '') {
            return 0;
        }

        var i = 0;
        var j = dat.indexOf(' ');
        var k = Math.max(dat.indexOf('.'), j+1);

        var dec = dat.substr(1, j);     // Degrees
        dec += dat.substr(j+1, k-j+2);  // Decimal minutes

        if(dat[0] === 'W') {
            dec = -dec;
        } 

        return dec.toFixed(4);
    }

    lbs2kg(lbs) {
        return(lbs / 2.204622915);
    }

    respondTest(data) {
        if(this.testPilotId(data.data3) > 0) {
            return '1';
        }

        return '0|Unknown PilotID ' + data.data3;
    }

    respondMessage(data) {
        var acarspos = this._positionModel.create();

        acarspos.flightID     = data.data3;
        acarspos.msgdata      = data.data4;
                
        // Decode the message
        // Messagetype: PR=Position Report, AR=Alitude Report, WX=Weather,
        //              QA=OUT, QB=OFF, QC=ON, QD=IN, QM=Flight Statistics, CM=User Message        
        var j = data.data4.indexOf('Msg Label: ');
        if (j != -1) {
            j = j + 'Msg Label: '.length;
            acarspos.msgtype = data.data4.substr(j, 2);
        } else {
            throw new Error('ERROR - Wrong Message format: Msg Label is missing');
        }

        // Remote Timestamp auslesen  [01/17/2006 06:58Z]
        acarspos.remoteTime = (new Date(substr($data4, 1,17)).toTime()) / 1000;
            
        var i = data.data4.indexOf('Message:');
        if (i == -1) {
            throw new Error('ERROR - Wrong Message format: Messagebody is missing');
        }
            
        i = i + 9; // strlen('Message:\n')
        var messageData = data.data4.substr(i).split('/');
        
        messageData.forEach(function(cmdStr) {
            var k = cmdStr.indexOf(' ');
            var cmd = cmdStr.substr(0, k).toUpperCase();
            var cnt = trim(cmdStr.substr(k));

            switch(cmd) {
                case 'POS':
                    var tmp = cnt.split(' ');
                    acarspos.posLat = this.latDegDecMin2DecDeg(trim($tmp[0] + ' ' + $tmp[1]));
                    acarspos.posLon = this.lonDegDecMin2DecDeg(trim($tmp[2] + ' ' + $tmp[3]));
                    var i = cnt.indexOf('[');
                    if(i > 0) {
                        // ¯\_(ツ)_/¯: Hack to have negative length in JS, might not work as expected 
                        acarspos.waypoint = cnt.substr(-(i-1), 1);
                    }
                break;

                case 'HDG':
                    if(!isNaN(Number(cnt))) {
                        acarspos.hdg = cnt;
                    }
                break;

                case 'ALT':
                    i = cnt.indexOf(' ');
                    if (i == -1) {
                        acarspos.alt = cnt;
                    } else {
                        acarspos.alt = cnt.substr(0, i);
                        if (cnt.indexOf('CLIMB') !== -1) {
                            acarspos.vs = Constants.VSPEED_CLB;
                        } else if (cnt.indexOf('DESC') !== -1) {
                            acarspos.vs = Constants.VSPEED_DES;
                        } else if (cnt.indexOf('LEVEL') !== -1) {
                            acarspos.vs = Constants.VSPEED_CRZ;
                        }
                    }
                break;

                case 'IAS':
                    if(!isNaN(Number(cnt))) {
                        acarspos.ias = cnt;
                    }
                break;

                case 'TAS':
                    if(!isNaN(Number(cnt))) {
                        acarspos.tas = cnt;
                    }
                break;
                case 'OAT':
                    if(!isNaN(Number(cnt))) {
                        acarspos.oat = cnt;
                    }
                break;
                case 'TAT':
                    if(!isNaN(Number(cnt))) {
                        acarspos.tat = cnt;
                    }
                break;
                case 'FOB':
                    if(!isNaN(Number(cnt))) {
                        acarspos.fob = cnt;
                    }
                break;
                case 'WND':
                    if(!isNaN(Number(cnt))) {
                        acarspos.wnd = cnt;
                    }
                break;
                case 'DST':
                    i = cnt.indexOf('-');
                    acarspos.distFromDep = cnt.substr(0, i-1);
                    acarspos.distTotal   = cnt.substr(i+2);
                break;
                case 'AP':
                    acarspos.airport = cnt;
                break;
            }
        }); 

        switch(acarspos.msgtype) {
            case 'QA':      // QA = OUT Message
                acarspos.waypoint = acarspos.airport;
                acarspos.flightstat = Constants.FLIGHTSTATUS_TAXIOUT;
                acarspos.vs = Constants.VSPEED_GND;
                acarspos.save();
                return '1|';
            break;

            case 'QB':      // QB = OFF Message
            /*
                // TODO: Implement
                $query = "SELECT curWaypoint FROM acars_position WHERE acarsFlightID = {$acarspos->flightID} AND msgtype = 'QA'";                
                $result = @mysql_query($query) or die("0|SQL query failed");
                if (@mysql_num_rows($result) > 0)
                {
                    $temp = @mysql_fetch_array($result);
                    $acarspos->waypoint     = $temp[0];  
                }
                */
                acarspos.flightstat   = Constants.FLIGHTSTATUS_DEPARTURE;
                acarspos.vs           = Constants.VSPEED_CLB;
                acarspos.save();
                return '1|';
            break;
            case 'QC':      // QC = ON  Message
                acarspos.waypoint     = acarspos.airport;  
                acarspos.flightstat   = Constants.FLIGHTSTATUS_LANDED;
                acarspos.vs           = Constants.VSPEED_GND;
                return '1|';
            break;

            case 'QD':      // QD = IN Message
                acarspos.flightstat   = Constants.FLIGHTSTATUS_IN;
                acarspos.vs           = Constants.VSPEED_GND;
                acarspos.save();        
                return '1|';
            break;

            case 'PR':      // PR = Position Report Message
                acarspos.save();
                return '1|';
            break;

            case 'AR': // AR = Altitude Report Message
                if (acarspos.vs === Constants.VSPEED_CRZ) {
                    acarspos.flightstat = Constants.FLIGHTSTATUS_CRUISE;
                } else if (acarspos.vs === Constants.VSPEED_CLB) {
                    if(acarspos.distFromDep > 30) {
                        // Inflight Climb (more then 30nm from departure - insert what you want)
                        acarspos.flightstat = Constants.FLIGHTSTATUS_CRUISE;
                    } else {
                        // Initial Climb
                        acarspos.flightstat = Constants.FLIGHTSTATUS_CLIMB;
                    }
                } else if (acarspos.vs === Constants.VSPEED_DES) {
                    if((acarspos.distTotal - acarspos.distFromDep) > 100) {
                        // Inflight Descend (more then 100Nm to destination - insert what you want)
                        acarspos.flightstat = Constants.FLIGHTSTATUS_CRUISE;
                    } else {
                        // Initial Descend
                        acarspos.flightstat = Constants.FLIGHTSTATUS_DESC;
                    }
                }

                acarspos.save();
                return '1|';
            break;
        }
    }

    respondBeginFlight(data) {
        var flightData = data.data3.split('\|');
        if (flightData.length < 16) {
            return '0|Invalid login data (' + flightData.length + ')';
        }

        var userId = this.testUserLogin(flightData[0], flightData[17]);
        if(userId === -1) {
            return '0|Login failed';
        }

        var acarsFlight = this._flightModel.create();

        acarsFlight.flightId = (new Date().getTime()) / 1000;
        acarsFlight.userId = userId;
        acarsFlight.acarsId = Constants.ACARS_XACARS;

        acarsFlight.aircraft   = flightData[3];       // AircraftRegistration
        acarsFlight.flightType = flightData[15];      // flightType   
        acarsFlight.flightPlan = flightData[5];       // flightPlan
        acarsFlight.flightRot  = flightData[2];       // FlightNumber

        if (flightData[5].length != 0) {
            var plan = flightData[5].split('~');
            acarsFlight.departure = plan.toUpperCase();

            if(plan.length > 1){
                acarsFlight.destination = plan[plan.length - 1].toUpperCase();
            }
        }

        acarsFlight.save();

        var acarspos = this._positionModel.create();
        acarspos.flightId = acarsFlight._id;
        acarspos.msgType = 'PR';

        if(flightData[6] != '') {
            //N52 23.1890 E13 31.0944
            var tmp = flightData[6].split(' ');
            acarspos.posLat = this.latDegDecMin2DecDeg(trim(tmp[0] + ' ' + tmp[1]));
            acarspos.posLon = this.lonDegDecMin2DecDeg(trim(tmp[2] + ' ' + tmp[3]));
        }

        acarspos.flightstat   = Constants.FLIGHTSTATUS_BOARDING;
        acarspos.waypoint     = acarsFlight.departure;
        acarspos.hdg          = flightData[12];
        acarspos.alt          = flightData[7];
        acarspos.wnd          = flightData[13];
        acarspos.oat          = flightData[14];
        acarspos.tat          = flightData[14];    //Just because GS:=0 at the moment
        acarspos.fob          = this.lbs2kg(flightData[11]);
        acarspos.distTotal    = $data[16];
        acarspos.msgdata      = $data3;

        acarspos.save();

        return '1|' + acarsflight.flightId;
    }

    respondPauseFlight(data) {
        return '1|';
    }

    respondEndFlight(data) {
        var acarspos = this._positionModel.create();

        acarspos.flightId     = $data3;
        acarspos.flightstat   = Constants.FLIGHTSTATUS_END;
        acarspos.msgtype      = 'ZZ';        
        acarspos.save();        

        return "1|";
    }
}

export default XacarsAdapter;
