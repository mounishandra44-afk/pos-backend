"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = require("../middlewares/authentication");
const settingsController_1 = require("./settingsController");
const authorization_1 = require("../middlewares/authorization");
const DataValidation_1 = require("../middlewares/DataValidation");
const settings = express_1.default.Router();
settings.get("/", authentication_1.authenticate, authorization_1.requireAdmin, settingsController_1.getAdminData);
settings.put("/", authentication_1.authenticate, authorization_1.requireAdmin, settingsController_1.uploadSettingsQr, settingsController_1.normalizeSettingsPayload, DataValidation_1.updatedData, DataValidation_1.validateAdminData, settingsController_1.updateAdminSettings);
exports.default = settings;
//# sourceMappingURL=SettingsRoute.js.map