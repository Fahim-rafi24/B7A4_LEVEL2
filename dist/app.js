"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const property_routes_1 = __importDefault(require("./routes/property.routes"));
const landlord_routes_1 = __importDefault(require("./routes/landlord.routes"));
const rental_routes_1 = __importDefault(require("./routes/rental.routes"));
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
const review_routes_1 = __importDefault(require("./routes/review.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const paymentController = __importStar(require("./controllers/payment.controller"));
const error_middleware_1 = require("./middlewares/error.middleware");
const env_1 = require("./config/env");
const app = (0, express_1.default)();
app.use('/api/payments/webhook', express_1.default.raw({ type: 'application/json' }), paymentController.handleStripeWebhook);
app.use((0, cors_1.default)({
    origin: env_1.env.SITE_URL,
    credentials: true,
}));
app.use(express_1.default.json({
    limit: env_1.env.URL_FILE_SIZE
}));
app.use(express_1.default.urlencoded({
    extended: true,
    limit: env_1.env.URL_FILE_SIZE
}));
app.use(express_1.default.static("public"));
app.use((0, cookie_parser_1.default)());
app.use('/api/auth', auth_routes_1.default);
app.use('/api/properties', property_routes_1.default);
app.use('/api/categories', category_routes_1.default);
// Landlord Management check it
app.use('/api/landlord', landlord_routes_1.default); //  PUT-> /api/landlord/properties/:id    DELETE-> /api/landlord/properties/:id
app.use('/api/rentals', rental_routes_1.default);
app.use('/api/payments', payment_routes_1.default);
app.use('/api/reviews', review_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/user', user_routes_1.default);
app.use(error_middleware_1.errorHandler);
exports.default = app;
