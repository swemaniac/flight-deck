import ResponseModel from '../../Models/ResponseModel';

class BaseEndpointController {
    constructor(model) {
        this._model = model;
    }
    getSingle(req, res) {
        var response = new ResponseModel(res);
        this._model.find({_id: req.params.id}, function(err, results){
            if (err) {
                response.setMessage('error').setData(err).respond(500);
                return;
            }
            response.setMessage('single').setData(results).respond();
        });
    }
    getAll(req, res) {
        var response = new ResponseModel(res);
        
        this._model.find({}, function(err, results){
            if (err) {
                response.setMessage('error').setData(err).respond(500);
                return;
            }
            response.setMessage('all').setData(results).respond();
        });
    }
    insert(req, res) {
        var response = new ResponseModel(res);
        response.setMessage('insert').respond();
    }
    update(req, res) {
        var response = new ResponseModel(res);
        response.setMessage('update').respond();
    }
    delete(req, res) {
        var response = new ResponseModel(res);
        response.setMessage('delete').respond();
    }
}

export default BaseEndpointController;