"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const isAuth_1 = require("../middlewares/isAuth");
const chat_1 = require("../controllers/chat");
const router = express_1.default.Router();
router.post("/chat/new", isAuth_1.isAuth, chat_1.createNewChat);
exports.default = router;
