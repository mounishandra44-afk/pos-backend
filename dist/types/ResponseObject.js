"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationResponseObject = void 0;
class ValidationResponseObject {
    isError;
    message;
    data;
    constructor(isError, message, error) {
        this.isError = isError;
        this.message = message;
        this.data = error;
    }
}
exports.ValidationResponseObject = ValidationResponseObject;
//# sourceMappingURL=ResponseObject.js.map