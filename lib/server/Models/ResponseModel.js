class ResponseModel {
    constructor(response) {
        this._response = response;
        this._status = 200;
        this._data = {
            id: (new Date().getTime()),
            message: '',
            data: null
        };
    }

    getData() {
        return this._data.data;
    }

    getMessage() {
        return this._data.message;
    }

    getStatus() {
        return this._status;
    }

    setData(data) {
        this._data.data = data;

        return this;
    }

    setMessage(message) {
        this._data.message = message;

        return this;
    }

    setStatus(status) {
        this._status = status;

        return this;
    }

    toJSON() {
        return Object.assign({}, this._data);
    };

    respond(status) {
        this._response.status(status || this._status).json(this.toJSON());
    };

}

export default ResponseModel;