"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessageByChat = exports.sendMessage = exports.getAllChat = exports.createNewChat = void 0;
const axios_1 = __importDefault(require("axios"));
const TryCatch_1 = __importDefault(require("../config/TryCatch"));
const Chat_1 = require("../models/Chat");
const Message_1 = require("../models/Message");
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
    const userId = req.user?._id;
    if (!userId) {
        res.status(400).json({
            message: "UserId missing",
        });
        return;
    }
    const chats = await Chat_1.Chat.find({ users: userId }).sort({ updatedAt: -1 });
    const chatWithUserData = await Promise.all(chats.map(async (chat) => {
        const otherUserId = chat.users.find((id) => id !== userId);
        const unseenCount = await Message_1.Messages.countDocuments({
            chatId: chat._id,
            sender: { $ne: userId },
            seen: false,
        });
        try {
            const { data } = await axios_1.default.get(`${process.env.USER_SERVICES}/api/v1/user/${otherUserId}`);
            return {
                user: data,
                chat: {
                    ...chat.toObject(),
                    latestMessage: chat.latestMessage || null,
                    unseenCount,
                },
            };
        }
        catch (error) {
            console.log(error);
            return {
                user: { _id: otherUserId, name: "Unknown User" },
                chat: {
                    ...chat.toObject(),
                    latestMessage: chat.latestMessage || null,
                    unseenCount,
                },
            };
        }
    }));
    res.json({
        chats: chatWithUserData,
    });
});
exports.sendMessage = (0, TryCatch_1.default)(async (req, res) => {
    const senderId = req.user?._id;
    const { chatId, text } = req.body;
    const imageFile = req.file;
    if (!senderId) {
        res.status(401).json({
            message: "Unauthorized",
        });
        return;
    }
    if (!chatId) {
        res.status(400).json({
            message: "ChatId Required",
        });
        return;
    }
    if (!text && imageFile) {
        res.status(400).json({
            message: "Either text or image required",
        });
        return;
    }
    const chat = await Chat_1.Chat.findById(chatId);
    if (!chat) {
        res.status(404).json({
            message: "Chat not found",
        });
        return;
    }
    const isUserInChat = chat.users.some((userId) => userId.toString() === senderId.toString());
    if (!isUserInChat) {
        res.status(403).json({
            message: "You are not a participant of this chat",
        });
        return;
    }
    const otherUserId = chat.users.find((userId) => userId.toString() !== senderId.toString());
    if (!otherUserId) {
        res.status(401).json({
            message: "No other user",
        });
        return;
    }
    //Socket setup
    let messageData = {
        chatId: chatId,
        sender: senderId,
        seen: false,
        seenAt: undefined,
    };
    if (imageFile) {
        messageData.image = {
            url: imageFile.path,
            publicId: imageFile.fieldname,
        };
        messageData.messageType = "image";
        messageData.text = text || "";
    }
    else {
        messageData.text = text;
        messageData.messageType = "text";
    }
    const message = new Message_1.Messages(messageData);
    const savedMessage = await message.save();
    const latestMessageText = imageFile ? "📷 Image" : text;
    await Chat_1.Chat.findByIdAndUpdate(chatId, {
        latestMessage: {
            text: latestMessageText,
            sender: senderId,
        },
        updatedAt: new Date(),
    }, {
        new: true,
    });
    //emit to sockets
    res.status(201).json({
        message: savedMessage,
        sender: senderId,
    });
});
exports.getMessageByChat = (0, TryCatch_1.default)(async (req, res) => {
    const userId = req.user?._id;
    const { chatId } = req.params;
    if (!userId) {
        res.status(401).json({
            message: "Unauthorized",
        });
        return;
    }
    if (!chatId) {
        res.status(400).json({
            message: "ChatId Required",
        });
        return;
    }
    const chat = await Chat_1.Chat.findById(chatId);
    if (!chat) {
        res.status(401).json({
            message: "No other user",
        });
        return;
    }
    const isUserInChat = chat.users.some((userId) => userId.toString() !== userId.toString());
    if (!isUserInChat) {
        res.status(403).json({
            message: "You are not a participant of this Chat",
        });
        return;
    }
    const messagesToMarkSeen = await Message_1.Messages.find({
        chatId: chatId,
        sender: { $ne: userId },
        seen: false,
    });
    await Message_1.Messages.updateMany({
        chatId: chatId,
        sender: { $ne: userId },
        seen: false,
    }, {
        seen: true,
        seenAt: new Date(),
    });
    const messages = await Message_1.Messages.find({ chatId }).sort({ createdAt: 1 });
    const otherUserId = chat.users.find((id) => id !== userId);
    try {
        const { data } = await axios_1.default.get(`${process.env.USER_SERVICE}/api/v1/user/${otherUserId}`);
        if (!otherUserId) {
            res.status(400).json({
                message: "No Other User"
            });
            return;
        }
        //socket work
        res.json({
            messages,
            user: data,
        });
    }
    catch (error) {
        console.log(error);
        res.json({
            messages,
            user: { _id: otherUserId, name: "Unknow User" }
        });
    }
});
