import ResponseModel from '../../Models/ResponseModel';

class BaseEndpointController {
    constructor(model) {
        this._model = model;
    }
    getSingle(req, res) {
        var response = new ResponseModel(res);
        response.setMessage('single').respond();
    }
    getAll(req, res) {
        var response = new ResponseModel(res);
        response.setMessage('all').respond();
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