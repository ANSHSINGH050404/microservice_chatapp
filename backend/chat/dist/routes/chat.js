"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const isAuth_1 = require("../middlewares/isAuth");
const chat_1 = require("../controllers/chat");
const multer_1 = require("../middlewares/multer");
const router = express_1.default.Router();
router.post("/chat/new", isAuth_1.isAuth, chat_1.createNewChat);
router.get("/chat/all", isAuth_1.isAuth, chat_1.getAllChat);
router.post("/message", isAuth_1.isAuth, multer_1.upload.single('image'), chat_1.sendMessage);
router.get("/message/:chatId", isAuth_1.isAuth, chat_1.getMessageByChat);
exports.default = router;
