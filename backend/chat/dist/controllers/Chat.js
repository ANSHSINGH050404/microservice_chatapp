"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllChat = exports.createNewChat = void 0;
const TryCatch_1 = __importDefault(require("../config/TryCatch"));
const Chat_1 = require("../models/Chat");
exports.createNewChat = (0, TryCatch_1.default)(async (req, res) => {
    const userId = req.user?._id;
    const { otherUserId } = req.body;
    if (!otherUserId) {
        res.status(400).json({
            message: "Other userid is required",
        });
        return;
    }
    const existingChat = await Chat_1.Chat.findOne({
        users: { $all: [userId, otherUserId], $size: 2 },
    });
    if (existingChat) {
        res.json({
            message: "Chat already exits",
            chatId: existingChat._id,
        });
        return;
    }
    const newChat = await Chat_1.Chat.create({
        users: [userId, otherUserId],
    });
    res.json({
        message: "New Chat Created",
        chatId: newChat._id,
    });
});
exports.getAllChat = (0, TryCatch_1.default)(async (req, res) => {
    const userId = req.body?._id;
    if (!userId) {
        res.status(400).json({
            message: "UserId missing",
        });
        return;
    }
    const chats = await Chat_1.Chat.find({ users: userId }).sort({ updatedAt: -1 });
    const chatWithUserData = await Promise.all(chats.map(async (chat) => {
        const otherUserId = chat.users.find((id) => id !== userId);
    }));
});
