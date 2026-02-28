"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = require("../middlewares/authentication");
const settingsController_1 = require("./settingsController");
const settings = express_1.default.Router();
settings.get("/", authentication_1.authenticate, settingsController_1.getAdminData);
exports.default = settings;
//# sourceMappingURL=SettingsRoute.js.map