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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategory = createCategory;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
exports.getAllCategories = getAllCategories;
const category_validator_1 = require("../validators/category.validator");
const categoryService = __importStar(require("../services/category.service"));
const apiResponse_util_1 = require("../utils/apiResponse.util");
const http_status_1 = require("../config/http_status");
async function createCategory(req, res, next) {
    try {
        const { name, description } = category_validator_1.createCategorySchema.parse(req.body);
        const category = await categoryService.createCategory(name, description);
        return (0, apiResponse_util_1.sendSuccess)(res, category, http_status_1.httpStatus.CREATED, 'Category created successfully');
    }
    catch (err) {
        next(err);
    }
}
async function updateCategory(req, res, next) {
    try {
        const data = category_validator_1.updateCategorySchema.parse(req.body);
        const category = await categoryService.updateCategory(req.params.id, data);
        return (0, apiResponse_util_1.sendSuccess)(res, category, http_status_1.httpStatus.OK, 'Category updated successfully');
    }
    catch (err) {
        next(err);
    }
}
async function deleteCategory(req, res, next) {
    try {
        await categoryService.deleteCategory(req.params.id);
        return (0, apiResponse_util_1.sendSuccess)(res, null, http_status_1.httpStatus.OK, 'Category deleted successfully');
    }
    catch (err) {
        next(err);
    }
}
async function getAllCategories(req, res, next) {
    try {
        const categories = await categoryService.findAllCategories();
        return (0, apiResponse_util_1.sendSuccess)(res, categories, http_status_1.httpStatus.OK, 'Categories fetched successfully');
    }
    catch (err) {
        next(err);
    }
}
