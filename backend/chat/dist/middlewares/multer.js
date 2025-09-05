"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.default,
    params: {
        folder: "chat-images",
        allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
        transformation: [
            { width: 800, height: 600, crop: "limit" },
            { quality: "auto" }
        ],
    },
});
exports.upload = (0, multer_1.default)({
    storage,
    limits: {
        fieldSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("/image/")) {
            cb(null, true);
        }
        else {
            cb(new Error("only image allowed"));
        }
    },
});
