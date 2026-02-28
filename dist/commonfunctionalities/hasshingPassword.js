"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashingPassword = hashingPassword;
const bcrypt_1 = __importDefault(require("bcrypt"));
async function hashingPassword(userPassword) {
    const data = await bcrypt_1.default.hash(userPassword, 10);
    return data;
}
//# sourceMappingURL=hasshingPassword.js.map