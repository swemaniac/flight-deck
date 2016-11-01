import BaseAdapter from './BaseAdapter';
import Constants from '../../Constants/Constants';
import ResponseModel from '../../Models/ResponseModel';

class PirepAdapter extends BaseAdapter {
    constructor(pirepModel){
        super();
        this._pirepModel = pirepModel;
    }

    decodeRequest(req) {
        var data1 = req.query.DATA1 || req.body.DATA1;
        var data2 = req.query.DATA2 || req.body.DATA2;
        var data3 = req.query.DATA3 || req.body.DATA3 || '';
        var data4 = req.query.DATA4 || req.body.DATA4 || '';
        var version;

        if (data1 === undefined) {
            throw new Error('0|Invalid Data1');
        }
        if (data2 === undefined) {
            throw new Error('0|Invalid Data2');
        }

        version = this.checkXAcarsVersion(data1);

        if (version <= 0) {
            throw new Error('0|Invalid XAcars Version');
        }

        return {
            data2: data2.split('~'),
            data3: data3,
            data4: data4
        }
    } 


    handleRequest(req,res) {
        var responseModel = new ResponseModel(res);
        var decodedData = this.decodeRequest(req);
        var requestData;
        console.log(this.data2int);
        try {
            requestData = this.decodeRequest(req);
        } catch(err) {
            responseModel.setData(req.data).setMessage(err.message).respond(500);
            return;
        } 


        var data = requestData.data2;
        var version = this.checkXAcarsVersion(requestData.data1);

        var user = this.testUserLogin(data[0], data[1]);

        if (!user) {
            res.send('0|ERROR: Invalid login!');
            return;
        }

        var pirep = new (this._pirepModel)();


        pirep.timeReport    = new Date();
        pirep.acarsID       = version;
        pirep.userID        = user;
        pirep.flightRot     = data[2];
        pirep.acICAO        = data[3];
        pirep.flightType    = data[5];

        pirep.departure     = data[6].substr(0, 4);
        pirep.destination   = data[7].substr(0, 4);
        pirep.alternate     = data[8].substr(0, 4);

        // Reading timestamp "25.02.2006 12:18"
        pirep.depTime       = new Date(data[9]);
        pirep.blockTime     = this.time2min(data[10]);
        pirep.blockFuel     = this.lbs2kg(this.data2int(data[12],0));
        pirep.flightTime    = this.time2min(data[11]);
        pirep.flightFuel    = this.lbs2kg(this.data2int(data[13],0));

        if (data[4] !== '') {
            pirep.cruise = this.data2int(data[4].substr(2),0)*100;
        }

        pirep.pax           = this.data2int(data[14],0);
        pirep.cargo         = this.lbs2kg(this.data2int(data[15],0));


        switch(data[16].toUpperCase()) {
            case 'VATSIM':
                pirep.online = Constants.ONLINE_VATSIM;
                break;
            case 'IVAO':
                pirep.online = Constants.ONLINE_IVAO;
                break;
            case 'FPI':
                pirep.online = Constants.ONLINE_FPI;
                break;
            default:
                pirep.online = Constants.ONLINE_OTHER;
                break;
        }
        
        pirep.save(function(err, result){
            console.log(err);
            if (err) {
                res.send('0|ERROR');
                return;
            }

            res.send('1|PIREP ACCEPTED');
        });

    }
}

export default PirepAdapter;