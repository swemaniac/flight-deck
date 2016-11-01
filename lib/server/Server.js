import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';

import AcarsFlightModel from './Models/AcarsFlightModel.js';
import AcarsPositionModel from './Models/AcarsPositionModel.js';
import PirepModel from './Models/PirepModel.js';

import AcarsFlightController from './Controllers/Endpoints/AcarsFlightController';
import PirepController from './Controllers/Endpoints/PirepController';
import XacarsAdapter from './Controllers/Adapters/XacarsAdapter';
import PirepAdapter from './Controllers/Adapters/PirepAdapter';

class Server {
    constructor(config) {
        this._port = config.port;
        this._exp = express();
        this._http = http.Server(this._exp);
        
        this._exp.use(cors());                  // Enable CORS
        //this._exp.use(bodyParser.json());       // to support JSON-encoded bodies
        this._exp.use(bodyParser.urlencoded({     // to support URL-encoded bodies
            extended: true
        })); 

        this._exp.use(function(err,req,res,next){
            if (err){
                // Log errors.
                console.log(err);
            }
            next();
        });

        this._apiRoutes = express.Router(); 

        this.registerRoutes();

        this._http.listen(this._port, function(){
            console.log('listening on *:' + this._port);
        }.bind(this));
    }

    registerControllerRoute(controller, route, prefix) {
        route.get(prefix, controller.getAll.bind(controller));
        route.post(prefix, controller.insert.bind(controller));

        route.get(prefix + '/:id', controller.getSingle.bind(controller));
        route.put(prefix + '/:id', controller.update.bind(controller));
        route.delete(prefix + '/:id', controller.delete.bind(controller));
    }

    registerRoutes() {
        var xacarsAdapter = new XacarsAdapter(AcarsFlightModel, AcarsPositionModel);
        var pirepAdapter = new PirepAdapter(PirepModel);
        var acarsFlightController = new AcarsFlightController(AcarsFlightModel);
        var pirepController = new PirepController(PirepModel);
        
        this._apiRoutes.get('/', function(req,res) {
            res.send('lol');
        });

        this._apiRoutes.all('/liveacars.php', xacarsAdapter.handleRequest.bind(xacarsAdapter));
        this._apiRoutes.all('/pirep.php', pirepAdapter.handleRequest.bind(pirepAdapter));

        this.registerControllerRoute(acarsFlightController, this._apiRoutes, '/acarsflight');
        this.registerControllerRoute(pirepController, this._apiRoutes, '/pirep');

        this._exp.use('/api', this._apiRoutes);
    }
}

export default Server;