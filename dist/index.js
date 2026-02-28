"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const LoginRoute_1 = __importDefault(require("../src/controllers/LoginRoute"));
const ProductRoute_1 = __importDefault(require("./controllers/ProductRoute"));
const transationRoute_1 = __importDefault(require("./controllers/transationRoute"));
const ReportRoute_1 = __importDefault(require("./controllers/ReportRoute"));
const cors_1 = __importDefault(require("cors"));
require("./cron/checkingSubscriptionStatus.cron");
const SettingsRoute_1 = __importDefault(require("./controllers/SettingsRoute"));
// "http://localhost:9002"
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ["http://localhost:9002", "http://192.168.0.23:9002", "https://quickledger-bill.netlify.app", "https://quick-ledger.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express_1.default.json());
app.use("/user", LoginRoute_1.default);
app.use("/product", ProductRoute_1.default);
app.use("/transaction", transationRoute_1.default);
app.use("/report", ReportRoute_1.default);
app.use("/settings", SettingsRoute_1.default);
app.listen(8000, () => console.log("the app is started 8000"));
//# sourceMappingURL=index.js.map