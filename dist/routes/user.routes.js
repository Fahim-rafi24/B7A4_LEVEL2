"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
router.get('/me', auth_middleware_1.authenticate, auth_controller_1.getProfile);
// import { mediaUpload } from '../middlewares/media.middleware';
// import { sendError, sendSuccess } from '../utils/apiResponse.util';
// import { httpStatus } from '../config/http_status';
// router.post('/create_files', mediaUpload, (req, res) => {
//     try {
//         const list_of_urls = (req as any).list_of_urls;
//         // console.log(list_of_urls);
//         return sendSuccess(res, [{ list_of_urls }], httpStatus.CREATED, 'All Files Uploded Successfully');
//     } catch (error) {
//         return sendError(res, httpStatus.INTERNAL_SERVER_ERROR, 'Failed to create user', error);
//     }
// });
exports.default = router;
