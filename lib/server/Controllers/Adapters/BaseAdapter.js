import Constants from '../../Constants/Constants';

class BaseAdapter {


    data2int(data, def) {
        var res;
        if ((!data && data != 0)) {
            res = Number(data);
        }

        if (isNaN(res) || (!res && res !== 0)) {
            res = def;
        }

        return res;
    }

    data2str(data, def, allowTags, stripSql) {
        return data + '';
    }

    time2min(time){
        var res = 0;

        if (time) {
            res = parseInt(time.substr(0,2))*60 + parseInt(time.substr(3,2))*60;
        }

        return res;
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


    latDegDecMin2DecDeg(dat) {
        if (dat === '') {
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

        return Number(dec).toFixed(4);
    }

    lonDegDecMin2DecDeg(dat) {
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

        return Number(dec).toFixed(4);
    }

    lbs2kg(lbs) {
        return(lbs / 2.204622915);
    }
}

export default BaseAdapter;