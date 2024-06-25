class ExpressError extends Error { //Error it's a default class that Express provides
    constructor(message, statusCode) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;