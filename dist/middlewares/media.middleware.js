"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const env_1 = require("../config/env");
const apiResponse_util_1 = require("../utils/apiResponse.util");
const http_status_1 = require("../config/http_status");
const getSubFolder = (ext) => {
    const extension = ext.toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(extension))
        return 'img';
    if (['.mp4', '.mkv', '.avi', '.mov', '.wmv'].includes(extension))
        return 'video';
    if (['.mp3', '.wav', '.ogg', '.aac'].includes(extension))
        return 'audio';
    if (['.pdf'].includes(extension))
        return 'pdf';
    if (['.csv'].includes(extension))
        return 'csv';
    return 'others';
};
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        const ext = path_1.default.extname(file.originalname);
        const subFolder = getSubFolder(ext);
        const targetDir = path_1.default.join(process.cwd(), 'public', 'uploads', subFolder);
        if (!fs_1.default.existsSync(targetDir)) {
            fs_1.default.mkdirSync(targetDir, { recursive: true });
        }
        cb(null, targetDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path_1.default.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
});
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: env_1.env.MULTER_FILE_SIZE * 1024 * 1024
    }
}).any();
// const upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 45 * 1024 * 1024
//     }
// }).array('files', 5);
const mediaUpload = (req, res, next) => {
    upload(req, res, function (err) {
        if (err instanceof multer_1.default.MulterError) {
            return (0, apiResponse_util_1.sendError)(res, http_status_1.httpStatus.BAD_REQUEST, 'Failed to upload files', err);
        }
        else if (err) {
            return (0, apiResponse_util_1.sendError)(res, http_status_1.httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload files', err);
        }
        const files = req.files;
        const list_of_urls = [];
        if (files && Array.isArray(files) && files.length > 0) {
            files.forEach((file) => {
                const ext = path_1.default.extname(file.originalname);
                const subFolder = getSubFolder(ext);
                const fileUrl = `/uploads/${subFolder}/${file.filename}`;
                list_of_urls.push({
                    name: file.fieldname,
                    url: fileUrl
                });
            });
        }
        req.list_of_urls = list_of_urls;
        next();
    });
};
exports.mediaUpload = mediaUpload;
