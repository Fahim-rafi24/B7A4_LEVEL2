"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// all auth routes
router.post('/register', auth_controller_1.signup);
router.post('/login', auth_controller_1.login);
router.get('/me', auth_middleware_1.authenticate, auth_controller_1.getProfile);
router.post('/refresh', auth_controller_1.refresh);
router.post('/logout', auth_controller_1.logout);
exports.default = router;
